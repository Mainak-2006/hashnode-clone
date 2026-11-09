/**
 * Repeatable API smoke test.
 *
 * Runs the real Express app against a temporary in-memory MongoDB, so it does
 * not touch development data. Usage:
 *
 *   npm run test:api --prefix server
 */
process.env.NODE_ENV = 'test';
process.env.USE_MEMORY_DB = 'true';
process.env.JWT_SECRET = 'smoke-test-only-secret';
process.env.CLIENT_URL = 'http://localhost:5173';

const { app } = require('../server');
const { connectDB, disconnectDB } = require('../config/db');

let baseUrl = '';
let passed = 0;
let failed = 0;

const check = (name, condition, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const request = async (method, path, { token, body, rawBody } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined || rawBody !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { status: response.status, data };
};

const run = async () => {
  await connectDB();

  const server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;

  try {
    console.log('\nHealth & auth');
    const health = await request('GET', '/health');
    check('health returns 200', health.status === 200, `got ${health.status}`);
    check('health reports a connected database', health.data?.database === 'connected');

    const emailA = `smoke-a-${Date.now()}@example.com`;
    const emailB = `smoke-b-${Date.now()}@example.com`;

    const registerA = await request('POST', '/auth/register', {
      body: { name: 'Smoke Author A', email: emailA, password: 'password123' },
    });
    check('register user A returns 201', registerA.status === 201, `got ${registerA.status}`);
    check('register returns a token', Boolean(registerA.data?.token));
    check('register returns a sanitized user', Boolean(registerA.data?.user?.id) && !('password' in (registerA.data?.user || {})));

    const tokenA = registerA.data?.token;
    const userAId = registerA.data?.user?.id;

    const duplicate = await request('POST', '/auth/register', {
      body: { name: 'Smoke Author A', email: emailA, password: 'password123' },
    });
    check('duplicate email returns 400', duplicate.status === 400, `got ${duplicate.status}`);

    const registerB = await request('POST', '/auth/register', {
      body: { name: 'Smoke Author B', email: emailB, password: 'password123' },
    });
    check('register user B returns 201', registerB.status === 201, `got ${registerB.status}`);
    const tokenB = registerB.data?.token;
    const userBId = registerB.data?.user?.id;

    const badLogin = await request('POST', '/auth/login', {
      body: { email: emailA, password: 'wrong-password' },
    });
    check('wrong password returns 401', badLogin.status === 401, `got ${badLogin.status}`);

    const login = await request('POST', '/auth/login', {
      body: { email: emailA, password: 'password123' },
    });
    check('login returns 200 and a token', login.status === 200 && Boolean(login.data?.token));

    const me = await request('GET', '/auth/me', { token: tokenA });
    check('GET /auth/me returns the current user', me.status === 200 && me.data?.user?.id === userAId);

    const meAnon = await request('GET', '/auth/me');
    check('GET /auth/me without a token returns 401', meAnon.status === 401);

    const meInvalid = await request('GET', '/auth/me', { token: 'not-a-real-token' });
    check('GET /auth/me with an invalid token returns 401', meInvalid.status === 401);

    console.log('\nPost creation & public reads');
    const draft = await request('POST', '/posts', {
      token: tokenA,
      body: {
        title: 'Smoke Draft Post',
        content: '# Draft\n\nPrivate body with **markdown**.',
        tags: ['smoke-private'],
        status: 'draft',
      },
    });
    check('create draft returns 201', draft.status === 201, `got ${draft.status}`);
    check('draft status is draft', draft.data?.post?.status === 'draft');
    check('draft has a generated slug', draft.data?.post?.slug === 'smoke-draft-post');
    check('draft has an excerpt', Boolean(draft.data?.post?.excerpt));
    check('draft has reading time', draft.data?.post?.readingTime >= 1);
    check('draft is attached to the author', draft.data?.post?.author?.id === userAId);
    const draftId = draft.data?.post?.id;
    const draftSlug = draft.data?.post?.slug;

    const published = await request('POST', '/posts', {
      token: tokenA,
      body: {
        title: 'Smoke Published Post',
        content: '# Published\n\nA public body with `code`.',
        tags: ['smoke-node', 'smoke-express'],
        status: 'published',
      },
    });
    check('create published post returns 201', published.status === 201);
    check('published post is published', published.data?.post?.status === 'published');
    const publishedId = published.data?.post?.id;
    const publishedSlug = published.data?.post?.slug;

    const otherPublished = await request('POST', '/posts', {
      token: tokenB,
      body: {
        title: 'Smoke Other Author Post',
        content: '# Other\n\nAnother public post.',
        tags: ['smoke-node'],
        status: 'published',
      },
    });
    check('second author can publish', otherPublished.status === 201);
    const otherId = otherPublished.data?.post?.id;

    const feed = await request('GET', '/posts');
    check('public feed returns 200', feed.status === 200);
    const feedSlugs = (feed.data?.posts || []).map((post) => post.slug);
    check('public feed includes published posts', feedSlugs.includes(publishedSlug));
    check('public feed excludes drafts', !feedSlugs.includes(draftSlug));
    check('public feed includes pagination metadata', Boolean(feed.data?.pagination?.total));
    check('public feed never exposes a password', !JSON.stringify(feed.data).includes('password'));

    const search = await request('GET', '/posts?q=published');
    check('title search returns matches', search.status === 200 && search.data?.posts?.some((post) => post.slug === publishedSlug));
    check('title search excludes drafts', !(search.data?.posts || []).some((post) => post.slug === draftSlug));

    const paged = await request('GET', '/posts?limit=1&page=2');
    check('pagination returns a single page item', paged.status === 200 && paged.data?.posts?.length <= 1);
    check('pagination reports hasMore/totalPages', typeof paged.data?.pagination?.hasMore === 'boolean' && typeof paged.data?.pagination?.totalPages === 'number');

    const draftBySlug = await request('GET', `/posts/${draftSlug}`);
    check('draft is hidden by direct slug (404)', draftBySlug.status === 404, `got ${draftBySlug.status}`);

    const publishedBySlug = await request('GET', `/posts/${publishedSlug}`);
    check('published post is readable by slug', publishedBySlug.status === 200 && publishedBySlug.data?.post?.id === publishedId);

    console.log('\nOwnership & drafts');
    const mine = await request('GET', '/posts/mine', { token: tokenA });
    check('GET /posts/mine returns own posts', mine.status === 200 && mine.data?.posts?.length === 2);
    check('GET /posts/mine includes drafts', (mine.data?.posts || []).some((post) => post.id === draftId));

    const mineDrafts = await request('GET', '/posts/mine?status=draft', { token: tokenA });
    check('GET /posts/mine?status=draft filters correctly', mineDrafts.status === 200 && mineDrafts.data?.posts?.length === 1);

    const ownDraft = await request('GET', `/posts/id/${draftId}`, { token: tokenA });
    check('owner can load a draft by id', ownDraft.status === 200 && ownDraft.data?.post?.id === draftId);

    const anonDraft = await request('GET', `/posts/id/${draftId}`);
    check('anonymous cannot load a draft by id (401)', anonDraft.status === 401);

    const otherDraft = await request('GET', `/posts/id/${draftId}`, { token: tokenB });
    check('non-owner cannot load a draft by id (403)', otherDraft.status === 403, `got ${otherDraft.status}`);

    const otherUpdate = await request('PUT', `/posts/${publishedId}`, {
      token: tokenB,
      body: { title: 'Hijacked title' },
    });
    check('non-owner update returns 403', otherUpdate.status === 403, `got ${otherUpdate.status}`);

    const otherDelete = await request('DELETE', `/posts/${publishedId}`, { token: tokenB });
    check('non-owner delete returns 403', otherDelete.status === 403, `got ${otherDelete.status}`);

    const ownerUpdate = await request('PUT', `/posts/${publishedId}`, {
      token: tokenA,
      body: { title: 'Smoke Published Post Updated', content: '# Updated\n\nNew body.', tags: ['smoke-node'] },
    });
    check('owner update returns 200', ownerUpdate.status === 200, `got ${ownerUpdate.status}`);
    check('owner update regenerates the slug', ownerUpdate.data?.post?.slug === 'smoke-published-post-updated');
    check('owner update refreshes the excerpt', Boolean(ownerUpdate.data?.post?.excerpt));

    const newSlug = ownerUpdate.data?.post?.slug;
    const oldSlug = await request('GET', `/posts/${publishedSlug}`);
    check('old slug is retired after rename (404)', oldSlug.status === 404);
    const newSlugRead = await request('GET', `/posts/${newSlug}`);
    check('new slug resolves', newSlugRead.status === 200);

    console.log('\nValidation');
    const missingTitle = await request('POST', '/posts', {
      token: tokenA,
      body: { content: 'Body only' },
    });
    check('missing title returns 400', missingTitle.status === 400);

    const missingContent = await request('POST', '/posts', {
      token: tokenA,
      body: { title: 'No body' },
    });
    check('missing content returns 400', missingContent.status === 400);

    const badStatus = await request('POST', '/posts', {
      token: tokenA,
      body: { title: 'Bad status', content: 'Body', status: 'archived' },
    });
    check('invalid status returns 400', badStatus.status === 400);

    const tooManyTags = await request('POST', '/posts', {
      token: tokenA,
      body: { title: 'Too many tags', content: 'Body', tags: ['a', 'b', 'c', 'd', 'e', 'f'] },
    });
    check('more than 5 tags returns 400', tooManyTags.status === 400);

    const notArrayTags = await request('POST', '/posts', {
      token: tokenA,
      body: { title: 'Bad tags', content: 'Body', tags: 'node' },
    });
    check('non-array tags returns 400', notArrayTags.status === 400);

    const badId = await request('GET', '/posts/id/not-an-id', { token: tokenA });
    check('invalid post id returns 400', badId.status === 400);

    const duplicateTitle = await request('POST', '/posts', {
      token: tokenA,
      body: { title: 'Smoke Published Post Updated', content: 'Another body', status: 'published' },
    });
    check('duplicate title gets a unique slug suffix', duplicateTitle.status === 201 && duplicateTitle.data?.post?.slug === 'smoke-published-post-updated-2');

    console.log('\nTags');
    const tags = await request('GET', '/tags');
    check('GET /tags returns 200', tags.status === 200);
    const smokeNode = (tags.data?.tags || []).find((tag) => tag.slug === 'smoke-node');
    const privateTag = (tags.data?.tags || []).find((tag) => tag.slug === 'smoke-private');
    check('tag list includes published-post counts', smokeNode?.count >= 2);
    check('tag used only by drafts has count 0', privateTag?.count === 0);

    const tagPosts = await request('GET', '/tags/smoke-node/posts');
    check('GET /tags/:slug/posts returns published posts', tagPosts.status === 200 && tagPosts.data?.posts?.length >= 1);
    check('tag posts exclude drafts', !(tagPosts.data?.posts || []).some((post) => post.status === 'draft'));

    const missingTag = await request('GET', '/tags/does-not-exist/posts');
    check('unknown tag returns 404', missingTag.status === 404);

    console.log('\nUsers & profiles');
    const profileA = await request('GET', `/users/${userAId}`);
    check('GET /users/:id returns 200', profileA.status === 200);
    check('public profile returns safe fields only', Boolean(profileA.data?.user?.name) && !('email' in (profileA.data?.user || {})) && !('password' in (profileA.data?.user || {})));
    check('public profile includes published posts', (profileA.data?.posts || []).length >= 1);
    check('public profile excludes drafts', (profileA.data?.posts || []).every((post) => post.status === 'published'));
    check('public profile never includes the draft id', !(profileA.data?.posts || []).some((post) => post.id === draftId));

    const updateMe = await request('PUT', '/users/me', {
      token: tokenA,
      body: {
        name: 'Smoke Author A Updated',
        bio: 'Updated bio from the smoke test.',
        avatarUrl: 'https://example.com/avatar.png',
      },
    });
    check('PUT /users/me returns 200', updateMe.status === 200, `got ${updateMe.status}`);
    check('profile update persists name', updateMe.data?.user?.name === 'Smoke Author A Updated');
    check('profile update persists bio', updateMe.data?.user?.bio === 'Updated bio from the smoke test.');

    const badAvatar = await request('PUT', '/users/me', {
      token: tokenA,
      body: { avatarUrl: 'not-a-url' },
    });
    check('invalid avatar URL returns 400', badAvatar.status === 400);

    const emptyProfileUpdate = await request('PUT', '/users/me', { token: tokenA, body: {} });
    check('empty profile update returns 400', emptyProfileUpdate.status === 400);

    const badUserId = await request('GET', '/users/not-an-id');
    check('invalid user id returns 400', badUserId.status === 400);

    const missingUser = await request('GET', '/users/507f1f77bcf86cd799439011');
    check('missing user returns 404', missingUser.status === 404);

    console.log('\nErrors & cleanup');
    const unknownRoute = await request('GET', '/route-that-does-not-exist');
    check('unknown route returns 404', unknownRoute.status === 404);

    const malformed = await request('POST', '/auth/login', { rawBody: '{' });
    check('malformed JSON returns 400', malformed.status === 400, `got ${malformed.status}`);

    const deleteOwn = await request('DELETE', `/posts/${otherId}`, { token: tokenB });
    check('owner can delete a post', deleteOwn.status === 200 && deleteOwn.data?.id === otherId);

    const deletedRead = await request('GET', `/posts/${otherPublished.data?.post?.slug}`);
    check('deleted post is gone', deletedRead.status === 404);

    await request('DELETE', `/posts/${draftId}`, { token: tokenA });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await disconnectDB();
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
};

run().catch(async (error) => {
  console.error('\nSmoke test crashed:', error);
  await disconnectDB().catch(() => {});
  process.exit(1);
});

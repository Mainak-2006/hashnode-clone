require('dotenv').config();

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const slugify = require('../utils/slugify');
const buildExcerpt = require('../utils/excerpt');

const DEMO_PASSWORD = 'password123';

const USERS = [
  {
    key: 'demo',
    name: 'Demo Author',
    email: 'demo@hashnode.dev',
    bio: 'Writing about JavaScript, Node.js, and building useful things for the web.',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    key: 'ada',
    name: 'Ada Lovelace',
    email: 'ada@hashnode.dev',
    bio: 'Frontend engineer. Interested in React, accessibility, and the history of computing.',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    key: 'grace',
    name: 'Grace Hopper',
    email: 'grace@hashnode.dev',
    bio: 'Backend and infrastructure. Docker, TypeScript, and shipping small systems well.',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
  },
];

const md = (...lines) => lines.join('\n');

const POSTS = [
  {
    author: 'demo',
    title: 'Building a Production-Ready REST API with Express and MongoDB',
    slug: 'building-a-production-ready-rest-api-with-express-and-mongodb',
    tags: ['node', 'express', 'mongodb'],
    coverImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# Building a Production-Ready REST API',
      '',
      'A small Express API is easy. An API you can **operate** is a different exercise. This post walks through the structure I use for production services.',
      '',
      '## Start with a predictable layout',
      '',
      '- `config/` for database and environment wiring',
      '- `models/` for schemas and validation',
      '- `controllers/` for request handling',
      '- `middleware/` for auth, errors, and cross-cutting concerns',
      '- `utils/` for small, testable helpers',
      '',
      '## Centralize errors',
      '',
      'Throw typed errors from controllers and let one middleware translate them into responses.',
      '',
      '```js',
      'const notFound = (req, _res, next) => {',
      '  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));',
      '};',
      '```',
      '',
      '## Validate at the boundary',
      '',
      'Mongoose validation is useful, but request validation belongs near the request. Reject bad input early and return a readable message.',
      '',
      '| Layer | Responsibility |',
      '| --- | --- |',
      '| Route | Authentication and route shape |',
      '| Controller | Request validation and response |',
      '| Model | Persistence invariants |',
      '',
      '> The goal is not ceremony. The goal is knowing where a failure happened.',
      '',
      '## Ship the boring parts',
      '',
      'Health checks, graceful shutdown, pagination caps, and consistent status codes are not glamorous. They are the difference between a demo and a service.'
    ),
  },
  {
    author: 'demo',
    title: 'A Practical Guide to JWT Authentication in React',
    slug: 'a-practical-guide-to-jwt-authentication-in-react',
    tags: ['react', 'jwt', 'security'],
    coverImage:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# JWT Authentication in React',
      '',
      'Authentication is a loop: obtain a token, attach it to requests, restore the session, and clear it when it expires.',
      '',
      '## The client-side loop',
      '',
      '1. Log in and receive `{ token, user }`',
      '2. Persist the token',
      '3. Attach `Authorization: Bearer <token>` to every request',
      '4. Call `/auth/me` on load to restore the user',
      '5. Clear the token on `401`',
      '',
      '```js',
      'api.interceptors.request.use((config) => {',
      '  const token = localStorage.getItem(TOKEN_KEY);',
      '  if (token) config.headers.Authorization = `Bearer ${token}`;',
      '  return config;',
      '});',
      '```',
      '',
      '## What not to do',
      '',
      '- Do not trust a decoded token on the client for authorization decisions.',
      '- Do not keep a stale token after the API rejects it.',
      '- Do not store passwords or refresh secrets in the browser.',
      '',
      'Server-side ownership checks are still mandatory. A valid token proves identity, not permission.',
      '',
      '> Authentication answers *who*. Authorization answers *what they may do*.'
    ),
  },
  {
    author: 'ada',
    title: 'Markdown for Developers: Write Docs That Render Everywhere',
    slug: 'markdown-for-developers-write-docs-that-render-everywhere',
    tags: ['markdown', 'writing', 'documentation'],
    coverImage:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# Markdown for Developers',
      '',
      'Markdown is the lingua franca of developer writing. It is readable as plain text and renders into rich documents.',
      '',
      '## Use structure, not decoration',
      '',
      'A heading is a navigation landmark, not a font size. Keep one `#` per document and let `##` and `###` describe sections.',
      '',
      '## Code fences need a language',
      '',
      '````markdown',
      '```ts',
      'type Post = { title: string; tags: string[] };',
      '```',
      '````',
      '',
      'The language hint drives syntax highlighting and gives readers useful context.',
      '',
      '## GFM extras that earn their keep',
      '',
      '- [x] Task lists for checklists',
      '- [ ] Tables for comparisons',
      '- ~~Strikethrough~~ for superseded notes',
      '',
      '| Feature | Why it helps |',
      '| --- | --- |',
      '| Tables | Compare options quickly |',
      '| Task lists | Track progress in a post |',
      '| Autolinks | Keep references short |',
      '',
      '> Write for the reader who is skimming. Then reward the reader who stays.'
    ),
  },
  {
    author: 'ada',
    title: 'Understanding useEffect Without the Guesswork',
    slug: 'understanding-useeffect-without-the-guesswork',
    tags: ['react', 'javascript'],
    coverImage:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# Understanding useEffect',
      '',
      '`useEffect` is not a lifecycle method. It is a way to synchronize a component with something outside React.',
      '',
      '## The dependency array is the contract',
      '',
      '```jsx',
      'useEffect(() => {',
      '  const controller = new AbortController();',
      '  fetchPosts(controller.signal);',
      '  return () => controller.abort();',
      '}, [query]);',
      '```',
      '',
      'The effect runs after render. The cleanup runs before the next run and on unmount.',
      '',
      '## Common mistakes',
      '',
      '1. Omitting values the effect reads',
      '2. Using an effect for derived state',
      '3. Forgetting to cancel async work',
      '4. Treating the cleanup as optional',
      '',
      '## A simple rule',
      '',
      'If a value changes and the effect should react to it, it belongs in the dependency array. If it does not, the effect should not read it.',
      '',
      '> Prefer deriving values during render. Reach for an effect only when you need to synchronize with the outside world.'
    ),
  },
  {
    author: 'grace',
    title: 'Docker for Side Projects: A Minimal Setup',
    slug: 'docker-for-side-projects-a-minimal-setup',
    tags: ['docker', 'devops'],
    coverImage:
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# Docker for Side Projects',
      '',
      'You do not need a Kubernetes cluster for a weekend project. A small Dockerfile and Compose file are enough.',
      '',
      '## A small production image',
      '',
      '```dockerfile',
      'FROM node:22-alpine',
      'WORKDIR /app',
      'COPY package*.json ./',
      'RUN npm ci --omit=dev',
      'COPY . .',
      'ENV NODE_ENV=production',
      'CMD ["node", "server.js"]',
      '```',
      '',
      '## Compose for local development',
      '',
      '```yaml',
      'services:',
      '  api:',
      '    build: ./server',
      '    ports:',
      '      - "5000:5000"',
      '    environment:',
      '      MONGO_URI: mongodb://mongo:27017/app',
      '  mongo:',
      '    image: mongo:7',
      '```',
      '',
      '## Keep secrets out of the image',
      '',
      'Pass configuration at runtime. Do not bake `.env` files into a layer that gets pushed to a registry.',
      '',
      '> Containers are packaging, not architecture. Start simple and add pieces when a real problem demands them.'
    ),
  },
  {
    author: 'grace',
    title: 'TypeScript Utility Types I Actually Use',
    slug: 'typescript-utility-types-i-actually-use',
    tags: ['typescript', 'javascript'],
    coverImage:
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# TypeScript Utility Types I Actually Use',
      '',
      'TypeScript ships a toolbox of utility types. A handful cover most day-to-day work.',
      '',
      '## Pick and Partial',
      '',
      '```ts',
      'type Post = { id: string; title: string; body: string; tags: string[] };',
      'type PostPreview = Pick<Post, "id" | "title">;',
      'type Draft = Partial<Post>;',
      '```',
      '',
      '## Record for lookup tables',
      '',
      '```ts',
      'const statusLabel: Record<"draft" | "published", string> = {',
      '  draft: "Draft",',
      '  published: "Published",',
      '};',
      '```',
      '',
      '## ReturnType and Parameters',
      '',
      'These are useful when wrapping functions without copying their signatures by hand.',
      '',
      '| Utility | Use it for |',
      '| --- | --- |',
      '| `Pick` | Narrow an object type |',
      '| `Partial` | Patch payloads |',
      '| `Record` | Keyed maps |',
      '| `ReturnType` | Derive function output |',
      '',
      '> If a utility type makes the code harder to read, write the type out. Cleverness is not the goal.'
    ),
  },
  {
    author: 'ada',
    title: 'CSS Grid vs Flexbox: Choosing the Right Layout',
    slug: 'css-grid-vs-flexbox-choosing-the-right-layout',
    tags: ['css', 'frontend'],
    coverImage:
      'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# CSS Grid vs Flexbox',
      '',
      'Grid and flexbox solve different problems. The shortest heuristic: **flexbox for a row or column, grid for a two-dimensional layout**.',
      '',
      '## Flexbox',
      '',
      'Use flexbox when items flow along one axis and the content should decide the size.',
      '',
      '```css',
      '.toolbar {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 0.5rem;',
      '}',
      '```',
      '',
      '## Grid',
      '',
      'Use grid when rows and columns both matter, or when you want consistent tracks.',
      '',
      '```css',
      '.cards {',
      '  display: grid;',
      '  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));',
      '  gap: 1rem;',
      '}',
      '```',
      '',
      '## They compose',
      '',
      'A page can use grid for the shell and flexbox inside each card. Reach for the simpler tool at each level.',
      '',
      '> Responsive layout is mostly about deciding what should wrap and what should stay aligned.'
    ),
  },
  {
    author: 'demo',
    title: 'Shipping a MERN App: From Localhost to Production',
    slug: 'shipping-a-mern-app-from-localhost-to-production',
    tags: ['deployment', 'mern', 'devops'],
    coverImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    content: md(
      '# Shipping a MERN App',
      '',
      'Deployment is where assumptions meet reality. Here is the checklist I use before a MERN app goes live.',
      '',
      '## Environment',
      '',
      '- Set `NODE_ENV=production`',
      '- Use a real `JWT_SECRET`',
      '- Point `MONGO_URI` at a managed database',
      '- Restrict CORS to the deployed client origin',
      '',
      '## Client build',
      '',
      '```bash',
      'npm ci',
      'npm run build',
      '```',
      '',
      '## SPA routing',
      '',
      'Deep links like `/posts/hello` must rewrite to `index.html`. Otherwise a hard refresh returns a 404 from the host.',
      '',
      '## Smoke test the live URL',
      '',
      '1. Register and log in',
      '2. Publish a post',
      '3. Open it from the feed',
      '4. Search and filter by tag',
      '5. Open a profile',
      '6. Delete the post',
      '',
      '> Deploy early enough that the last day is for verification, not discovery.'
    ),
  },
];

// A draft remains private so the seed demonstrates draft privacy and the dashboard.
const DRAFTS = [
  {
    author: 'demo',
    title: 'Notes on Scaling a Small Blog',
    slug: 'notes-on-scaling-a-small-blog',
    tags: ['architecture', 'node'],
    content: md(
      '# Notes on Scaling a Small Blog',
      '',
      'This is a draft. It should never appear in the public feed, a tag page, a profile, or by direct slug.',
      '',
      '- Cache the public feed',
      '- Add indexes before traffic arrives',
      '- Measure before optimizing'
    ),
  },
];

async function resolveTags(names = []) {
  const ids = [];

  for (const name of names) {
    const trimmed = String(name).trim().toLowerCase();
    const slug = slugify(trimmed);
    if (!slug) continue;

    let tag = await Tag.findOne({ $or: [{ slug }, { name: trimmed }] });
    if (!tag) {
      tag = await Tag.create({ name: trimmed, slug });
    }
    ids.push(tag._id);
  }

  return ids;
}

const seed = async () => {
  if (process.env.USE_MEMORY_DB === 'true') {
    console.warn(
      '⚠️  USE_MEMORY_DB=true starts a temporary database for this seed process.\n' +
        '    The seeded data is discarded when it exits. Use a real MONGO_URI to persist seed data.'
    );
  }

  await connectDB();

  const usersByKey = {};

  for (const spec of USERS) {
    let user = await User.findOne({ email: spec.email }).select('+password');

    if (user) {
      user.name = spec.name;
      user.bio = spec.bio;
      user.avatarUrl = spec.avatarUrl;
      user.password = DEMO_PASSWORD;
      await user.save();
      console.log(`Updated user: ${spec.email}`);
    } else {
      user = await User.create({
        name: spec.name,
        email: spec.email,
        password: DEMO_PASSWORD,
        bio: spec.bio,
        avatarUrl: spec.avatarUrl,
      });
      console.log(`Created user: ${spec.email}`);
    }

    usersByKey[spec.key] = user;
  }

  for (const spec of [...POSTS, ...DRAFTS]) {
    const author = usersByKey[spec.author];
    const tagIds = await resolveTags(spec.tags);
    const status = DRAFTS.includes(spec) ? 'draft' : 'published';

    const post = await Post.findOneAndUpdate(
      { slug: spec.slug },
      {
        title: spec.title,
        slug: spec.slug,
        content: spec.content,
        excerpt: buildExcerpt(spec.content),
        coverImage: spec.coverImage || '',
        status,
        author: author._id,
        tags: tagIds,
      },
      { returnDocument: 'after', upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    console.log(`${status === 'published' ? 'Published' : 'Draft   '} post: ${post.slug}`);
  }

  console.log('\nDemo credentials:');
  for (const user of USERS) {
    console.log(`  ${user.email} / ${DEMO_PASSWORD}`);
  }

  await disconnectDB();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await disconnectDB().catch(() => {});
  process.exit(1);
});

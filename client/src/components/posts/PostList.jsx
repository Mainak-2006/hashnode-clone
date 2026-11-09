import { FileText } from 'lucide-react';
import EmptyState from '../ui/EmptyState';
import ErrorMessage from '../ui/ErrorMessage';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';

export default function PostList({
  posts = [],
  loading = false,
  error = '',
  onRetry,
  emptyTitle = 'Nothing here yet',
  emptyBody,
  emptyIcon = FileText,
  emptyAction,
  skeletonCount = 6,
  className = '',
}) {
  const grid = `grid grid-cols-1 gap-5 min-[620px]:grid-cols-2 lg:grid-cols-3 ${className}`.trim();

  if (loading) {
    return (
      <div className={grid} aria-busy="true" aria-label="Loading posts">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        body={emptyBody}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={grid}>
      {posts.map((post) => (
        <PostCard key={post.id || post.slug} post={post} />
      ))}
    </div>
  );
}

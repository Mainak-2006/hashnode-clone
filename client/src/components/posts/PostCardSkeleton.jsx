import Skeleton from '../ui/Skeleton';

export default function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-soft">
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-[30px] rounded-full" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>
    </div>
  );
}

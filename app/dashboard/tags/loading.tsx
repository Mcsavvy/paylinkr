import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-between space-y-4 pt-4 md:flex-row md:space-y-0">
          <Skeleton className="h-4 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

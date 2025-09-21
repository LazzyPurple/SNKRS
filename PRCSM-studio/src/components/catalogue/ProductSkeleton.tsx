export default function ProductSkeleton() {
  return (
    <div className="bg-black border-2 border-white animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-800" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Vendor */}
        <div className="h-3 bg-gray-700 rounded w-16" />
        
        {/* Title - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-3/4" />
        </div>
        
        {/* Price */}
        <div className="h-5 bg-gray-700 rounded w-20" />
        
        {/* Button */}
        <div className="h-10 bg-gray-700 rounded w-full" />
      </div>
    </div>
  );
}
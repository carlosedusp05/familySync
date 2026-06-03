// src/components/ui/MenuStartSkeleton.jsx

export function MenuStartSkeleton() {
  // <--- Veja o "export function" sem o "default"
  return (
    <div className="w-[77%] h-[82%] md:w-[85%] md:h-[88%] xl:w-[76%] xl:h-[82%] 2xl:w-[72%] 2xl:h-[80%] bg-[#fffcf4] rounded-3xl p-10 xl:px-20 animate-pulse flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end w-full content-end mb-4">
        <div className="space-y-2 w-1/3">
          <div className="h-7 bg-gray-300 rounded-md w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded-md w-1/4"></div>
      </div>

      {/* Grid Superior */}
      <div className="grid grid-cols-10 gap-4 flex-1">
        <div className="col-span-4 bg-gray-200 rounded-2xl h-32 md:h-full"></div>
        <div className="col-span-4 bg-gray-200 rounded-2xl h-32 md:h-full"></div>
        <div className="col-span-2 bg-gray-200 rounded-2xl h-32 md:h-full"></div>
      </div>

      {/* Grid Inferior */}
      <div className="grid grid-cols-11 gap-4 flex-[1.2]">
        <div className="col-span-4 bg-gray-200 rounded-2xl h-40 md:h-full"></div>
        <div className="col-span-4 bg-gray-200 rounded-2xl h-40 md:h-full"></div>
        <div className="col-span-3 bg-gray-200 rounded-2xl h-40 md:h-full"></div>
      </div>
    </div>
  );
}

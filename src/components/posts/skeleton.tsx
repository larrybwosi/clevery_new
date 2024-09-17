import { View, TouchableOpacity } from 'react-native';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

const PostSkeleton = () => {
  return (
    <View className="p-2.5 mb-1">
      {/* Author Info Skeleton */}
      <View className='flex-row items-center'>
        <TouchableOpacity>
          <Skeleton className="mr-2.5 w-[50px] h-[50px] rounded-full" />
        </TouchableOpacity>
        <View className='flex-1'>
          <SkeletonText className="w-1/3 h-4 mb-1" />
          <SkeletonText className="w-1/4 h-3" />
        </View>
        <SkeletonText className="w-16 h-3" />
      </View>

      {/* Content Skeleton */}
      <View className="flex-1 flex-col justify-center p-1 items-center mt-2">
        <SkeletonText className="w-full h-4 mb-2" />
        <SkeletonText className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-full h-[230px] rounded-lg" />
      </View>

      {/* Tags Skeleton */}
      <View className="flex-row flex-wrap gap-1 mt-2">
        {[1, 2, 3].map((_, index) => (
          <SkeletonText key={index} className="w-16 h-6 rounded-full" />
        ))}
      </View>

      {/* Comments Skeleton */}
      <View className="flex-row items-center gap-4xs py-[2.5px] mt-2">
        <View className="flex-row overflow-hidden w-12.5">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="w-4 h-4 rounded-full mr-[-10px]" />
          ))}
        </View>
        <SkeletonText className="w-32 h-4" />
      </View>

      {/* Action Stats Skeleton */}
      <View className='flex-row justify-between mt-2'>
        <View className='flex-row mb-2.5 mt-5 gap-3'>
          <SkeletonText className="w-16 h-6" />
          <SkeletonText className="w-6 h-6" />
          <SkeletonText className="w-6 h-6" />
        </View>
        <SkeletonText className="w-6 h-6" />
      </View>
    </View>
  );
};

const PostsSkeleton = () => {
  return (
    <View className="flex-1">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </View>
  );
};
export default PostsSkeleton;
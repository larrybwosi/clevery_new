import React, { useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Pressable, View } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';

import { ErrorMessage, Loader, Text } from '@/components';
import PostsSkeleton from '@/components/posts/skeleton';
import Post from '@/components/posts';
import { postsApi } from '@/lib/actions/posts';
import { queryKeys } from '@/lib/actions/hooks/posts';


export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.posts,
    queryFn: ({ pageParam = 1 }) => postsApi.getPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      // Check if there are more pages based on totalPages in metadata
      return lastPage.metadata.currentPage < lastPage.metadata.totalPages
        ? lastPage.metadata.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const keyExtractor = useCallback((item) => item?.id.toString(), []);

  const renderItem = useCallback(({ item }) => (
    <Post key={item?.id} {...item} />
  ), []);

  if (isLoading) return <Loader loadingText="Loading your feed" />;

  if (isError) return <ErrorMessage message='Something went wrong' onRetry={handleRefresh} />;

  const handlePress = async () => {
    // router.navigate('/welcome')
  };

  // Flatten posts data from all pages
  const flattenedData = data?.pages.flatMap(page => page.posts) || [];

  return (
    <View className='pt-7.5 flex-1'>
      <Pressable onPress={handlePress}>
        <Text className='font-rmedium text-2xl mb-5'>Your Feed</Text>
      </Pressable>
      <FlashList
        data={flattenedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<PostsSkeleton />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        estimatedItemSize={166}
        ListFooterComponent={() => 
          isFetchingNextPage ? <Loader loadingText="Loading more posts" /> : null
        }
      />
    </View>
  );
}
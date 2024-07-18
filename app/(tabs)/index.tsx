import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { ErrorMessage, Loader, Post, View } from '@/components';
import { useGetInfinitePosts } from '@/lib';
import PostsSkeleton from '@/components/skeletons/posts';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: posts,
    isPending: feedLoading,
    isError: postsError,
    refetch: refetchPosts,
    hasNextPage,
    fetchNextPage 
  } = useGetInfinitePosts();
 
  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
    refetchPosts();
  };
  const loadNextPage = () => {
    if (!hasNextPage) return 
    fetchNextPage();
  };

  if (feedLoading) return <PostsSkeleton/>;
  // if (postsError)return <ErrorMessage message="There was an error communicating with the servers. Please ensure you have an internet connection then refresh" onRetry={() => handleRefresh()} />
  

  const renderItem = ({ item }: { item: any }) => {
    return <Post key={item?._id} props={item} />;
  }; 
  const keyExtractor = (item: any) => item?._id;
  
  return (
    <View className='pt-7.5 flex-1'>
      <FlatList
        data={posts?.pages[0]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<PostsSkeleton/>}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5} 
        refreshing={refreshing}
        onRefresh={() => handleRefresh()}
        onEndReached={()=>loadNextPage()}
      />
    </View>
  );
}
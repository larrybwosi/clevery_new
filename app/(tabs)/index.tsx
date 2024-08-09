import { useState } from 'react';
import { FlatList } from 'react-native';
import { ErrorMessage, Loader, Post, View } from '@/components';
import { usePosts } from '@/lib';
import PostsSkeleton from '@/components/skeletons/posts';

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: posts,
    isPending: feedLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = usePosts({
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
    refetchPosts();
  };
  if (feedLoading) return <Loader/>;
  if (postsError)return <ErrorMessage message="There was an error communicating with the servers. Please ensure you have an internet connection then refresh" onRetry={() => handleRefresh()} />
  

  const keyExtractor = (item: any) => item?.id;
  
  return (
    <View className='pt-7.5 flex-1'>
      <FlatList
        data={posts?.pages[0].posts}
        renderItem={({ item }) => <Post key={item?.id} {...item} />}
        keyExtractor={keyExtractor}
        ListEmptyComponent={<PostsSkeleton/>}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5} 
        refreshing={refreshing}
        onRefresh={() => handleRefresh()}
      />
    </View>
  );
}
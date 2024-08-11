import { useState, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import searchApi from '@/lib/actions/search';
import useDebounce from '@/lib/hooks/useDebounce';
import { useTopCreators } from './users';
import { useTopServers } from './servers';

const DEBOUNCE_DELAY = 300; // milliseconds

type SearchType = 'all' | 'posts' | 'users' | 'servers';

export const useCombinedSearch = (initialQuery: string = '', initialType: SearchType = 'all') => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const {data: topCreators, isPending: loadingCreators} = useTopCreators();
  const {data: topServers, isPending: loadingServers} = useTopServers();

  // const debouncedSetQuery = useMemo(
  //   () => useDebounce(setQuery, DEBOUNCE_DELAY),
  //   []
  // );

  // TODO: Figure out how to handle errors
  const searchQueries = useQueries({
    queries: [
      {
        queryKey: ['searchPosts', query],
        queryFn: () => searchApi.searchPosts(query),
        enabled: query?.length > 0 && (searchType === 'all' || searchType === 'posts'),
      },
      {
        queryKey: ['searchUsers', query],
        queryFn: () => searchApi.searchUsers(query),
        enabled: query?.length > 0 && (searchType === 'all' || searchType === 'users'),
      },
      {
        queryKey: ['searchServers', query],
        queryFn: () => searchApi.searchServers(query),
        enabled: query?.length > 0 && (searchType === 'all' || searchType === 'servers'),
      },
    ],
  });

  const [postsQuery, usersQuery, serversQuery] = searchQueries;

  const isLoading = searchQueries.some(query => query.isLoading);
  const error = searchQueries.find(query => query.error)?.error;

  return {
    query,
    setQuery: useDebounce(setQuery, DEBOUNCE_DELAY),
    searchType,
    setSearchType,
    results: {
      posts: postsQuery.data || [],
      users: usersQuery.data || [],
      servers: serversQuery.data || [],
    },
    isLoading,
    error,
    postsLoading: postsQuery.isLoading,
    usersLoading: usersQuery.isLoading,
    serversLoading: serversQuery.isLoading,
    postsError: postsQuery.error,
    usersError: usersQuery.error,
    serversError: serversQuery.error,
    topCreators,
    topServers,
    loadingCreators,
    loadingServers
  };
};
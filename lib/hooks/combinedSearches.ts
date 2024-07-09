import { useState, useEffect } from 'react';
import { useGetTopCreators, useGetTopServers, useSearchUser, useSearchAll, useSearchPosts, useGetUsers } from '../react-query/queries';
import useDebounce from './useDebounce';

export const useCombinedSearchResults = (peopleTerm: string, allTerm: string, postsTerm: string) => {
  const { data: topCreators, isPending: loadingCreators } = useGetTopCreators();
  const { data: topServers, isPending: loadingServer } = useGetTopServers();
  const { data: people } = useGetUsers();

  const { data: userRes, isPending: loadingUserRes } = useSearchUser(useDebounce(peopleTerm, 1000));
  const { data: allRes, isPending: loadingAllRes } = useSearchAll(useDebounce(allTerm, 1000));
  const { data: postsRes, isPending: loadingPostsRes } = useSearchPosts(useDebounce(postsTerm, 1000));

  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [resultName, setResultName] = useState('');

  useEffect(() => {
    const combineResults = (...resArrays: any) => resArrays.flatMap((arr: any) => (Array.isArray(arr) ? arr : []));

    const results = combineResults(userRes, allRes, postsRes);
    setSearchResult(results);

    const resultName = results.length > 0 ? (userRes?.length > 0 ? 'people' : allRes?.length > 0 ? 'all' : 'posts') : '';
    setResultName(resultName);
  }, [userRes, allRes, postsRes]);

  return { searchResult, resultName, loadingCreators, loadingServer, loadingUserRes, loadingAllRes, loadingPostsRes, topCreators, topServers, people };
};

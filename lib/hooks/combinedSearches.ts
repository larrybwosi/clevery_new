import { useState, useEffect } from 'react';
import { useGetTopCreators, useGetTopServers, useSearchUser, useSearchAll, useSearchPosts, useGetUsers } from '../react-query/queries';
import useDebounce from './useDebounce';

export const useCombinedSearchResults = (peopleTerm: string, allTerm: string, postsTerm: string) => {
  const { data: topCreators, isPending: loadingCreators, isError: creatorsError } = useGetTopCreators();
  const { data: topServers, isPending: loadingServer, isError: serversError } = useGetTopServers();
  const { data: people, } = useGetUsers();

  const { data: userRes, isPending: loadingUserRes, error: userResError } = useSearchUser(useDebounce(peopleTerm,1000));
  const { data: allRes, isPending: loadingAllRes, error: allResError } = useSearchAll(useDebounce(allTerm,1000));
  const { data: postsRes, isPending: loadingPostsRes, error: postsResError } = useSearchPosts(useDebounce(postsTerm,1000));

  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [resultName, setResultName] = useState('');

  useEffect(() => {
    const combineResults = (...resArrays:any) => {
        const results = [];
        for (const arr of resArrays) {
          if (Array.isArray(arr)) {
            results.push(...arr);
          }
        }
        return results;
      };
    setSearchResult(combineResults(userRes, allRes, postsRes));

    if (userRes?.length > 0) setResultName('people');
    else if (allRes?.length > 0) setResultName('all');
    else if (postsRes?.length > 0) setResultName('posts');
  }, [userRes, allRes, postsRes]);

  return { searchResult, resultName, loadingCreators, loadingServer, creatorsError, 
    serversError, loadingUserRes, userResError, loadingAllRes, allResError, loadingPostsRes, 
    postsResError,topCreators,topServers, people };
};
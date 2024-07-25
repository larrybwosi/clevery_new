/**
 * Represents a post in the search results.
 */
interface PostResult {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
}

/**
 * Represents a user in the search results.
 */
interface UserResult {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string | null;
}

/**
 * Represents a server in the search results.
 */
interface ServerResult {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  slug: string;
}

/**
 * Maps search types to their corresponding result interfaces.
 */
type SearchResultMap = {
  posts: PostResult[];
  users: UserResult[];
  servers: ServerResult[];
};

/**
 * Generic type for search results based on the search type.
 */
type SearchResult<T extends keyof SearchResultMap> = SearchResultMap[T];

/**
 * Performs a search based on the given parameters.
 * @param query - The search query string.
 * @param type - The type of search to perform: 'posts', 'users', or 'servers'.
 * @returns A promise that resolves to the search results.
 * @throws An error if the search fails.
 */
async function search<T extends 'posts' | 'users' | 'servers'>(
  query: string,
  type: T
): Promise<SearchResult<T>> {
  const url = new URL(`http://localhost:3000/api/search`);
  url.searchParams.append('query', query);
  url.searchParams.append('type', type);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results as SearchResult<T>;
}

/**
 * searchApi provides methods to perform searches for posts, users, and servers.
 */
const searchApi = {

  /**
   * Performs a search for all the search types.
   *  @param query - The search query string.
   *  @returns A promise that resolves to an object containing all the search results.
   *  @throws An error if the search fails.
   * */
  search: (query: string) => search<'posts' | 'users' | 'servers'>(query, 'posts'),
  
  /**
   * Performs a search for posts.
   * @param query - The search query string.
   * @returns A promise that resolves to an array of PostResult.
   */
  searchPosts: (query: string) => search<'posts'>(query, 'posts'),

  /**
   * Performs a search for users.
   * @param query - The search query string.
   * @returns A promise that resolves to an array of UserResult.
   */
  searchUsers: (query: string) => search<'users'>(query, 'users'),

  /**
   * Performs a search for servers.
   * @param query - The search query string.
   * @returns A promise that resolves to an array of ServerResult.
   */
  searchServers: (query: string) => search<'servers'>(query, 'servers'),
};

export default searchApi;

// Usage example:
async function performSearch() {
  try {
    const postResults = await searchApi.searchPosts('nextjs');
    console.log('Post results:', postResults);

    const userResults = await searchApi.searchUsers('john');
    console.log('User results:', userResults);

    const serverResults = await searchApi.searchServers('gaming');
    console.log('Server results:', serverResults);
  } catch (error) {
    console.error('Search failed:', error);
  }
}
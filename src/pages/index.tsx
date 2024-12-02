import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import { Post } from "@/types/types";
import { authTokenState, refreshTokenState } from "@/state/atoms";

import withAuth from "@/components/withAuth";
import PostCard from "@/components/PostCard";
import { useApi } from "@/hooks/useApi";
import { ENDPOINTS, METHODS } from "@/constants/api";

const Home = () => {
  const { apiCall } = useApi();

  const authToken = useRecoilValue(authTokenState);
  // const refreshToken = useRecoilValue(refreshTokenState);
  // const userInfo = useRecoilValue(userInfoState);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [authorQuery, setAuthorQuery] = useState<string>("");
  const router = useRouter();

  // Fetch posts on load
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await apiCall<Post[]>(
          ENDPOINTS.posts,
          METHODS.GET,
        );
        setPosts(fetchedPosts);

        // Extract unique authors from the fetched posts
        const uniqueAuthors = [
          ...new Set(fetchedPosts.map((post: Post) => post.authorId)),
        ];
        setAuthors(uniqueAuthors);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      loadPosts();
    }
  }, [authToken]);

  // Fetch user-specific posts
  const handleAuthorSearch = async (authorId: string) => {
    setLoading(true);
    try {
      const userPosts = await apiCall<Post[]>(
        ENDPOINTS.postsByUser(authorId),
        METHODS.GET,
      );
      setPosts(userPosts);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset to all posts
  const resetPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await apiCall<Post[]>(ENDPOINTS.posts, METHODS.GET);
      setPosts(fetchedPosts);
      setAuthorQuery("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50 text-black">
      {/* Main Content */}
      <Box as="main" className="flex-grow p-4">
        {error && <Text color="red.500">{error}</Text>}

        <Box className="mb-4 p-4 bg-white rounded shadow-md" borderWidth="1px">
          {/* Search by title/content */}
          <Box className="mb-4">
            <Input
              placeholder="Search posts by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              list="search-results"
              className="mb-2"
            />
            <datalist id="search-results">
              {searchQuery.length >= 3 &&
                posts.length > 0 &&
                posts
                  .filter(
                    (post) =>
                      post.title.includes(searchQuery) ||
                      post.content.includes(searchQuery),
                  )
                  .map((post) => (
                    <option key={post.id} value={post.title}>
                      {post.title}
                    </option>
                  ))}
            </datalist>
          </Box>

          {/* Search by authorId */}
          <Box>
            <Input
              placeholder="Search posts by author ID..."
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              list="author-results"
              className="mb-2"
            />
            <datalist id="author-results">
              {authors
                .filter((authorId) =>
                  authorId.toLowerCase().includes(authorQuery.toLowerCase()),
                )
                .map((authorId) => (
                  <option key={authorId} value={authorId}>
                    {authorId}
                  </option>
                ))}
            </datalist>
            <Button
              colorScheme="blue"
              onClick={() => handleAuthorSearch(authorQuery)}
              className="ml-2"
              isDisabled={!authorQuery}
            >
              Search by Author
            </Button>
            <Button
              colorScheme="gray"
              variant="outline"
              onClick={resetPosts}
              className="ml-2"
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* Post List */}
        <Box
          className="h-[70vh] overflow-y-auto rounded shadow-md bg-gray-100 p-4"
          borderWidth="1px"
        >
          {loading ? (
            <Box className="flex justify-center items-center">
              <Spinner size="lg" />
            </Box>
          ) : posts.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {posts.map((post: Post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  onClick={() => router.push(`/posts/${post.id}`)}
                />
              ))}
            </VStack>
          ) : (
            <Text className="text-black">No posts available.</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(Home);

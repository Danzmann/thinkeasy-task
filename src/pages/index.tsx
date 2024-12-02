import React, { useEffect, useState } from "react";
import { Box, Button, VStack, Heading, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import { Post } from "@/types/types";
import { fetchPosts } from "@/api/posts";
import { authTokenState, userInfoState } from "@/state/atoms";

import withAuth from "@/components/withAuth";
import PostCard from "@/components/PostCard";

const Home = () => {
  const authToken = useRecoilValue(authTokenState);
  const userInfo = useRecoilValue(userInfoState);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (authToken) {
      loadPosts();
    }
  }, [authToken]);

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50 text-black">
      {/* Main Content */}
      <Box as="main" className="flex-grow p-4">
        {error && <Text color="red.500">{error}</Text>}

        <Box
          className="h-[70vh] overflow-y-auto rounded shadow-md bg-gray-100 p-4"
          borderWidth="1px"
        >
          {posts.length > 0 ? (
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

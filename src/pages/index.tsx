import React, { useEffect, useState } from "react";
import { Box, Button, Text, VStack, Heading } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { Post } from "@/types/types";
import { fetchPosts } from "@/api/posts";
import { authTokenState, userInfoState } from "@/state/atoms";

import withAuth from "@/components/withAuth";

const Home = () => {
  const authToken = useRecoilValue(authTokenState);
  const userInfo = useRecoilValue(userInfoState);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth";
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50 text-black">
      <Box
        className="p-4 bg-white shadow-md flex justify-between items-center"
        as="header"
      >
        <Heading as="h1" size="lg">
          Welcome {userInfo.email}
        </Heading>
        <Button
          colorScheme="red"
          size="sm"
          onClick={handleLogout}
          className="hover:bg-red-600"
        >
          Logout
        </Button>
      </Box>

      <Box as="main" className="flex-grow p-4">
        {error && <Text color="red.500">{error}</Text>}

        <Box
          className="h-[70vh] overflow-y-auto rounded shadow-md bg-white p-4"
          borderWidth="1px"
        >
          {posts.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {posts.map((post: Post) => (
                <Box
                  key={post.id}
                  className="border-b last:border-none py-2 px-2"
                  borderBottomWidth="1px"
                >
                  <Heading as="h2" size="md" className="text-black">
                    {post.title}
                  </Heading>
                  <Text className="text-black">{post.content}</Text>
                </Box>
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

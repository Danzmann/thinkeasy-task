import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Heading, Text, Spinner, Button } from "@chakra-ui/react";

import { fetchPostById } from "@/api/posts";
import { Post } from "@/types/types";

const PostDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (id) {
        try {
          setLoading(true);
          const fetchedPost = await fetchPostById(id as string);
          setPost(fetchedPost);
        } catch (error: any) {
          setError(error.message || "Failed to load post.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box className="p-4 min-h-screen bg-gray-50 text-black">
      {post ? (
        <Box className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-md">
          <Heading as="h1" size="xl" className="text-black mb-4">
            {post.title}
          </Heading>
          <Text className="text-gray-700">{post.content}</Text>
        </Box>
      ) : (
        <Text className="text-black">Post not found.</Text>
      )}

      <Button
        colorScheme="blue"
        onClick={() => router.push("/")}
        className="mb-4"
      >
        Back
      </Button>
    </Box>
  );
};

export default PostDetails;

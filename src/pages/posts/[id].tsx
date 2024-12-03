import React, { useEffect, useState } from "react";
import { Box, Text, Spinner, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useApi } from "@/hooks/useApi";
import { ENDPOINTS, METHODS } from "@/constants/api";
import { Post } from "@/types/types";
import { format } from "date-fns";
import withAuth from "@/components/withAuth";

const PostDetails = () => {
  const router = useRouter();
  const { apiCall } = useApi();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const fetchedPost = await apiCall<Post>(
            ENDPOINTS.postById(id as string),
            METHODS.GET,
          );
          setPost(fetchedPost);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPPpp"); // Format as "Jan 1, 2024, 1:00 PM"
  };

  return (
    <Box className="min-h-screen bg-gray-50 text-black p-4">
      {loading ? (
        <Box className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </Box>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : post ? (
        <VStack
          className="bg-white rounded shadow-md p-6"
          spacing={4}
          align="stretch"
        >
          <Text fontSize="xl" fontWeight="bold">
            {post.title}
          </Text>
          <Text>{post.content}</Text>
          <Text fontSize="sm" color="gray.600">
            Created: {formatDate(post.createdAt)}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Updated: {formatDate(post.updatedAt)}
          </Text>
          <Text fontSize="sm" color="gray.600">
            Author: {post.authorId}
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => router.push("/")}
            alignSelf="flex-start"
          >
            Back to Home
          </Button>
        </VStack>
      ) : (
        <VStack
          className="bg-white rounded shadow-md p-6 text-center"
          spacing={4}
          align="center"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Post Not Found
          </Text>
          <Text fontSize="md" color="gray.600">
            The post you are looking for doesn’t exist or may have been removed.
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => router.push("/")}
            alignSelf="center"
          >
            Back to Home
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default withAuth(PostDetails);

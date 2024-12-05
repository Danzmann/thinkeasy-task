import React from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { format } from "date-fns";
import Head from "next/head";

import { Post } from "@/types/types";
import withAuth from "@/components/withAuth";
import { ENDPOINTS } from "@/constants/api";

interface PostDetailsProps {
  post: Post | null;
  error: string | null;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, error }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPPpp"); // Format as "Jan 1, 2024, 1:00 PM"
  };

  return (
    <Box className="min-h-screen bg-gray-50 text-black p-4">
      {post && (
        <Head>
          <title>{post.title} | Posts Management Application</title>
          <meta name="description" content={post.content.substring(0, 150)} />
          <meta
            name="keywords"
            content="Posts, Blog, Next.js, Chakra UI, React, Details"
          />
          <meta name="author" content={post.authorId} />
        </Head>
      )}
      {error ? (
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  let post: Post | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${ENDPOINTS.postById(id)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}`);
    }

    post = await response.json();
  } catch (err: any) {
    error = err.message || "An unexpected error occurred.";
  }

  return {
    props: {
      post,
      error,
    },
  };
};

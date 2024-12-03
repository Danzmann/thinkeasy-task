import React from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Custom404 = () => {
  const router = useRouter();

  return (
    <Box
      className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-black"
      textAlign="center"
    >
      <VStack spacing={6}>
        <Text fontSize="6xl" fontWeight="bold" color="red.500">
          404
        </Text>
        <Text fontSize="xl" color="gray.600">
          Oops! The page you’re looking for doesn’t exist.
        </Text>
        <Button colorScheme="blue" size="lg" onClick={() => router.push("/")}>
          Go Back Home
        </Button>
      </VStack>
    </Box>
  );
};

export default Custom404;

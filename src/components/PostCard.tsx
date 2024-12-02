import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

interface PostCardProps {
  title: string;
  content: string;
  onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ title, content, onClick }) => {
  return (
    <Box
      className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:shadow-lg transition-all"
      onClick={onClick}
    >
      <Heading as="h1" size="md" className="text-black mb-2 font-bold">
        {title}
      </Heading>
      <Text className="text-gray-700">
        {content.length > 100 ? `${content.slice(0, 100)}...` : content}
      </Text>
    </Box>
  );
};

export default PostCard;

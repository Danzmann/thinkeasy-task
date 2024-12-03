import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

import styles from "./PostCard.module.scss";

interface PostCardProps {
  title: string;
  content: string;
  onClick: () => void;
  isNew?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  content,
  onClick,
  isNew,
}) => {
  return (
    <Box
      className={`p-4 shadow-md rounded-md cursor-pointer hover:shadow-lg ${
        isNew ? styles.animateFlash : "bg-white"
      }`}
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

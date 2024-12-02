import React from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { userInfoState } from "@/state/atoms";

const Header = ({ onLogout }: { onLogout: () => void }) => {
  const userInfo = useRecoilValue(userInfoState);

  return (
    <Box
      className="p-4 bg-white shadow-md flex justify-between items-center text-black"
      as="header"
    >
      <Heading as="h1" size="lg">
        Welcome {userInfo.email}
      </Heading>
      <Button
        colorScheme="red"
        size="sm"
        onClick={onLogout}
        className="hover:bg-red-600"
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;

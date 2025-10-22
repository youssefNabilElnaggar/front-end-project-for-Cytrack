import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../component/sidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function RootLayout() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const isLoginPage = location.pathname === "/login";

  return (
    <Flex>
      {!isLoginPage && token && <Sidebar />}

      <Box
        ml={!isLoginPage && token ? "5px" : "0"}
        p="6"
        w="100%"
        bg="gray.50"
        minH="100vh"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}

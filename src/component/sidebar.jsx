import { VStack, Box, Text, Button, Icon, Flex, Image } from "@chakra-ui/react";
//import { FaHome, FaMapMarkedAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../data/idK77MjS9g_1761036175313.png";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Flex
      direction="column"
      bg="gray.800"
      color="white"
      w="220px"
      h="100hv"
      p="5"
      top="0"
      left="0"
      boxShadow="lg"
    >
      <Box mb="2">
        <img src={logo} />
      </Box>

      <VStack align="stretch" spacing="4" flex="1">
        <Button
          justifyContent="flex-start"
          //   leftIcon={<Icon as={FaHome} />}
          colorScheme={"gray.400"}
          variant="ghost"
          _hover={{ bg: "gray.700" }}
          onClick={() => navigate("/homepage")}
        >
          Home
        </Button>

        <Button
          justifyContent="flex-start"
          //   leftIcon={<Icon as={FaMapMarkedAlt} />}
          variant="ghost"
          colorScheme={"gray.400"}
          marginBottom={"10px"}
          _hover={{ bg: "gray.700" }}
          onClick={() => navigate("/map")}
        >
          Map
        </Button>
      </VStack>

      <Button
        colorScheme="red"
        // leftIcon={<FaSignOutAlt />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Flex>
  );
}

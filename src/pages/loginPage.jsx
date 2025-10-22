import React, { useState } from "react";
import axios from "axios";
import {
  HStack,
  Button,
  Container,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    setError("");

    try {
      const res = await axios.post(
        "https://beyti.cypod.solutions:5000/api-v2/authorization/login_v2",
        {
          user_name: userName,
          password: password,
        }
      );

      const token = res.data.access_token || res.data.token;
      if (!token) throw new Error("No token returned");

      // Save token
      localStorage.setItem("token", token);
      console.log(token);

      // Redirect to /map after successful login
      window.location.href = "/homepage";
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error");
    }
  };

  return (
    <Container mt={10}>
      <Heading textAlign="center" size="lg" mb={8}>
        Login
      </Heading>

      {/* Form wrapper */}
      <form onSubmit={handleLogin}>
        <HStack gap={6}>
          <Flex flex={1}>
            <FormControl isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                placeholder="Enter User Name"
                variant="filled"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
          </Flex>
          <Flex flex={1}>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Enter Password"
                type="password"
                variant="outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </Flex>
        </HStack>

        <Button
          colorScheme="blue"
          width="100%"
          mt={6}
          type="submit" // this triggers handleLogin
        >
          Login
        </Button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </Container>
  );
}

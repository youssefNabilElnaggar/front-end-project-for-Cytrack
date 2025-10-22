"use client";

import {
  Box,
  Container,
  HStack,
  Text,
  Flex,
  Spinner,
  SimpleGrid,
  Heading,
  Button,
  VStack,
} from "@chakra-ui/react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MapPage() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [position, setPosition] = useState({ lat: 53.54, lng: 10 }); // Default position

  function handlePosition([deviceLat, deviceLng]) {
    setPosition({ lat: deviceLat, lng: deviceLng });
  }

  const fetchDevices = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://beyti.cypod.solutions:5000/api-v2/devices/?device_roles=False",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response data:", res.data);
      setDevices(res.data.devices);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch devices. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <VStack align={"center"}>
      <Container maxW="100%" ml={"10px"} mb={"5px"}>
        <APIProvider apiKey="AIzaSyA6XEwD51ojHY3DzGyGHU7uJ1ihNzsmXh4">
          <Flex
            width="full"
            h="60vh"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            mb={6}
          >
            {position && position.lat && position.lng ? (
              <Map
                center={position}
                defaultZoom={12}
                mapId="f8e2417bc3fb3cd02648b03a"
                minZoom={7}
                maxZoom={19}
                style={{ width: "100%", height: "100%" }}
              >
                <AdvancedMarker position={position}>
                  <Pin background="red" borderColor="red" glyphColor="white" />
                </AdvancedMarker>
              </Map>
            ) : (
              <Flex align="center" justify="center" w="full" h="60vh">
                <Spinner size="lg" />
                <Text ml={3}>Loading map...</Text>
              </Flex>
            )}
          </Flex>
        </APIProvider>
      </Container>

      <Container>
        {loading && <Spinner size="xl" />}
        {error && <Text color="red.400">{error}</Text>}
      </Container>
      <Container ml={"10px"} alignItems={"center"}>
        {!loading && !error && (
          <HStack align="center" w={"750px"}>
            {devices && Object.keys(devices).length > 0
              ? Object.entries(devices).map(([type, list]) =>
                  list.map((device, i) => (
                    <Flex
                      key={i}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      width={"250px"}
                    >
                      <Box w={"220px"}>
                        <Heading size="md" mb={3}>
                          {type} {i + 1}
                        </Heading>
                        <Text fontWeight="bold">Name: {device.name}</Text>
                        <Text>ID (IMEI): {device.id}</Text>
                        <Text>Location Type: {device.last_location_type}</Text>
                        <Text>
                          Location: ({device.lat}, {device.lng})
                        </Text>
                        <Button
                          w="100%"
                          mt={3}
                          colorScheme="blue"
                          onClick={() =>
                            handlePosition([device.lat, device.lng])
                          }
                        >
                          View
                        </Button>
                      </Box>
                    </Flex>
                  ))
                )
              : !loading && <Text>No device data found.</Text>}
          </HStack>
        )}
      </Container>
    </VStack>
  );
}

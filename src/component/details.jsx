import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  VStack,
  Container,
  Flex,
  position,
  HStack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

export default function DeviceDetails() {
  const { id } = useParams();
  const [device, setDevice] = useState("");
  const [Position, setPosition] = useState({ lat: 33.123, lng: 33.456 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDevice = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }
      const resAllDevices = await axios.get(
        "https://beyti.cypod.solutions:5000/api-v2/devices/?device_roles=False",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resErrors = await axios.get(
        `https://beyti.cypod.solutions:5000/api-v2/messages/latest?device_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const resOldErrors = await axios.get(
        `https://beyti.cypod.solutions:5000/api-v2/devices/${id}?limit=25`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("All Device  data:", resAllDevices.data);
      // Adjust depending on actual API shape
      setDevice(resErrors);
      console.log("Device errors", resErrors);
      console.log("old errors", resOldErrors);

      if (resErrors.data?.data?.lat && resErrors.data?.data?.lng) {
        setPosition({
          lat: resErrors.data.data.lat,
          lng: resErrors.data.data.lng,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch device details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, [id]);

  function hundlePosition([lat, lng]) {
    setPosition({ lat: lat, lng: lng });
  }

  if (loading)
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (error) return <Text color="red.400">{error}</Text>;

  if (!device)
    return (
      <Box p={8}>
        <Text>No data available for this device.</Text>
      </Box>
    );

  const dev = device.data.data;

  return (
    <Container maxW="container.lg" p={"5px"}>
      <Button onClick={() => navigate(-1)} mb={4}>
        ← Back
      </Button>

      <Heading mb={6}>Device Details</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} align="start">
        <GridItem>
          <VStack>
            <Flex height={"100%"} w={"full"} mb={4}>
              <Box height={"100%"} w={"full"} mb={4}>
                <Text>
                  <b>type:</b> {dev.device.device_type} (
                  {dev.device.device_subtype})
                </Text>
                <Text>
                  <b>ID:</b> {id}
                </Text>
                <Text>
                  <b>Battery:</b> {battery(dev.battery)}%
                </Text>
                <Text>
                  <b>Last Location type:</b> {dev.last_location_type}
                </Text>
                <Text>
                  <b>Coordinates:</b> ({dev.lat}, {dev.lng})
                </Text>

                {device.errors ? (
                  <Box mt={3}>
                    <Heading size="sm">Errors:</Heading>
                    <Text color="red.400">{device.errors}</Text>
                  </Box>
                ) : (
                  <Text color="green.400">✅ No errors found</Text>
                )}
              </Box>
            </Flex>
          </VStack>
        </GridItem>
        <GridItem column={2}>
          <APIProvider apiKey="AIzaSyA6XEwD51ojHY3DzGyGHU7uJ1ihNzsmXh4">
            <Flex
              width="100%"
              h="50vh"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              mb={6}
            >
              {Position && Position.lat && Position.lng ? (
                <Map
                  center={Position}
                  mapId="f8e2417bc3fb3cd02648b03a"
                  defaultZoom={10}
                  minZoom={7}
                  maxZoom={19}
                  style={{ width: "100%", height: "100%" }}
                >
                  <AdvancedMarker position={Position}>
                    <Pin
                      background="red"
                      borderColor="red"
                      glyphColor="white"
                    />
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
        </GridItem>
      </SimpleGrid>
    </Container>
  );
}

function battery(num) {
  if (num == null) return "N/A";
  return ((num / 4.2) * 100).toFixed(2);
}

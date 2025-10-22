import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Button,
  HStack,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import details from "../component/details";

export default function Homepage() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const fetchDevices = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "https://beyti.cypod.solutions:5000/api-v2/devices/?device_roles=False",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response data:", res);
      setDevices(res.data.devices);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Box p={8}>
      <Heading mb={6}>📦 Devices Data</Heading>

      {loading && <Spinner size="xl" />}
      {error && <Text color="red.400">{error}</Text>}

      <SimpleGrid
        align="start"
        spacing={6}
        minChildWidth={"350px"}
        maxChildWidth={"400px"}
        column={2}
      >
        {devices && Object.keys(devices).length > 0
          ? Object.entries(devices).map(([type, list]) => (
              <Box key={type}>
                <Heading size="md" mb={3}>
                  {type}
                </Heading>
                {list.map((device, i) => (
                  <Box key={i} p={4} borderWidth="1px" borderRadius="lg" mb={3}>
                    <Text fontWeight="bold">Name: {device.name}</Text>
                    <Text>ID (IMEI): {device.id}</Text>

                    <Text>Battery: {battary(device.battery)}🔋</Text>
                    <Text>Location Type: {device.last_location_type}</Text>

                    <Button
                      w={"100%"}
                      marginTop={"10px"}
                      marginRight={"5px"}
                      onClick={() => nav(`/details/${device.id}`)}
                    >
                      detalis
                    </Button>
                  </Box>
                ))}
              </Box>
            ))
          : !loading && <Text>No device data found.</Text>}
      </SimpleGrid>
    </Box>
  );
}

function battary(num) {
  // 4.2 max voltage
  //  3  min volt
  const per = (((num - 3) / (4.2 - 3)) * 100).toFixed(2);

  if (num == null) {
    return "N/A";
  } else {
    return per + "%";
  }
}

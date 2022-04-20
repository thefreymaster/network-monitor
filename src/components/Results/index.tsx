import React from "react";
import { GREEN, GREY, ORANGE, RED } from "../../constants";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Box,
  ModalCloseButton,
  ModalFooter,
  Badge,
  Tag,
} from "@chakra-ui/react";
import { Dot } from "../Dot";
import { useIsDay } from "../../providers/IsDayProvider";

export const Results = (props: {
  isOpen: boolean;
  results: any;
  setShowResults(values?: any): void;
}) => {
  const { download, upload, ping } = props.results;
  const { isDay } = useIsDay();

  return (
    <Modal
      size="lg"
      isOpen={props.isOpen}
      onClose={() => props.setShowResults(false)}
      isCentered
    >
      <ModalOverlay />
      <ModalContent backgroundColor={isDay ? "white" : "gray.800"}>
        <ModalHeader color={isDay ? "gray.800" : "gray.200"}>Test Results</ModalHeader>
        <ModalCloseButton color={isDay ? "gray.800" : "gray.200"} onClose={() => props.setShowResults(false)} />
        <ModalBody>
          <Box display="flex" flexDir="row" alignItems="center" height="400px">
            <Box flexGrow={1} />
            <Box display="flex" flexDir="column" alignItems="center">
              <Box
                display="flex"
                flexDir="column"
                alignItems="center"
                margin="10"
              >
                <Box display="flex" flexDir="row" alignItems="center">
                  <Box margin="2">
                    <Dot color={GREY} />
                  </Box>
                  <Text
                    color={isDay ? "gray.800" : "gray.200"}
                    fontSize="large"
                  >
                    Download
                  </Text>
                </Box>
                <Text
                  color={isDay ? "gray.800" : "gray.200"}
                  fontWeight="bold"
                  fontSize="xxx-large"
                >
                  {(download.bandwidth / 125000).toFixed(0)}
                </Text>
                <Badge>Mbps</Badge>
              </Box>
              <Box
                display="flex"
                flexDir="column"
                alignItems="center"
                margin="10"
              >
                <Box display="flex" flexDir="row" alignItems="center">
                  <Box margin="2">
                    <Dot color={GREEN} />
                  </Box>
                  <Text
                    color={isDay ? "gray.800" : "gray.200"}
                    fontSize="large"
                  >
                    Jitter
                  </Text>
                </Box>
                <Text
                  color={isDay ? "gray.800" : "gray.200"}
                  fontWeight="bold"
                  fontSize="x-large"
                >
                  {ping.jitter.toFixed(0)}
                </Text>
                <Badge>ms</Badge>
              </Box>
            </Box>
            <Box flexGrow={2} />
            <Box display="flex" flexDir="column" alignItems="center">
              <Box
                display="flex"
                flexDir="column"
                alignItems="center"
                margin="10"
              >
                <Box display="flex" flexDir="row" alignItems="center">
                  <Box margin="2">
                    <Dot color={RED} />
                  </Box>
                  <Text
                    color={isDay ? "gray.800" : "gray.200"}
                    fontSize="large"
                  >
                    Upload
                  </Text>
                </Box>
                <Text
                  color={isDay ? "gray.800" : "gray.200"}
                  fontWeight="bold"
                  fontSize="xxx-large"
                >
                  {(upload.bandwidth / 125000).toFixed(0)}
                </Text>
                <Badge>Mbps</Badge>
              </Box>
              <Box
                display="flex"
                flexDir="column"
                alignItems="center"
                margin="10"
              >
                <Box display="flex" flexDir="row" alignItems="center">
                  <Box margin="2">
                    <Dot color={ORANGE} />
                  </Box>
                  <Text
                    color={isDay ? "gray.800" : "gray.200"}
                    fontSize="large"
                  >
                    Latency
                  </Text>
                </Box>
                <Text
                  color={isDay ? "gray.800" : "gray.200"}
                  fontWeight="bold"
                  fontSize="x-large"
                >
                  {ping.latency.toFixed(0)}
                </Text>
                <Badge>ms</Badge>
              </Box>
            </Box>
            <Box flexGrow={1} />
          </Box>
          <Box
            display="flex"
            flexDir="column"
            marginTop="6"
            alignItems="center"
          >
            <Box flexGrow={1} />
            <Text
              color={isDay ? "gray.800" : "gray.200"}
              fontWeight="medium"
              fontSize="large"
            >
              {props.results.isp}
            </Text>
            <Box flexGrow={1} />
            <Box display="flex" flexDir="row" marginTop="1" alignItems="center">
              <Tag>
                <Text
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {props.results?.server?.location}
                </Text>
              </Tag>
              <Box flexGrow={1} mr="2" />
              <Tag>
                <Text
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {props.results?.server?.ip}
                </Text>
              </Tag>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

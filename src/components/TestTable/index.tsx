import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
} from "@chakra-ui/react";
import { Dot } from "../Dot";
import { AiOutlineDownload, AiOutlineUpload } from "react-icons/ai";
import { IoIosRadio } from "react-icons/io";
import { GiElectric } from "react-icons/gi";
import { IoCloudOfflineOutline } from "react-icons/io5";
import { useIsDay } from "../../providers/IsDayProvider";

const getColor = (type: string) => {
  const colors = new Map();
  colors.set("download", "#264653");
  colors.set("upload", "#2A9D8F");
  colors.set("jitter", "#F4A261");
  colors.set("ping", "#E76F51");
  colors.set("offline", "#757575");
  return colors.get(type);
};

export const getIcon = (
  type: "download" | "upload" | "jitter" | "ping" | "offline",
  fontSize?: number
) => {
  const colors = new Map();
  colors.set(
    "download",
    <AiOutlineDownload size={fontSize || "18px"} color={getColor(type)} />
  );
  colors.set(
    "upload",
    <AiOutlineUpload size={fontSize || "18px"} color={getColor(type)} />
  );
  colors.set(
    "jitter",
    <IoIosRadio size={fontSize || "18px"} color={getColor(type)} />
  );
  colors.set(
    "ping",
    <GiElectric size={fontSize || "18px"} color={getColor(type)} />
  );
  colors.set(
    "offline",
    <IoCloudOfflineOutline size={fontSize || "18px"} color={getColor(type)} />
  );
  return colors.get(type);
};

export const TestTable = (props: {
  data: Array<any>;
  type: "anomaly" | "tests";
  caption: string;
}) => {
  const reversedAnomalies = [...props.data].reverse();
  const { isDay } = useIsDay();

  return (
    <Table
      variant="simple"
      size="sm"
      backgroundColor={isDay ? "#fff" : "#1A202C"}
      color={isDay ? "gray.800" : "gray.100"}
    >
      <TableCaption
        backgroundColor={isDay ? "#fff" : "#1A202C"}
        color={isDay ? "gray.800" : "gray.100"}
      >
        {props.caption}
      </TableCaption>
      <Thead>
        <Tr>
          {props.type === "anomaly" && (
            <Th color={isDay ? "gray.800" : "gray.100"}>Type</Th>
          )}
          <Th isNumeric color={isDay ? "gray.800" : "gray.100"}>
            Download
          </Th>
          <Th isNumeric color={isDay ? "gray.800" : "gray.100"}>
            Upload
          </Th>
          <Th isNumeric color={isDay ? "gray.800" : "gray.100"}>
            Jitter
          </Th>
          <Th isNumeric color={isDay ? "gray.800" : "gray.100"}>
            Ping
          </Th>
          <Th color={isDay ? "gray.800" : "gray.100"}>Date of Event</Th>
        </Tr>
      </Thead>
      <Tbody>
        {reversedAnomalies.map((anomaly) => (
          <Tr key={`${anomaly.timestamp}-${anomaly.type}`}>
            {props.type === "anomaly" && (
              <Td textAlign="center">
                <Box
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box marginRight="6px">
                    <Dot color={getColor(anomaly.type)} />
                  </Box>
                  {getIcon(anomaly.type)}
                </Box>
              </Td>
            )}
            <Td isNumeric>
              {(anomaly.download.bandwidth / 125000)?.toFixed(0)} Mbps
            </Td>
            <Td isNumeric>
              {(anomaly.upload.bandwidth / 125000)?.toFixed(0)} Mbps
            </Td>
            <Td isNumeric>{anomaly.ping.jitter.toFixed(0)} ms</Td>
            <Td isNumeric>{anomaly.ping.latency.toFixed(0)} ms</Td>
            <Td isNumeric>
              {new Date(anomaly.timestamp).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { Box, Text } from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { Dot } from "../Dot";
import { useIsDay } from "../../providers/IsDayProvider";

const getUnit = (type: string) => {
  const colors = new Map();
  colors.set("download", "Mbps");
  colors.set("upload", "Mbps");
  colors.set("jitter", "ms");
  colors.set("ping", "ms");
  return colors.get(type);
};

const Tooltip = (props: any) => {
  return (
    <Box backgroundColor="white" padding="2" borderRadius="3" boxShadow="xl">
      <Text fontWeight="bold">
        {new Date(props.point?.data?.x).toLocaleString([], {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text>
        {props.point?.data?.y?.toFixed(0)} {getUnit(props.point.serieId)}
      </Text>
    </Box>
  );
};

export const LineGraph = (props: {
  data: any;
  title: string;
  color: string;
}) => {
  const { isDay } = useIsDay();

  return (
    <Box
      margin={isMobile ? "5px" : "0px 20px 0px 0px"}
      maxW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 100px) / 4)"}
      minW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 100px) / 4)"}
      backgroundColor={isDay ? "#fff" : "gray.800"}
      height={isMobile ? "150px" : "250px"}
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      boxShadow="base"
      borderRadius="sm"
    >
      <Box
        mt="1"
        fontWeight="semibold"
        as="h4"
        lineHeight="tight"
        display="flex"
        alignItems="center"
      >
        <Box display="flex" flexDir="row" alignItems="center">
          <Dot color={props.color} />
          {/* <Icon type={props.title.toLowerCase()} /> */}
        </Box>
        <Box marginLeft="1" color={isDay ? "gray.800" : "gray.100"}>
          {props.title}
        </Box>
      </Box>
      <ResponsiveLine
        data={props.data}
        enableArea
        enablePointLabel
        tooltip={Tooltip}
        margin={{ top: 30, right: 0, bottom: 0, left: 30 }}
        curve="natural"
        enablePoints={false}
        useMesh
        enableGridX={false}
        enableGridY={false}
        enableCrosshair
        isInteractive
        axisBottom={null}
        colors={[props.color]}
        crosshairType="x"
      />
    </Box>
  );
};

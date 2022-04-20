import { Box, Text, Button, IconButton } from "@chakra-ui/react";
import { BsHddNetwork } from "react-icons/bs";
import {
  AiOutlineInfoCircle,
  AiOutlinePlayCircle,
  AiOutlineBulb,
  AiFillBulb,
} from "react-icons/ai";
import axios from "axios";
import { isDesktop, isMobile } from "react-device-detect";
import { Health } from "../Health";
import { useIsDay } from "../../providers/IsDayProvider";

export const Navigation = (props) => {
  const { isDay, setIsDay } = useIsDay();
  return (
    <Box
      zIndex={100}
      boxShadow="sm"
      display="flex"
      padding="0px 20px 0px 20px"
      justifyContent="center"
      alignItems="center"
      transition={{ backgroundColor: "1000ms ease-in-out" }}
      style={{
        willChange: "transform",
        width: "100vw",
        height: 60,
        left: 0,
        backgroundColor: isDay ? "#fff" : "#1A202C",
        backdropFilter: "blur(8px)",
      }}
    >
      <BsHddNetwork color={isDay ? "#1A202C" : "white"} />
      <Box marginLeft="10px">
        <Text fontWeight="bold" color={isDay ? "gray.800" : "gray.100"}>
          Network Monitor
        </Text>
      </Box>
      {isDesktop && <Box flexGrow={1} />}
      {isDesktop && props.health?.download && <Health health={props.health} />}
      <Box flexGrow={1} />
      {isDesktop && (
        <>
          <IconButton
            onClick={() => props.setShowDefaults(true)}
            variant="ghost"
            marginRight="3"
            color={isDay ? "gray.800" : "gray.200"}
            backgroundColor={isDay ? "white" : "gray.800"}
            aria-label="Search database"
            _hover={{ backgroundColor: isDay ? "gray.300" : "gray.700" }}
            icon={<AiOutlineInfoCircle />}
          />
          <IconButton
            onClick={() => (isDay ? setIsDay(false) : setIsDay(true))}
            variant="ghost"
            marginRight="3"
            color={isDay ? "gray.800" : "gray.200"}
            backgroundColor={isDay ? "white" : "gray.800"}
            aria-label="Search database"
            _hover={{ backgroundColor: isDay ? "gray.300" : "gray.700" }}
            icon={isDay ? <AiFillBulb /> : <AiOutlineBulb />}
          />
        </>
      )}
      {props?.health && isDesktop && (
        <Button
          isLoading={props.isTesting}
          loadingText="Running"
          color="white"
          colorScheme="gray"
          backgroundColor="gray.600"
          _hover={{ backgroundColor: "gray.700" }}
          onClick={() => axios.get("/api/tests/run")}
        >
          Run Speed Test
        </Button>
      )}
      {props?.health && isMobile && (
        <IconButton
          icon={<AiOutlinePlayCircle />}
          isLoading={props.isTesting}
          color="white"
          colorScheme="gray"
          backgroundColor="gray.600"
          _hover={{ backgroundColor: "gray.700" }}
          onClick={() => axios.get("/api/tests/run")}
        >
          Run Speed Test
        </IconButton>
      )}
    </Box>
  );
};

import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { AiFillBulb, AiOutlineBulb, AiOutlineInfoCircle } from "react-icons/ai";
import { useIsDay } from "../../providers/IsDayProvider";
import { isDesktop } from 'react-device-detect';

export const MobileActions = (props: { setShowDefaults(s: boolean): void }) => {
  const { isDay, setIsDay } = useIsDay();

  if(isDesktop){
      return null;
  }
  return (
    <Box position="fixed" bottom="20px" display="flex" minW="100vw" alignItems="center" justifyContent="center">
      <IconButton
        boxShadow="xl"
        marginRight="3"
        onClick={() => props.setShowDefaults(true)}
        variant="ghost"
        size="lg"
        color={isDay ? "gray.800" : "gray.200"}
        backgroundColor={isDay ? "gray.100" : "gray.700"}
        aria-label="Search database"
        _hover={{ backgroundColor: isDay ? "gray.300" : "gray.700" }}
        icon={<AiOutlineInfoCircle />}
      />
      <IconButton
        boxShadow="xl"
        onClick={() => (isDay ? setIsDay(false) : setIsDay(true))}
        variant="ghost"
        size="lg"
        color={isDay ? "gray.800" : "gray.200"}
        backgroundColor={isDay ? "gray.100" : "gray.700"}
        aria-label="Search database"
        _hover={{ backgroundColor: isDay ? "gray.300" : "gray.700" }}
        icon={isDay ? <AiFillBulb /> : <AiOutlineBulb />}
      />
    </Box>
  );
};

import { Alert, AlertIcon, Box, Slide } from "@chakra-ui/react";

export const ErrorAlert = (props: { isError: boolean }) => {
  if (props.isError) {
    return (
      <Box
        position="absolute"
        bottom="50px"
        left={0}
        right={0}
        ml="auto"
        mr="auto"
        maxWidth="400px"
      >
        <Slide direction='bottom' in={props.isError}>
          <Alert status="error" boxShadow="lg" borderRadius="10px 10px 0px 0px" variant="solid">
            <AlertIcon />
            Please check your connection.  You're offline, or the internet is down.  
          </Alert>
        </Slide>
      </Box>
    );
  }
  return null;
};

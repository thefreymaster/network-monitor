import React from 'react';
import { isMobile } from 'react-device-detect';
import {
    Box, Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Fade,
} from '@chakra-ui/react';

export const OfflineAlert = (props: { setError(status: boolean): void }) => {
    React.useLayoutEffect(() => {
        props.setError(true);
     }, [])
    return (
        <Fade in>
            <Box padding={isMobile ? "2" : "10"} style={{ height: 'calc(100vh - 60px)' }} backgroundColor="#f9f9f9" display="flex" flexDir="column" justifyContent="center" alignItems="center">
                <Alert status='error' maxW="500px">
                    <AlertIcon />
                    <Box display="flex" flexDir="column">
                        <AlertTitle mr={2}>Problems detected!</AlertTitle>
                        <AlertDescription>You're offline, or the internet is down.</AlertDescription>
                    </Box>
                </Alert>
            </Box>
        </Fade>
    )
}
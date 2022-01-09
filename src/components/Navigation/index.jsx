import { Box, Spinner, Text, Button } from '@chakra-ui/react';
import React from 'react';
import { BsHddNetwork } from "react-icons/bs";
import axios from 'axios';

export const Navigation = (props) => {

    return (
        <Box zIndex={100}
            boxShadow="sm"
            display="flex"
            padding="0px 20px 0px 20px"
            justifyContent="center"
            alignItems="center"
            style={{
                willChange: 'transform',
                width: '100vw',
                height: 60,
                left: 0,
                backgroundColor: '#fff',
                backdropFilter: 'blur(8px)',
            }}
        >
            <BsHddNetwork />
            <Box marginLeft="10px">
                <Text fontWeight="bold">Network Monitor</Text>
            </Box>
            <Box flexGrow={1} />
            <Button isLoading={props.isTesting} loadingText='Running' colorScheme='teal' onClick={() => axios.get('/api/tests/run')}>Run Speed Test</Button>
        </Box>
    )
}
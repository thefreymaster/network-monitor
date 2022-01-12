import { Box, Tag, Text, Button, TagLeftIcon, TagLabel, Fade, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { BsHddNetwork } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import axios from 'axios';
import { isDesktop } from 'react-device-detect';
import { AiOutlineDownload, AiOutlineUpload } from 'react-icons/ai';
import { IoIosRadio } from 'react-icons/io';
import { GiElectric } from 'react-icons/gi';
import { GREEN, GREY, ORANGE, RED } from '../../constants';
import { Dot } from '../Dot';

export const Navigation = (props) => {
    const [health, setHealth] = React.useState()
    React.useEffect(() => {
        const getHealth = async () => {
            await axios.get('/api/tests/health').then(res => {
                console.log(res.data);
                setHealth(res.data)
            });
        }
        getHealth();
    }, [])

    React.useEffect(() => {
        props.socket.on("health", (newHealth) => { setHealth(newHealth) })
    }, [])

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
            {isDesktop && <Box flexGrow={1} />}
            {isDesktop && (
                <>
                    <Tooltip label='Download Health'>
                        <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                            <Dot style={{ marginRight: 5 }} color={GREY} />
                            <Text fontWeight="medium" fontSize="small">{health?.download.toFixed(0)}%</Text>
                        </Box>
                    </Tooltip>
                    <Box flexGrow={1} />
                    <Tooltip label='Upload Health'>
                        <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                            <Dot style={{ marginRight: 5 }} color={GREEN} />
                            <Text fontWeight="medium" fontSize="small">{health?.upload.toFixed(0)}%</Text>
                        </Box>
                    </Tooltip>
                    <Box flexGrow={1} />
                    <Tooltip label='Jitter Health'>
                        <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                            <Dot style={{ marginRight: 5 }} color={ORANGE} />
                            <Text fontWeight="medium" fontSize="small">{health?.jitter.toFixed(0)}%</Text>
                        </Box>
                    </Tooltip>
                    <Box flexGrow={1} />
                    <Tooltip label='Latency Health'>
                        <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                            <Dot style={{ marginRight: 5 }} color={RED} />
                            <Text fontWeight="medium" fontSize="small">{health?.latency.toFixed(0)}%</Text>
                        </Box>
                    </Tooltip>
                </>
            )}
            {isDesktop && props.isError && (
                <Fade in={props.isError}>
                    <Tag mr="4" size="lg" colorScheme="red">
                        <TagLeftIcon boxSize='12px' as={FiAlertTriangle} />
                        <TagLabel>Problems Detected</TagLabel>
                    </Tag>
                    <Box flexGrow={1} />
                </Fade>
            )}
            <Box flexGrow={1} />
            <Button isLoading={props.isTesting} loadingText='Running' colorScheme='teal' onClick={() => axios.get('/api/tests/run')}>Run Speed Test</Button>
        </Box>
    )
}
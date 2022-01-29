import { Box, Tag, Text, Button, TagLeftIcon, TagLabel, Fade, IconButton } from '@chakra-ui/react';
import { BsHddNetwork, BsLightbulb } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { AiOutlineInfoCircle, AiOutlinePlayCircle } from "react-icons/ai";
import axios from 'axios';
import { isDesktop, isMobile } from 'react-device-detect';
import { Health } from '../Health';
import { useIsDay } from '../../providers/IsDayProvider';

export const Navigation = (props) => {
    const { isDay, setIsDay } = useIsDay();
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
                backgroundColor: isDay ? '#fff' : '#1A202C',
                backdropFilter: 'blur(8px)',
            }}
        >
            <BsHddNetwork color={isDay ? 'gray.800' : 'white'} />
            {isDesktop && <Box marginLeft="10px">
                <Text fontWeight="bold" color={isDay ? 'gray.800' : 'gray.100'}>Network Monitor</Text>
            </Box>}
            {isDesktop && <Box flexGrow={1} />}
            {isDesktop && props.health?.download && (
                <Health health={props.health} />
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
            <IconButton onClick={() => props.setShowDefaults(true)} variant="ghost" marginRight="3" color="white" backgroundColor={isDay ? "gray.500" : "gray.600"} aria-label='Search database' _hover={{ backgroundColor: "gray.700" }} icon={<AiOutlineInfoCircle />} />
            <IconButton onClick={() => isDay ? setIsDay(false) : setIsDay(true)} variant="ghost" marginRight="3" color="white" backgroundColor={isDay ? "gray.500" : "gray.600"} aria-label='Search database' _hover={{ backgroundColor: "gray.700" }} icon={<BsLightbulb />} />
            {props?.health && isDesktop &&
                <Button isLoading={props.isTesting} loadingText='Running' color="white" colorScheme='gray' backgroundColor="gray.600" _hover={{ backgroundColor: "gray.700" }} onClick={() => axios.get('/api/tests/run')}>
                    Run Speed Test
                </Button>
            }
            {props?.health && isMobile &&
                <IconButton icon={<AiOutlinePlayCircle />} isLoading={props.isTesting} color="white" colorScheme='gray' backgroundColor="gray.600" _hover={{ backgroundColor: "gray.700" }} onClick={() => axios.get('/api/tests/run')}>
                    Run Speed Test
                </IconButton>
            }
        </Box>
    )
}
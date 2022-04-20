import { Box, Text, Fade, Tooltip } from '@chakra-ui/react';
import { GREEN, GREY, ORANGE, RED } from '../../constants';
import { useIsDay } from '../../providers/IsDayProvider';
import { Dot } from '../Dot';
import { getIcon } from '../TestTable';

export const Health = (props: {
    health: {
        download: number;
        upload: number;
        jitter: number;
        latency: number;
    }
}) => {
    const { isDay } = useIsDay();
    return (
        <>
            <Box flexGrow={1} />
            <Tooltip hasArrow label='Download Health'>
                <Fade in>
                    <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                        {/* <Dot style={{ marginRight: 5 }} color={GREY} /> */}
                        {getIcon("download")}
                        <Text fontWeight="medium" fontSize="small" color={isDay ? 'gray.800' : 'gray.100'}>{props.health?.download?.toFixed(0)}%</Text>
                    </Box>
                </Fade>
            </Tooltip>
            <Box flexGrow={1} />
            <Box flexGrow={1} />
            <Tooltip hasArrow label='Upload Health'>
                <Fade in>
                    <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                        {/* <Dot style={{ marginRight: 5 }} color={GREEN} /> */}
                        {getIcon("upload")}
                        <Text fontWeight="medium" fontSize="small" color={isDay ? 'gray.800' : 'gray.100'}>{props.health?.upload?.toFixed(0)}%</Text>
                    </Box>
                </Fade>
            </Tooltip>
            <Box flexGrow={1} />
            {/* <Tooltip hasArrow label='Jitter Health'>
                <Fade in>
                    <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                        <Dot style={{ marginRight: 5 }} color={ORANGE} />
                        <Text fontWeight="medium" fontSize="small">{props.health?.jitter?.toFixed(0)}%</Text>
                    </Box>
                </Fade>
            </Tooltip>
            <Box flexGrow={1} />
            <Tooltip hasArrow label='Latency Health'>
                <Fade in>
                    <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                        <Dot style={{ marginRight: 5 }} color={RED} />
                        <Text fontWeight="medium" fontSize="small">{props.health?.latency?.toFixed(0)}%</Text>
                    </Box>
                </Fade>
            </Tooltip> */}
        </>
    )
}
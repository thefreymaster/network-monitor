import { Box, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import React from 'react';
import { Anomalies } from '../Anomalies';
import { LineGraph } from '../LineGraph';
import { isMobile } from 'react-device-detect';

export const SpeedTests = (props: {
    data: {
        tests: Array<any>,
        averages: {
            download: {
                value: number,
                label: string,
                units: string,
            },
            jitter: {
                value: number,
                label: string,
                units: string,
            },
            ping: {
                value: number,
                label: string,
                units: string,
            },
            upload: {
                value: number,
                label: string,
                units: string,
            },
        }
    }
    anomalies: Array<any>;
}) => {
    return (
        <Box padding={isMobile ? "2" : "10"} style={{ minHeight: 'calc(100vh - 60px)' }} backgroundColor="#f9f9f9" display="flex" flexDir="column" justifyContent="flex-start">
            <Box display="flex" flexDir={isMobile ? "column" : "row"}>
                {Object.entries(props.data?.averages).map(([key, test]) => {
                    return (
                        <Box padding="30px" marginRight={isMobile ? "0px" : "20px"} marginBottom={isMobile ? "10px" : "20px"} display="flex" minW="calc((100vw - 140px) / 4)" backgroundColor="white" boxShadow="base" borderRadius="sm">
                            <Stat>
                                <StatLabel>{test.label}</StatLabel>
                                <StatNumber>{test.value.toFixed(0)} {test.units}</StatNumber>
                            </Stat>
                        </Box>
                    )
                })}
            </Box>
            <Box display="flex" flexDir={isMobile ? "column" : "row"} minW="100%">
                <LineGraph title="Download" color="#264653" data={[
                    {
                        "id": "download",
                        "color": "#FFC09F",
                        "data": props.data.tests.map(test => ({ x: test.createdAt, y: test.downloadSpeed }))
                    }
                ]}
                />
                <LineGraph title="Upload" color="#2A9D8F" data={[
                    {
                        "id": "upload",
                        "color": "hsl(51, 100%, 79%)",
                        "data": props.data.tests.map(test => ({ x: test.createdAt, y: test.uploadSpeed }))
                    }
                ]}
                />
                <LineGraph title="Jitter" color="#F4A261" data={[
                    {
                        "id": "jitter",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.createdAt, y: test.jitter }))
                    }
                ]}
                />
                <LineGraph title="Ping" color="#E76F51" data={[
                    {
                        "id": "ping",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.createdAt, y: test.ping }))
                    }
                ]}
                />
            </Box>
            <Box maxHeight="310px" overflow="auto" padding={isMobile ? "0px" : "30px"} marginTop="20px" marginBottom="20px" display="flex" minW="calc((100vw - 140px) / 4)" backgroundColor="white" boxShadow="base" borderRadius="sm">
                <Anomalies anomalies={props.anomalies.reverse()} />
            </Box>
        </Box>
    )
}
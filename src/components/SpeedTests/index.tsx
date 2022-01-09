import { Box, Stat, Text, StatLabel, StatNumber } from '@chakra-ui/react';
import React from 'react';
import { TestTable } from '../TestTable';
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
        <Box padding={isMobile ? "2" : "10"} style={{ height: 'calc(100vh - 60px)' }} backgroundColor="#f9f9f9" display="flex" flexDir="column" justifyContent="flex-start">
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
            <Box display="flex" flexDir="row">
                <Box textAlign='center' maxHeight="310px" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginRight="20px" marginBottom="20px" display="flex" maxW="calc(50vw - 50px)" minW="calc(50vw - 50px)" backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Anomalies</Text>
                    <TestTable type="anomaly" data={props.anomalies.reverse()} />
                </Box>
                <Box textAlign='center' maxHeight="310px" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginBottom="20px" display="flex" maxW="calc(50vw - 50px)" minW="calc(50vw - 50px)" backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Tests</Text>
                    <TestTable type="tests" data={props.data.tests.reverse()} />
                </Box>
            </Box>
        </Box>
    )
}
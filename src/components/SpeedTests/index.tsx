import { Box, Stat, Text, StatLabel, StatNumber, Alert, Spinner } from '@chakra-ui/react';
import React from 'react';
import { TestTable } from '../TestTable';
import { LineGraph } from '../LineGraph';
import { isMobile } from 'react-device-detect';

const StatValue = (props: { children: any, type: string }) => {
    const type = new Map();
    if (props.type.toLowerCase() === 'download' || props.type.toLowerCase() === 'upload') {
        return (props.children / 100000).toFixed(0);
    }
    return props.children.toFixed(0);
}

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
    if (props.data.tests.length === 0) {
        return (
            <Box  padding={isMobile ? "2" : "10"} style={{ height: 'calc(100vh - 60px)' }} display="flex" flexDir="column" justifyContent="center" alignItems="center">
                <Alert backgroundColor="#319795" borderRadius="md" maxW="md" status='success' variant='solid'>
                    <Spinner mr="4" size="sm" />
                    Running first speed test, please wait
                </Alert>
            </Box>
        )
    }
    return (
        <Box padding={isMobile ? "2" : "10"} style={{ height: 'calc(100vh - 60px)' }} backgroundColor="#f9f9f9" display="flex" flexDir="column" justifyContent="flex-start">
            <Box display="flex" flexDir="row" flexWrap={isMobile ? "wrap" : "inherit"}>
                {Object.entries(props.data?.averages).map(([key, test]) => {
                    return (
                        <Box padding="30px" margin={isMobile ? "5px" : "0px 20px 0px 0px"} marginBottom={isMobile ? "10px" : "20px"} display="flex" maxW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 140px) / 4)"} minW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 140px) / 4)"} backgroundColor="white" boxShadow="base" borderRadius="sm">
                            <Stat>
                                <StatLabel>{test.label}</StatLabel>
                                <StatNumber>
                                    <StatValue type={test.label}>{test.value}</StatValue>
                                    {' '}
                                    {test.units}
                                </StatNumber>
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
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.download?.bandwidth / 100000 }))
                    }
                ]}
                />
                <LineGraph title="Upload" color="#2A9D8F" data={[
                    {
                        "id": "upload",
                        "color": "hsl(51, 100%, 79%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.upload?.bandwidth / 100000 }))
                    }
                ]}
                />
                <LineGraph title="Jitter" color="#F4A261" data={[
                    {
                        "id": "jitter",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.ping?.jitter }))
                    }
                ]}
                />
                <LineGraph title="Ping" color="#E76F51" data={[
                    {
                        "id": "ping",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.ping?.latency }))
                    }
                ]}
                />
            </Box>
            <Box display="flex" flexDir={isMobile ? "column" : "row"}>
                <Box textAlign='center' maxHeight="calc(100vh - 547px)" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginRight="20px" marginBottom="20px" display="flex" maxW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 50px)"} minW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 50px)"} backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Anomalies</Text>
                    <TestTable type="anomaly" data={props.anomalies.reverse()} />
                </Box>
                <Box textAlign='center' maxHeight="calc(100vh - 547px)" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginBottom="20px" display="flex" maxW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 50px)"} minW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 50px)"} backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Tests</Text>
                    <TestTable type="tests" data={props.data.tests.reverse()} />
                </Box>
            </Box>
        </Box>
    )
}
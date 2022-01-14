import { Box, Stat, Text, StatLabel, StatNumber, Alert, Spinner, Fade } from '@chakra-ui/react';
import React from 'react';
import { TestTable } from '../TestTable';
import { LineGraph } from '../LineGraph';
import { isMobile } from 'react-device-detect';
import { Welcome } from '../Welcome';
import { GREEN, GREY, ORANGE, RED } from '../../constants';
import { Health } from '../Health';

const StatValue = (props: { children: any, type: string }) => {
    const type = new Map();
    if (props.type.toLowerCase() === 'download' || props.type.toLowerCase() === 'upload') {
        return (props.children / 125000).toFixed(0);
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
    isTesting: boolean;
    health: {
        download: number;
        upload: number;
        jitter: number;
        latency: number;
    }
}) => {
    if (props.data.tests.length === 0 && props.isTesting) {
        return (
            <Fade in>
                <Box padding={isMobile ? "2" : "10"} style={{ height: 'calc(100vh - 60px)' }} display="flex" flexDir="column" justifyContent="center" alignItems="center">
                    <Alert backgroundColor="#319795" borderRadius="md" maxW="md" status='success' variant='solid'>
                        <Spinner mr="4" size="sm" />
                        Running first speed test, please wait
                    </Alert>
                </Box>
            </Fade>
        )
    }
    if (props.data.tests.length === 0) {
        return (
            <Box maxW="md">
                <Welcome isOpen />
            </Box>
        )
    }
    return (
        <Box padding={isMobile ? "5px" : "20px"} style={{ height: 'calc(100vh - 60px)' }} backgroundColor="#f9f9f9" display="flex" flexDir="column" justifyContent="flex-start">
            {isMobile && (
                <Box display="flex" flexDir="row" margin="10px 20px">
                    <Health health={props.health} />
                </Box>
            )}
            <Box display="flex" flexDir="row" flexWrap={isMobile ? "wrap" : "inherit"}>
                {Object.entries(props.data?.averages).map(([key, test]) => {
                    return (
                        <Box key={key} padding="30px" margin={isMobile ? "5px" : "0px 20px 0px 0px"} marginBottom={isMobile ? "10px" : "20px"} display="flex"
                            maxW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 100px) / 4)"}
                            minW={isMobile ? "calc((100vw - 40px) / 2)" : "calc((100vw - 100px) / 4)"}
                            backgroundColor="white" boxShadow="base" borderRadius="sm">
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
            <Box display="flex" flexWrap={isMobile ? "wrap" : "inherit"} flexDir={isMobile ? "row" : "row"} minW="100%">
                <LineGraph title="Download" color={GREY} data={[
                    {
                        "id": "download",
                        "color": "#FFC09F",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.download?.bandwidth / 125000 }))
                    }
                ]}
                />
                <LineGraph title="Upload" color={GREEN} data={[
                    {
                        "id": "upload",
                        "color": "hsl(51, 100%, 79%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.upload?.bandwidth / 125000 }))
                    }
                ]}
                />
                <LineGraph title="Jitter" color={ORANGE} data={[
                    {
                        "id": "jitter",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.ping?.jitter }))
                    }
                ]}
                />
                <LineGraph title="Ping" color={RED} data={[
                    {
                        "id": "ping",
                        "color": "hsl(268, 70%, 50%)",
                        "data": props.data.tests.map(test => ({ x: test.timestamp, y: test?.ping?.latency }))
                    }
                ]}
                />
            </Box>
            <Box display="flex" flexDir={isMobile ? "column" : "row"}>
                <Box textAlign='center' maxHeight="calc(100vh - 508px)" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginRight="20px" marginBottom="20px" display="flex" maxW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 30px)"} minW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 30px)"} backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Anomalies</Text>
                    <TestTable caption="Today's anomalies" type="anomaly" data={props.anomalies} />
                </Box>
                <Box textAlign='center' maxHeight="calc(100vh - 508px)" flexDir="column" overflow="auto" padding={isMobile ? "0px" : "20px 0px"} marginTop="20px" marginBottom="20px" display="flex" maxW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 30px)"} minW={isMobile ? "calc(100vw - 20px)" : "calc(50vw - 30px)"} backgroundColor="white" boxShadow="base" borderRadius="sm">
                    <Text fontWeight="bold">Tests</Text>
                    <TestTable caption="Today's tests" type="tests" data={props.data.tests} />
                </Box>
            </Box>
        </Box>
    )
}
import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
} from '@chakra-ui/react'
import { IAnomaly, ISpeedtest } from '../../interfaces';
import { Dot } from '../Dot';
import { capitalizeFirstLetter } from '../../utils/upperCaseFirstLetter';

const getColor = (type: string) => {
    const colors = new Map();
    colors.set('download', '#264653');
    colors.set('upload', '#2A9D8F');
    colors.set('jitter', '#F4A261');
    colors.set('ping', '#E76F51');
    return colors.get(type);
}

export const TestTable = (props: {
    data: Array<any>,
    type: 'anomaly' | 'tests'
}) => {
    const reversedAnomalies = [...props.data].reverse();
    return (
        <Table variant='simple' size='sm'>
            <TableCaption>Recently detected anomalies</TableCaption>
            <Thead>
                <Tr>
                    {props.type === 'anomaly' && <Th>Type</Th>}
                    <Th isNumeric>Download</Th>
                    <Th isNumeric>Upload</Th>
                    <Th isNumeric>Jitter</Th>
                    <Th isNumeric>Ping</Th>
                    <Th>Date of Event</Th>
                </Tr>
            </Thead>
            <Tbody>
                {reversedAnomalies.map((anomaly) => (
                    <Tr key={anomaly.createdAt}>
                        {props.type === 'anomaly' && <Td>
                            <Box display="flex" flexDir="row" alignItems="center">
                                <Box marginRight="2">
                                    <Dot color={getColor(anomaly.type)} />
                                </Box>
                                <Box>
                                    {capitalizeFirstLetter(anomaly.type)}
                                </Box>
                            </Box>
                        </Td>}
                        <Td isNumeric>{anomaly.downloadSpeed} Mbps</Td>
                        <Td isNumeric>{anomaly.uploadSpeed} Mbps</Td>
                        <Td isNumeric>{anomaly.jitter} ms</Td>
                        <Td isNumeric>{anomaly.ping} ms</Td>
                        <Td isNumeric>{new Date(anomaly.createdAt).toLocaleDateString()} at {new Date(anomaly.createdAt).toLocaleTimeString()}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}
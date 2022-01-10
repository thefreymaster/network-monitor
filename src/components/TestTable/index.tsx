import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tooltip,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
} from '@chakra-ui/react'
import { Dot } from '../Dot';
import { AiOutlineDownload, AiOutlineUpload } from 'react-icons/ai';
import { IoIosRadio } from 'react-icons/io';
import { GiElectric } from 'react-icons/gi';

const getColor = (type: string) => {
    const colors = new Map();
    colors.set('download', '#264653');
    colors.set('upload', '#2A9D8F');
    colors.set('jitter', '#F4A261');
    colors.set('ping', '#E76F51');
    return colors.get(type);
}

const getIcon = (type: string) => {
    const colors = new Map();
    colors.set('download', <AiOutlineDownload size="18px" color={getColor(type)} />);
    colors.set('upload', <AiOutlineUpload size="18px" color={getColor(type)} />);
    colors.set('jitter', <IoIosRadio size="18px" color={getColor(type)} />);
    colors.set('ping', <GiElectric size="18px" color={getColor(type)} />);
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
                    <Tr key={anomaly.timestamp}>
                        {props.type === 'anomaly' && (
                            <Td textAlign='center'>
                                <Box display="flex" flexDir="row" alignItems="center" justifyContent="center">
                                    <Box marginRight="6px">
                                        <Dot color={getColor(anomaly.type)} />
                                    </Box>
                                    {getIcon(anomaly.type)}
                                </Box>
                            </Td>
                        )}
                        <Td isNumeric>{(anomaly.download.bandwidth / 125000)?.toFixed(0)} Mbps</Td>
                        <Td isNumeric>{(anomaly.upload.bandwidth / 125000)?.toFixed(0)} Mbps</Td>
                        <Td isNumeric>{anomaly.ping.jitter.toFixed(0)} ms</Td>
                        <Td isNumeric>{anomaly.ping.latency.toFixed(0)} ms</Td>
                        <Td isNumeric>{new Date(anomaly.timestamp).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}
import React from 'react';
import { GREEN, GREY, ORANGE, RED } from '../../constants';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    Box,
    ModalCloseButton,
    ModalFooter,
    Badge,
} from '@chakra-ui/react'
import { Dot } from '../Dot';

export const Results = (props: { isOpen: boolean, results: any, setShowResults(values?: any): void }) => {
    const { download, upload, ping } = props.results;
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={() => props.setShowResults(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Test Results</ModalHeader>
                <ModalCloseButton onClose={() => props.setShowResults(false)} />
                <ModalBody>
                    <Box display="flex" flexDir="row" alignItems="center">
                        <Box flexGrow={1} />
                        <Box display="flex" flexDir="column" alignItems="center">
                            <Box display="flex" flexDir="column" alignItems="center" margin="10">
                                <Box display="flex" flexDir="row" alignItems="center">
                                    <Box margin="2">
                                        <Dot color={GREY} />
                                    </Box>
                                    <Text fontSize="large">Download</Text>
                                </Box>
                                <Text fontWeight="bold" fontSize="xxx-large">{(download.bandwidth / 125000).toFixed(0)}</Text>
                                <Badge>Mbps</Badge>
                            </Box>
                            <Box display="flex" flexDir="column" alignItems="center" margin="10">
                                <Box display="flex" flexDir="row" alignItems="center">
                                    <Box margin="2">
                                        <Dot color={GREEN} />
                                    </Box>
                                    <Text fontSize="large">Jitter</Text>
                                </Box>
                                <Text fontWeight="bold" fontSize="x-large">{(ping.jitter).toFixed(0)}</Text>
                                <Badge>ms</Badge>
                            </Box>
                        </Box>
                        <Box flexGrow={2} />
                        <Box display="flex" flexDir="column" alignItems="center">
                            <Box display="flex" flexDir="column" alignItems="center" margin="10">
                                <Box display="flex" flexDir="row" alignItems="center">
                                    <Box margin="2">
                                        <Dot color={RED} />
                                    </Box>
                                    <Text fontSize="large">Upload</Text>
                                </Box>
                                <Text fontWeight="bold" fontSize="xxx-large">{(upload.bandwidth / 125000).toFixed(0)}</Text>
                                <Badge>Mbps</Badge>
                            </Box>
                            <Box display="flex" flexDir="column" alignItems="center" margin="10">
                                <Box display="flex" flexDir="row" alignItems="center">
                                    <Box margin="2">
                                        <Dot color={ORANGE} />
                                    </Box>
                                    <Text fontSize="large">Latency</Text>
                                </Box>
                                <Text fontWeight="bold" fontSize="x-large">{(ping.latency).toFixed(0)}</Text>
                                <Badge>ms</Badge>
                            </Box>
                        </Box>
                        <Box flexGrow={1} />
                    </Box>
                    <Box display="flex" flexDir="row" marginTop="6">
                        <Box flexGrow={1} />
                        <Text fontSize="large">{props.results.isp}</Text>
                        <Box flexGrow={1} />
                    </Box>

                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    )
}
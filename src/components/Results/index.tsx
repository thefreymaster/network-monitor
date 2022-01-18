import React from 'react';
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
} from '@chakra-ui/react'

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
                            <Text fontSize="large">Download</Text>
                            <Box display="flex" flexDir="row" alignItems="center">
                                {/* <Box marginRight="2">{getIcon('download', 48)}</Box> */}
                                <Text fontWeight="bold" fontSize="xxx-large">{(download.bandwidth / 125000).toFixed(0)}</Text>
                                <Text marginLeft="2" fontSize="large">Mbps</Text>
                            </Box>
                            <Box display="flex" flexDir="column" alignItems="center">
                                <Text fontSize="large">Jitter</Text>
                                <Text fontWeight="bold" fontSize="large">{(ping.jitter).toFixed(0)} ms</Text>
                            </Box>
                        </Box>
                        <Box flexGrow={2} />
                        <Box display="flex" flexDir="column" alignItems="center">
                            <Text fontSize="large">Upload</Text>
                            <Box display="flex" flexDir="row" alignItems="center">
                                {/* <Box marginRight="2">{getIcon('upload', 48)}</Box> */}
                                <Text fontWeight="bold" fontSize="xxx-large">{(upload.bandwidth / 125000).toFixed(0)}</Text>
                                <Text marginLeft="2" fontSize="large">Mbps</Text>
                            </Box>
                            <Box display="flex" flexDir="column" alignItems="center">
                                <Text fontSize="large">Latency</Text>
                                <Text fontWeight="bold" fontSize="large">{(ping.latency).toFixed(0)} ms</Text>
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
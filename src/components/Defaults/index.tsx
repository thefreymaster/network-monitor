import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Text,
    Button,
    Box,
    ModalCloseButton,
    Spinner,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import axios from 'axios';
import { BsHddNetwork } from "react-icons/bs";
import { isMobile } from 'react-device-detect';
import { DefaultsForm } from '../Welcome';
import { useQuery } from 'react-query';

export const Defaults = (props: { isOpen: boolean, setShowDefaults(value: boolean): void }) => {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const handleSubmit = async (v: any) => {
        await axios.post('/api/tests/defaults', v);
        setSubmitting(false);
        props.setShowDefaults(false);
    }
    const { isLoading, data } = useQuery('defaults', () => axios.get('/api/tests/defaults').then(res => res.data));

    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={() => props.setShowDefaults(false)}>
            <ModalOverlay />
            <Formik initialValues={{
                ...data
            }}
                onSubmit={(v) => { console.log(v); handleSubmit(v); setSubmitting(true) }}>
                <Form>
                    <ModalContent>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display="flex" alignItems="center" justifyContent="center" flexDir="column">
                            <Box>
                                <Box display="flex" alignItems="center" flexDir="column">
                                    <BsHddNetwork style={{ fontSize: 60 }} />
                                    <Text fontSize={isMobile ? "lg" : "xxx-large"} fontWeight="black">Network Monitor</Text>
                                </Box>
                                <Box marginTop="10" marginBottom="5" display="flex" alignItems="center" justifyContent="center" flexDir="column">
                                    <Text fontSize="sm">Your default settings.</Text>
                                </Box>
                                {isLoading ? <Spinner /> : <DefaultsForm />}
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isSubmitting} type="submit" onClick={() => { }}>Update</Button>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Formik >
        </Modal>
    )
}
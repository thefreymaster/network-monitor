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
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import { Form, Formik, Field } from 'formik'
import axios from 'axios';
import { BsHddNetwork } from "react-icons/bs";
import { isMobile } from 'react-device-detect';

const DefaultsForm = () => {
    return (
        <>
            <Field
                id="download"
                name="download"
                placeholder="800"
                type="number"
            >
                {({ field, form }: { field: any, form: any }) => (
                    <FormControl colorScheme="red" isRequired isInvalid={form.errors.download && form.touched.download}>
                        <FormLabel htmlFor="download">Download (Mbps)</FormLabel>
                        <Input {...field} autoFocus variant="filled" id="download" placeholder="Pearl & Lopez" autoCorrect={false} _autofill={false} />
                    </FormControl>
                )}
            </Field>
            <Field
                id="upload"
                name="upload"
                placeholder="800"
                type="number"
            >
                {({ field, form }: { field: any, form: any }) => (
                    <FormControl colorScheme="red" isRequired isInvalid={form.errors.upload && form.touched.upload}>
                        <FormLabel htmlFor="upload">Upload (Mbps)</FormLabel>
                        <Input {...field} variant="filled" id="upload" placeholder="Pearl & Lopez" autoCorrect={false} _autofill={false} />
                    </FormControl>
                )}
            </Field>
            <Field
                id="jitter"
                name="jitter"
                placeholder="800"
                type="number"
            >
                {({ field, form }: { field: any, form: any }) => (
                    <FormControl colorScheme="red" isRequired isInvalid={form.errors.jitter && form.touched.jitter}>
                        <FormLabel htmlFor="jitter">Jitter (ms)</FormLabel>
                        <Input {...field} variant="filled" id="jitter" placeholder="Pearl & Lopez" autoCorrect={false} _autofill={false} />
                    </FormControl>
                )}
            </Field>
            <Field
                id="latency"
                name="latency"
                placeholder="800"
                type="number"
            >
                {({ field, form }: { field: any, form: any }) => (
                    <FormControl colorScheme="red" isRequired isInvalid={form.errors.latency && form.touched.latency}>
                        <FormLabel htmlFor="latency">Latency (ms)</FormLabel>
                        <Input {...field} variant="filled" id="latency" placeholder="Pearl & Lopez" autoCorrect={false} _autofill={false} />
                    </FormControl>
                )}
            </Field>
        </>
    )
}

export const Welcome = () => {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const handleSubmit = async (v: any) => {
        debugger
        await axios.post('/api/tests/initialize', v)
    }
    return (
        <Modal size="lg" isOpen onClose={() => { }}>
            <ModalOverlay />
            <Formik initialValues={{
                download: 800,
                upload: 15,
                jitter: 1,
                latency: 11,
            }}
                onSubmit={(v) => { console.log(v); handleSubmit(v); setSubmitting(true)}}>
                <Form>
                    <ModalContent>
                        <ModalHeader>Set Defaults</ModalHeader>
                        <ModalBody display="flex" alignItems="center" justifyContent="center" flexDir="column">
                            <Box>
                                <Box display="flex" alignItems="center" flexDir="column">
                                    <BsHddNetwork style={{ fontSize: 60 }} />
                                    <Text fontSize={isMobile ? "lg" : "xxx-large"} fontWeight="black">Network Monitor</Text>
                                    <Text>Track your internet.</Text>
                                </Box>
                                <Box marginTop="10">
                                    <Text fontSize="sm">We need some information about your connection</Text>
                                </Box>
                                <DefaultsForm />
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isSubmitting} type="submit" onClick={() => { }}>Save</Button>
                        </ModalFooter>
                    </ModalContent>
                </Form>
            </Formik >
        </Modal>
    )
}
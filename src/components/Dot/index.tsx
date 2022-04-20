import { Box } from '@chakra-ui/react';
import React from 'react';

export const Dot = (props: {
    color: string;
    style?: any;
}) => {
    return (
        <Box style={props.style} backgroundColor={props.color} borderRadius="50px" width="8px" height="8px" />
    )
}
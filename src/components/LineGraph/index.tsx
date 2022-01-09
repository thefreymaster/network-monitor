import React from 'react';
import { ResponsiveLine } from '@nivo/line'
import { Box, Text } from '@chakra-ui/react';
import { isMobile } from 'react-device-detect';
import { Dot } from '../Dot';

export const LineGraph = (props: {
    data: any,
    title: string
    color: string,
}) => {
    console.log(props)
    return (
        <Box marginRight={isMobile ? "0px" : "20px"} marginTop={isMobile ? "20px" : "0px"} backgroundColor="#fff" height="250px" minW="calc((100vw - 140px) / 4)" display="flex" flexDir="column" alignItems="center" justifyContent="center" boxShadow="base" borderRadius="sm">
            <Box
                mt='1'
                fontWeight='semibold'
                as='h4'
                lineHeight='tight'
                display="flex"
                alignItems="center"
            >
                <Box><Dot color={props.color} /></Box>
                <Box marginLeft="1">{props.title}</Box>
            </Box>
            <ResponsiveLine
                data={props.data}
                enableArea
                enablePointLabel
                margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                curve="natural"
                enablePoints={false}
                useMesh
                enableGridX={false}
                enableGridY={false}
                enableCrosshair
                isInteractive
                axisBottom={null}
                colors={[props.color]}
                crosshairType="x"
            />
        </Box>
    )
}
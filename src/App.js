import './App.css';
import React from 'react';
import axios from "axios"
import { io } from "socket.io-client";
import { Box, useToast } from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { SpeedTests } from './components/SpeedTests';
import { useQuery } from 'react-query'

const socket = io(`http://${process.env.REACT_APP_SERVER_IP}:4000`);

const App = () => {
  const toast = useToast();
  const [tests, setTests] = React.useState();
  const [isTesting, setTesting] = React.useState(false);

  React.useEffect(() => {
    socket.on("update", (db) => {
      console.log(db)
      setTests(db);
    });
    socket.on("testing", (testing) => {
      console.log(testing)
      setTesting(testing);
      if (testing) {
        toast({
          title: 'Running speedtest...',
          description: "Gathering new speedtest data.",
          status: 'info',
          duration: 9000,
          isClosable: true,
        })
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    socket.on("anomaly", (anomalies) => {
      console.log(anomalies);
    })
  }, [])

  React.useLayoutEffect(() => {
    const getTests = async () => {
      const result = await axios.get('/api/testing/status').then(res => res.data);
      console.log(result)
      setTesting(result);
    }
    getTests();
  }, []);

  const { isLoading: isLoadingAnomalies, data: anomalies } = useQuery('anomalies', () => axios.get('/api/testing/anomalies').then(res => res.data));
  const { isLoading, data } = useQuery('tests', () => axios.get('/api/tests').then(res => res.data));

  return (
    <Box>
      <Navigation isTesting={isTesting} />
      {!(isLoading || isLoadingAnomalies) && <SpeedTests data={data} anomalies={anomalies} />}
    </Box>
  )
}

export default App;

import './App.css';
import React from 'react';
import axios from "axios"
import { io } from "socket.io-client";
import { Box, useToast } from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { SpeedTests } from './components/SpeedTests';
import { useQuery } from 'react-query'

const socket = io(`http://${process.env.REACT_APP_SERVER_IP}:5500`);

const App = () => {
  const toast = useToast();
  const [tests, setTests] = React.useState();
  const [anomalies, setAnomalies] = React.useState();

  const [isTesting, setTesting] = React.useState(false);

  React.useEffect(() => {
    socket.on("update", (db) => {
      console.log(db);
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
      setAnomalies(anomalies);
    })
  }, []);

  React.useLayoutEffect(() => {
    socket.on("error", (e) => {
      if (e) {
        toast({
          title: 'Error!',
          description: "An error was encountered fetching latest testing data.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
    })
  }, []);

  React.useLayoutEffect(() => {
    const getTests = async () => {
      const result = await axios.get('/api/testing/status').then(res => res.data);
      setTesting(result);
    }
    getTests();
  }, []);

  const { isLoading: isLoadingAnomalies } = useQuery('anomalies', () => axios.get('/api/testing/anomalies').then(res => setAnomalies(res.data)));
  const { isLoading } = useQuery('tests', () => axios.get('/api/tests').then(res => setTests(res.data)));

  return (
    <Box>
      <Navigation isTesting={isTesting} />
      {!(isLoading || isLoadingAnomalies) && <SpeedTests data={tests} anomalies={anomalies} />}
    </Box>
  )
}

export default App;

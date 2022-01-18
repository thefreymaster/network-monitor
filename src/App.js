import './App.css';
import React from 'react';
import axios from "axios"
import { io } from "socket.io-client";
import {
  Box, useToast,
} from '@chakra-ui/react';
import { Navigation } from './components/Navigation';
import { SpeedTests } from './components/SpeedTests';
import { useQuery } from 'react-query';
import { Offline, Online } from "react-detect-offline";
import { OfflineAlert } from './components/OfflineAlert/index';
import { Results } from './components/Results/index';

const socket = io(`http://${process.env.REACT_APP_SERVER_IP}:5500`);

const App = () => {
  const toast = useToast();
  const [tests, setTests] = React.useState();
  const [anomalies, setAnomalies] = React.useState();
  const [results, setResults] = React.useState();
  const [isTesting, setTesting] = React.useState(false);
  const [isError, setError] = React.useState(false);

  const [health, setHealth] = React.useState()
  const [showDefaults, setShowDefaults] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);

  React.useEffect(() => {
      const getHealth = async () => {
          await axios.get('/api/tests/health').then(res => {
              setHealth(res.data)
          });
      }
      getHealth();
  }, [])

  React.useEffect(() => {
      socket.on("health", (newHealth) => { setHealth(newHealth) })
  }, [])

  React.useEffect(() => {
    socket.on("update", (db) => {
      setTests(db);
    });
    socket.on("testing", (testing) => {
      setTesting(testing);
      if (testing && tests?.length > 0) {
        toast({
          title: 'Running speed test...',
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
    socket.on("results", (results) => {
      setResults(results);
      setShowResults(true);
    })
  }, []);

  React.useLayoutEffect(() => {
    socket.on("error", (e) => {
      if (e) {
        setError(true);
        toast({
          title: 'Error!',
          description: "An error was encountered fetching latest testing data.",
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      }
      else {
        setError(false);
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

  const memorizedApp = React.useMemo(() => {
    return (
      <Box>
        <Navigation setShowDefaults={setShowDefaults} showDefaults={showDefaults} isError={isError} isTesting={isTesting} health={health} />
        {results && <Results setShowResults={setShowResults} setResults={setResults} results={results} isOpen={showResults} />}
        <Online>
          {!(isLoading || isLoadingAnomalies) && <SpeedTests setShowDefaults={setShowDefaults} showDefaults={showDefaults} data={tests} anomalies={anomalies} isTesting={isTesting} health={health} />}
        </Online>
        <Offline>
          <OfflineAlert setError={setError} />
        </Offline>
      </Box>
    )
  }, [showDefaults, isError, isTesting, health, results, showResults, isLoading, isLoadingAnomalies, tests, anomalies])
  return memorizedApp

}

export default App;

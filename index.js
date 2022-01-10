const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const speedTest = require('speedtest-net');

require('dotenv').config()


const EXPECTED_INTERNET_DOWNLOAD_SPEED = 1000;
const EXPECTED_INTERNET_UPLOAD_SPEED = 15;
const EXPECTED_INTERNET_JITTER = 4;
const EXPECTED_INTERNET_PING = 10;

const db = new JsonDB(new Config("speedtests", true, true, '/'));

const path = require("path");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:4000", `http://${process.env.REACT_APP_SERVER_IP}:5500`],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("change", (view) => {
        console.log({ io: "change", view });
        socket.broadcast.emit('change_view', view)
    })
});

const getAverages = (tests) => {
    const download = tests.reduce((a, b) => {
        return a + b.download.bandwidth;
    }, 0);

    const upload = tests.reduce((a, b) => {
        return a + b.upload.bandwidth;
    }, 0);

    const jitter = tests.reduce((a, b) => {
        return a + b.ping.jitter;
    }, 0);

    const ping = tests.reduce((a, b) => {
        return a + b.ping.latency;
    }, 0);

    return {
        download: {
            value: download / tests.length,
            label: "Download",
            units: "Mbps"
        },
        upload: {
            value: upload / tests.length,
            label: "Upload",
            units: "Mbps"
        },
        jitter: {
            value: jitter / tests.length,
            label: "Jitter",
            units: "ms"
        },
        ping: {
            value: ping / tests.length,
            label: "Ping",
            units: "ms"
        }
    };
}

const checkForAnomaly = async (test) => {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const anomalies = db.getData('/')?.anomaly.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());

    let anomaly;
    if (test.download.bandwidth / EXPECTED_INTERNET_DOWNLOAD_SPEED < 0.6) {
        anomaly = { ...test, type: 'download' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.upload.bandwidth / EXPECTED_INTERNET_UPLOAD_SPEED < 0.6) {
        anomaly = { ...test, type: 'upload' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.ping.jitter / EXPECTED_INTERNET_JITTER < 0.6) {
        anomaly = { ...test, type: 'jitter' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.ping.latency / EXPECTED_INTERNET_PING < 0.6) {
        anomaly = { ...test, type: 'ping' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
}

const runSingleSpeedTest = async () => {
    console.log("Running speedtest...");
    io.emit('testing', true);
    io.emit('error', false);
    db.push("/testing", true);
    try {
        const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
        console.log("Test complete");
        db.push("/testing", false)
        io.emit('testing', false);
        await db.push("/tests", [result], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());

        io.emit('update', { tests, averages: getAverages(tests) });
    } catch (error) {
        console.log(error);
        io.emit('error', true);
    }
}

const runSpeedTest = async () => {
    console.log("Running speedtest...");
    io.emit('testing', true);
    io.emit('error', false);
    db.push("/testing", true);
    try {
        const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
        console.log("Test complete");
        db.push("/testing", false)
        io.emit('testing', false);
        await db.push("/tests", [result], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());

        io.emit('update', { tests, averages: getAverages(tests) });
        setTimeout(() => {
            runSpeedTest();
        }, 900000);
    } catch (error) {
        console.log(error);
        io.emit('error', true);
        setTimeout(() => {
            runSpeedTest();
        }, 900000);
    }
}

const port = 5500;

httpServer.listen(port, () => {
    console.log('Network Monitor running');
    console.log(`Navigate to: ${process.env.REACT_APP_SERVER_IP}:${port}`);
    if (!db.getData('/')?.anomaly) {
        db.push('/anomaly', [], false);
    }
    if (!db.getData('/')?.tests) {
        db.push('/tests', [], false);
    }
    if (db.getData('/')?.testing === undefined) {
        db.push('/testing', true, false);
    }
    runSpeedTest();
});

app.use(express.static(__dirname + '/build'));

app.get('/api/tests', function (req, res) {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());
    return res.send({ tests, averages: getAverages(tests) })
});

app.get('/api/testing/status', function (req, res) {
    const testing = db.getData('/')?.testing;
    return res.send(testing)
});

app.get('/api/testing/anomalies', function (req, res) {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const anomalies = db.getData('/')?.anomaly.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());
    return res.send(anomalies)
});

app.get('/api/tests/run', function (req, res) {
    runSingleSpeedTest();
    return res.sendStatus(200);
});

app.get('/api/tests/all', function (req, res) {
    const tests = db.getData('/')?.tests;
    return res.send({ tests, averages: getAverages(tests) })
});

app.get('/api/testing/new', async (req, res) => {
    const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
    return res.send(result)
});

app.get('/*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'build/index.html'));
});

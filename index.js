const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config()


const EXPECTED_INTERNET_DOWNLOAD_SPEED = 1000;
const EXPECTED_INTERNET_UPLOAD_SPEED = 15;
const EXPECTED_INTERNET_JITTER = 9;
const EXPECTED_INTERNET_PING = 6;

const { UniversalSpeedtest, SpeedUnits } = require('universal-speedtest');

const db = new JsonDB(new Config("speedtests", true, true, '/'));

const universalSpeedtest = new UniversalSpeedtest({
    measureUpload: true,
    downloadUnit: SpeedUnits.Mbps
});

const path = require("path");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:4000", `http://${process.env.REACT_APP_SERVER_IP}:4000`],
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
        return a + b.downloadSpeed;
    }, 0);

    const upload = tests.reduce((a, b) => {
        return a + b.uploadSpeed;
    }, 0);

    const jitter = tests.reduce((a, b) => {
        return a + b.jitter;
    }, 0);

    const ping = tests.reduce((a, b) => {
        return a + b.ping;
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
    const anomalies = db.getData('/')?.anomaly.filter(test => new Date(test.createdAt).getTime() > todayMidnight.getTime());

    let anomaly;
    if (test.downloadSpeed / EXPECTED_INTERNET_DOWNLOAD_SPEED < 0.6) {
        anomaly = { ...test, createdAt: new Date().toISOString(), type: 'download' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.uploadSpeed / EXPECTED_INTERNET_UPLOAD_SPEED < 0.6) {
        anomaly = { ...test, createdAt: new Date().toISOString(), type: 'upload' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.uploadSpeed / EXPECTED_INTERNET_JITTER < 0.6) {
        anomaly = { ...test, createdAt: new Date().toISOString(), type: 'jitter' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.uploadSpeed / EXPECTED_INTERNET_PING < 0.6) {
        anomaly = { ...test, createdAt: new Date().toISOString(), type: 'ping' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
}

const runSingleSpeedTest = async () => {
    console.log("Running speedtest...");
    io.emit('testing', true);
    db.push("/testing", true)
    universalSpeedtest.runCloudflareCom().then(async (result) => {
        console.log("Test complete");
        db.push("/testing", false)
        io.emit('testing', false);
        await db.push("/tests", [{ ...result, createdAt: new Date().toISOString() }], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.createdAt).getTime() > todayMidnight.getTime());

        io.emit('update', { tests, averages: getAverages(tests) });
    }).catch((error) => {
        console.log(error);
        db.push("/testing", false);
        io.emit('testing', false);
        io.emit('error', true);
    })
}

const runSpeedTest = async () => {
    console.log("Running speedtest...");
    io.emit('testing', true);
    db.push("/testing", true)
    universalSpeedtest.runCloudflareCom().then(async (result) => {
        console.log("Test complete");
        db.push("/testing", false)
        io.emit('testing', false);
        await db.push("/tests", [{ ...result, createdAt: new Date().toISOString() }], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.createdAt).getTime() > todayMidnight.getTime());

        io.emit('update', { tests, averages: getAverages(tests) });
        setTimeout(() => {
            runSpeedTest();
        }, 60000);
    }).catch((error) => {
        console.log(error);
        io.emit('error', true);
        setTimeout(() => {
            runSpeedTest();
        }, 60000);
    })
}

httpServer.listen(4000, () => {
    console.log('Speedtest server running');
    if (!db.getData('/')?.anomaly) {
        db.push('/anomaly', [], false);
    }
    if (!db.getData('/')?.tests) {
        db.push('/tests', [], false);
    }
    if (db.getData('/')?.testing === undefined) {
        db.push('/testing', false, false);
    }
    runSpeedTest();
});

app.use(express.static(__dirname + '/build'));

app.get('/api/tests', function (req, res) {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const tests = db.getData('/')?.tests.filter(test => new Date(test.createdAt).getTime() > todayMidnight.getTime());
    return res.send({ tests, averages: getAverages(tests) })
});

app.get('/api/testing/status', function (req, res) {
    const testing = db.getData('/')?.testing;
    return res.send(testing)
});

app.get('/api/testing/anomalies', function (req, res) {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const anomalies = db.getData('/')?.anomaly.filter(test => new Date(test.createdAt).getTime() > todayMidnight.getTime());
    return res.send(anomalies)
});

app.get('/api/tests/run', function (req, res) {
    runSingleSpeedTest();
    return res.send(200);
});

app.get('/api/tests/all', function (req, res) {
    const tests = db.getData('/')?.tests;
    return res.send({ tests, averages: getAverages(tests) })
});

app.get('/*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'build/index.html'));
});

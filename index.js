const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const speedTest = require('speedtest-net');

require('dotenv').config()

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
    const averages = db.getData('/')?.averages;
    const defaults = db.getData('/')?.defaults;

    let anomaly;
    if (test.download.bandwidth / averages?.download?.value < 0.8) {
        anomaly = { ...test, type: 'download' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.upload.bandwidth / averages?.upload.bandwidth < 0.8) {
        anomaly = { ...test, type: 'upload' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.ping.jitter > defaults.jitter + 2) {
        anomaly = { ...test, type: 'jitter' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
    if (test.ping.latency > defaults.latency + 2) {
        anomaly = { ...test, type: 'ping' }
        console.log({ anomaly })
        await db.push("/anomaly", [anomaly], false);
        io.emit('anomaly', anomalies);
    }
}

const getHealth = async () => {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const defaults = await db.getData('/')?.defaults;
    const tests = await db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());
    const averages = await getAverages(tests);
    const health = {
        download: ((averages.download?.value / 125000) / defaults.download) * 100,
        upload: ((averages.upload?.value / 125000) / defaults.upload) * 100,
        jitter: ((averages.jitter?.value) / defaults.jitter) * 100 - 100,
        latency: ((averages.ping?.value) / defaults.latency) * 100 - 100,
    }
    return health;
}

const runSingleSpeedTest = async () => {
    console.log("Running speedtest...");
    io.emit('testing', true);
    io.emit('error', false);
    db.push("/testing", true);
    try {
        const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
        const health = await getHealth();
        console.log("Test complete");
        db.push("/testing", false);
        io.emit('health', health);
        io.emit('testing', false);
        await db.push("/tests", [result], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime()).reverse();
        const averages = getAverages(tests)
        io.emit('update', { tests, averages });
        await db.push("/averages", averages, true);

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
        const health = await getHealth()
        console.log("Test complete");
        db.push("/testing", false);
        io.emit('health', health);
        io.emit('testing', false);
        await db.push("/tests", [result], false);
        checkForAnomaly(result);
        console.log(result);
        let todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());

        const averages = getAverages(tests)
        io.emit('update', { tests, averages });
        await db.push("/averages", averages, true);

        setTimeout(() => {
            runSpeedTest();
        }, 900000);
    } catch (error) {
        console.log(error);
        // await db.push("/anomaly", [{
        //     type: 'offline',
        // }], false);
        io.emit('error', true);
        setTimeout(() => {
            runSpeedTest();
        }, 900000);
    }
}



app.use(express.static(__dirname + '/build'));
app.use(express.json());

app.get('/api/tests', function (req, res) {
    let todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    const tests = db.getData('/')?.tests.filter(test => new Date(test.timestamp).getTime() > todayMidnight.getTime());
    const averages = getAverages(tests)
    return res.send({ tests, averages })
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

app.get('/api/tests/health', async (req, res) => {
    const health = await getHealth()
    return res.send(health)
});


app.post('/api/tests/initialize', async (req, res) => {
    console.log(req.body)
    await db.push("/defaults", { ...req.body });
    await runSpeedTest();
    return res.sendStatus(200);
});

app.get('/api/tests/all', function (req, res) {
    const tests = db.getData('/')?.tests;
    const averages = getAverages(tests);
    return res.send({ tests, averages })
});

app.get('/api/testing/new', async (req, res) => {
    const result = await speedTest({ acceptLicense: true, acceptGdpr: true });
    return res.send(result)
});

app.get('/*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'build/index.html'));
});

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
        db.push('/testing', false, false);
    }
    if (db.getData('/')?.defaults === undefined) {
        db.push('/defaults', {
            download: null,
            upload: null,
            jitter: null,
            latency: null,
        }, false);
    }
});

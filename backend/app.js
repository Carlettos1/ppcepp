const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const answerRoutes = require('./routes/answer');
const cheatLogRoutes = require('./routes/cheat_log');
const questionRoutes = require('./routes/question');
const examRoutes = require('./routes/exam');
const https = require("https");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use("/answer", answerRoutes);
app.use("/cheat_log", cheatLogRoutes);
app.use("/question", questionRoutes);
app.use("/exam", examRoutes);

const cert = fs.readFileSync("/etc/letsencrypt/live/codetrack.cl/cert.pem");
const pkey = fs.readFileSync("/etc/letsencrypt/live/codetrack.cl/privkey.pem");
const PORT = 5001;
const PORT2 = 5002;
app.listen(PORT2, () => console.log(`Server running on http://localhost:${PORT2}`));

https.createServer({
	cert: cert,
	key: pkey
}, app).listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const answerRoutes = require('./routes/answer');
const cheatLogRoutes = require('./routes/cheat_log');
const questionRoutes = require('./routes/question');
const examRoutes = require('./routes/exam');
const executeRoutes = require('./routes/execute');
const userRoutes = require("./routes/user");
const process = require('process');
const argv = process.argv[2];
const PORT = 5001;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use("/answer", answerRoutes);
app.use("/cheat_log", cheatLogRoutes);
app.use("/question", questionRoutes);
app.use("/exam", examRoutes);
app.use("/execute", executeRoutes);
app.use("/user", userRoutes);

if (argv == "dev") {
	app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
} else if (argv == "prod") {
	const https = require("https");
	const fs = require("fs");
	const cert = fs.readFileSync("/etc/letsencrypt/live/codetrack.cl/cert.pem");
	const pkey = fs.readFileSync("/etc/letsencrypt/live/codetrack.cl/privkey.pem");
	https.createServer({
		cert: cert,
		key: pkey
	}, app).listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));
} else {
	console.log("Invalid argument. Use 'dev' or 'prod'");
	process.exit();
}
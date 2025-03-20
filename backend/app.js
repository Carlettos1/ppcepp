const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const answerRoutes = require('./routes/answer');
const cheatLogRoutes = require('./routes/cheat_log');
const questionRoutes = require('./routes/question');
const examRoutes = require('./routes/exam');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use("/answer", answerRoutes);
app.use("/cheat_log", cheatLogRoutes);
app.use("/question", questionRoutes);
app.use("/exam", examRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

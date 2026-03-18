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
const examTimeRoutes = require("./routes/exam_time");
const PORT = 5001;
const app = express();
const teacherQuestionRouter = require('./routes/teacher_question');

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use("/answer", answerRoutes);
app.use("/cheat_log", cheatLogRoutes);
app.use("/question", questionRoutes);
app.use("/exam", examRoutes);
app.use("/execute", executeRoutes);
app.use("/user", userRoutes);
app.use('/teacher-question', teacherQuestionRouter);
app.use("/exam-time", examTimeRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

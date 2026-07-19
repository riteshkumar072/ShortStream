const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const shotRoutes = require('./routes/shot.routes')
const userRoutes = require('./routes/user.routes')
const cors = require('cors')

const app = express();



app.use(cors({
    origin: ["http://localhost:5173", "https://short-stream.vercel.app", "https://short-stream-kpjx99sg9-kumarritesh2006912-8706s-projects.vercel.app"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/shot', shotRoutes);
app.use('/api/user', userRoutes)

module.exports = app;
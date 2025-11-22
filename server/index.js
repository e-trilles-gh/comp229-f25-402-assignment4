import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv/config";

mongoose.connect(process.env.MONGODB_URI);
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, "MongoDB connection error: "));
connection.once('open', () => { console.log('Connected to MongoDB'); });


// uses the routes
import projectRoutes from './routes/project.js';
import userRoutes from './routes/user.js';
import contactRoutes from './routes/contact.js';
import qualificationRoutes from './routes/qualification.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.get('/api', (req, res) => { res.status(201).json({ message: "Welcome to My Portfolio application." });});
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/qualifications', qualificationRoutes);



app.listen(3000);

console.log('Established connection. Server running at http://localhost:3000/');





// nodemon --exec "npm start"
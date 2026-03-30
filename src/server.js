require('dotenv').config();
import cors from "cors";
import express, { json, urlencoded } from 'express';
import connectDB from './config/db';
import studentRoutes from './routes/studentRoutes';
import employerRoutes from './routes/employerRoutes';
import internshipRoutes from './routes/internshipRoutes';
import applicationRoutes from './routes/applicationRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config.js';
import projectRoutes from './routes/projects.js';

const app = express();
app.use(cors({ origin: config.clientOrigins }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'peer-project-hub-api' }));
app.use('/api/projects', projectRoutes);
app.use((error, _req, res, _next) => { console.error(error); res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.message || 'Server error.' }); });

mongoose.connect(config.mongoUri).then(() => app.listen(config.port, () => console.log(`API listening on ${config.port}`))).catch(error => { console.error('MongoDB connection failed:', error.message); process.exit(1); });

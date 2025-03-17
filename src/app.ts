import express from 'express';
import userRoutes from './routes/userRoutes';
import { swaggerSetup } from './config/swagger';

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

swaggerSetup(app);

export default app;
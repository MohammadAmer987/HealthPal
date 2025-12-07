import express from 'express';
import authRoutes from './routes/auth.routes.js';
import caseRoutes from "./routes/cases.routes.js";
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use("/cases", caseRoutes);
export default app;
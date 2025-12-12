import express from 'express';
import authRoutes from './routes/auth.routes.js';
import caseRoutes from "./routes/cases.routes.js";
import donationRoutes from "./routes/donations.routes.js";
import caseUpdatesRoutes from "./routes/caseupdates.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";
import doctorRoutes from './src/routes/doctors.routes.js';
import messageRoutes from './src/routes/messages.routes.js';
import consultationRoutes from './src/routes/consultations.routes.js';



const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use("/cases", caseRoutes);
app.use("/donations",donationRoutes);
app.use("/case-updates", caseUpdatesRoutes);
app.use("/ngos", ngoRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/consultations', consultationRoutes);


export default app;
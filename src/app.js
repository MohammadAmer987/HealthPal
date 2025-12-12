import express from 'express';
import profileRoutes from './routes/Profile.js';
import caseRoutes from "./routes/cases.routes.js";
import donationRoutes from "./routes/donations.routes.js";
import caseUpdatesRoutes from "./routes/caseupdates.routes.js";
import patientsRoutes from "./routes/patient.routes.js";
import doctorRoutes from './routes/doctors.routes.js';
import messageRoutes from './routes/messages.routes.js';
import consultationRoutes from './routes/consultations.routes.js';


const app = express();

app.use(express.json());
app.use("/cases", caseRoutes);
app.use("/donations",donationRoutes);
app.use("/case-updates", caseUpdatesRoutes);
app.use("/patient", patientsRoutes);
app.use('/doctors', doctorRoutes);
app.use('/messages', messageRoutes);
app.use('/consultations', consultationRoutes);
app.use("/availability", doctorAvailabilityRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/missions", surgicalMissionRoutes);
app.use("/med-requests", medRequestRoutes);
app.use("/medicine-supply", medicineSupplyRoutes);
app.use("/med-match", medMatchRoutes);
app.use("/health-guides", healthGuideRoutes);
app.use("/", airRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/trauma", traumaRoutes);
app.use("/support-groups", supportGroupRoutes);
app.use("/anonymous-chat", anonymousChatRoutes);//an
app.use("/profile", profileRoutes);

export default app;
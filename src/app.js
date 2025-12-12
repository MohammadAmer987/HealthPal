import express from 'express';
import profileRoutes from './routes/Profile.js';
import caseRoutes from "./routes/cases.routes.js";
import donationRoutes from "./routes/donations.routes.js";
import caseUpdatesRoutes from "./routes/caseupdates.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";
import patientsRoutes from "./routes/patient.routes.js";
import doctorAvailabilityRoutes from "./routes/doctorAvailability.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import surgicalMissionRoutes from "./routes/surgicalMission.routes.js";
import medRequestRoutes from "./routes/medRequest.routes.js";
import medicineSupplyRoutes from "./routes/medicineSupply.routes.js";
import medMatchRoutes from "./routes/medMatch.routes.js";
import healthGuideRoutes from "./routes/healthGuides.routes.js";
import airRoutes from "./routes/air.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import traumaRoutes from "./routes/trauma.routes.js";
import supportGroupRoutes from "./routes/group.routes.js";
import anonymousChatRoutes from "./routes/anonymousChat.routes.js";


const app = express();

app.use(express.json());
app.use("/cases", caseRoutes);
app.use("/donations",donationRoutes);
app.use("/case-updates", caseUpdatesRoutes);
app.use("/ngos", ngoRoutes);
app.use("/patient", patientsRoutes);
app.use("/availability", doctorAvailabilityRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/missions", surgicalMissionRoutes);
app.use("/med-requests", medRequestRoutes);
app.use("/medicine-supply", medicineSupplyRoutes);
app.use("/med-match", medMatchRoutes);
app.use("/health-guides", healthGuideRoutes);
app.use("/air", airRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/trauma", traumaRoutes);
app.use("/support-groups", supportGroupRoutes);
app.use("/anonymous-chat", anonymousChatRoutes);//an
app.use("/profile", profileRoutes);

export default app;
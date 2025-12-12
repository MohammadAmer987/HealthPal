import express from 'express';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger.js';

import profileRoutes from './routes/Profile.js';
import caseRoutes from "./routes/cases.routes.js";
import donationRoutes from "./routes/donations.routes.js";
import caseUpdatesRoutes from "./routes/caseupdates.routes.js";
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
import doctorRoutes from './routes/doctors.routes.js';
import messageRoutes from './routes/messages.routes.js';
import consultationRoutes from './routes/consultations.routes.js';


const app = express();

app.use(express.json());
// Ensure logs folder exists (logger writes files there)
const logsDir = path.join(process.cwd(), 'logs');
try {
	if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
} catch (e) {
	// fallback to console if logger not ready
	console.error('Failed to create logs directory', e);
}

// Replace console methods to use Winston logger so existing console.* calls
// across the codebase are captured in log files as well.
/* eslint-disable no-console */
console.log = (...args) => logger.info(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.info = (...args) => logger.info(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.warn = (...args) => logger.warn(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
console.error = (...args) => logger.error(args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '));
/* eslint-enable no-console */

// Request logging middleware: logs method, url, status and timing
app.use((req, res, next) => {
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		logger.info({
			msg: 'HTTP access',
			method: req.method,
			url: req.originalUrl || req.url,
			status: res.statusCode,
			duration_ms: duration,
			ip: req.ip
		});
	});
	next();
});
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
app.use("/air", airRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/trauma", traumaRoutes);
app.use("/support-groups", supportGroupRoutes);
app.use("/anonymous-chat", anonymousChatRoutes);//an
app.use("/profile", profileRoutes);

export default app;
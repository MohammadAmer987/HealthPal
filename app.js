import express from "express";
import cors from "cors";

// تحميل الراوترز الخاصة بكل جزء
import doctorRoutes from "./routes/doctors.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import consultationRoutes from "./routes/consultations.routes.js";

// Middleware للحماية
import { auth, requireRole } from "./middleware/security.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/doctors", auth, doctorRoutes); // فقط admin يعدل أو يحذف، والقراءة للجميع
app.use("/api/messages", auth, messageRoutes); // الرسائل private
app.use("/api/consultations", auth, consultationRoutes); // المواعيد

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "HealthPal API Running 🚀" });
});

export default app;

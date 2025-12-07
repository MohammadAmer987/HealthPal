import app from './src/app.js';
import dotenv from 'dotenv';
import { db } from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, ()=> console.log(`HealthPal running on ${PORT}`));


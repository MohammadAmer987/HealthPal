import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();
export const generatePDF = async (html) => {
  try {
    const response = await axios.post(
      "https://api.pdfshift.io/v3/convert/pdf",
      { source: html },
      {
        auth: { username: process.env.PDFSHIFT_API_KEY }
      }
    );

    return response.data; // PDF buffer
  } catch (error) {
    console.error("PDF Service Error:", error);
    throw new Error("Failed to generate PDF");
  }
};

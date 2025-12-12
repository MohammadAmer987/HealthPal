import dotenv from 'dotenv';
import axios from "axios";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (html) => {
  let tempHtmlFile = null;

  try {
    // Validate API key
    const apiKey = process.env.PDFREST_API_KEY;
    if (!apiKey) {
      throw new Error("PDFREST_API_KEY not configured in environment variables");
    }

    if (!html || typeof html !== 'string') {
      throw new Error("Invalid HTML provided for PDF generation");
    }

    // Create a temporary HTML file
    const tempDir = path.join(__dirname, '../../..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    tempHtmlFile = path.join(tempDir, `invoice_${timestamp}.html`);
    fs.writeFileSync(tempHtmlFile, html, 'utf8');

    // Log HTML length for debugging
    console.info(`Generating PDF from HTML (length=${html.length} chars)`);

    // PDFRest expects multipart form-data with 'file' field
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('file', fs.createReadStream(tempHtmlFile));

    const response = await axios.post(
      "https://api.pdfrest.com/pdf",
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Accept': 'application/json',
          'Api-Key': apiKey
        },
        timeout: 30000
      }
    );

    console.info('PDF response status:', response.status);
    console.info('PDF response data:', response.data);
    
    // PDFRest returns JSON with outputUrl, need to fetch the actual PDF
    const outputUrl = response.data?.outputUrl;
    if (!outputUrl) {
      throw new Error("PDFRest did not return outputUrl in response");
    }

    console.info('Fetching PDF from:', outputUrl);

    // Fetch the actual PDF from the outputUrl
    const pdfResponse = await axios.get(outputUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    console.info('PDF downloaded, size:', pdfResponse.data.length);
    return pdfResponse.data; // PDF buffer
  } catch (error) {
    console.error("PDF Service Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.error || error.message,
      responseBody: (() => {
        try {
          return error.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : undefined;
        } catch (e) {
          return String(error.response?.data);
        }
      })(),
      code: error.code
    });

    // Provide specific error message
    if (error.response?.status === 401) {
      throw new Error("PDF API authentication failed - invalid or missing API key");
    } else if (error.response?.status === 400) {
      throw new Error("PDF generation failed - invalid HTML content");
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot reach PDF service - network error");
    }

    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    // Clean up temporary file
    if (tempHtmlFile && fs.existsSync(tempHtmlFile)) {
      try {
        fs.unlinkSync(tempHtmlFile);
      } catch (err) {
        console.warn("Failed to delete temp file:", err.message);
      }
    }
  }
};
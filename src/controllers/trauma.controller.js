import { TraumaWikiAPI, translate } from "../service/ExternalAPIs/TraumaWikiAPI.js";
import db from "../config/db.js";

// Generate trauma resource (PTSD, Anxiety, Grief...)
export const getTraumaResource = async (req, res) => {
  try {
    const { topic } = req.params;

    // 1) Fetch english wiki summary
    const englishText = await TraumaWikiAPI.getWikiSummary(topic);

    // 2) Translate to Arabic
    const arabicText = await translate(englishText);

    // 3) Save in DB (optional)
    await db.promise().query(
      "INSERT INTO trauma_resources (topic, english_summary, arabic_summary) VALUES (?, ?, ?)",
      [topic, englishText, arabicText]
    );

    res.json({
      topic,
      english_summary: englishText,
      arabic_summary: arabicText
    });

  } catch (err) {
    console.error("Trauma Resource Error:", err);
    res.status(500).json({ error: "Failed to generate trauma content" });
  }
};

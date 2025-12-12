import HealthWikiAPI from "../service/ExternalAPIs/HealthWikiAPI.js";

export const getHealthGuide = async (req, res) => {
  try {
    const { topic } = req.params;

    // 1) Fetch summary from Wikipedia
    const wikiData = await HealthWikiAPI.fetchTopic(topic);

    if (!wikiData || !wikiData.extract) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const englishSummary = wikiData.extract;

    // 2) Translate summary to Arabic
    const arabicSummary = await HealthWikiAPI.translate(englishSummary);

    // 3) Build final response
    res.json({
      topic: wikiData.title,
      thumbnail: wikiData.thumbnail?.source || null,
      english: englishSummary,
      arabic: arabicSummary
    });

  } catch (err) {
    console.error("Health Guide Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

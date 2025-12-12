import axios from "axios";

const HealthWikiAPI = {
  async fetchTopic(topic) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      console.error("Wikipedia API error:", err);
      return null;
    }
  },

  async translate(text) {
    try {
      const res = await axios.post("https://libretranslate.com/translate", {
        q: text,
        source: "en",
        target: "ar"
      });
      return res.data.translatedText;
    } catch (err) {
      console.error("Translation API error:", err);
      return text; // fallback to English
    }
  }
};

export default HealthWikiAPI;

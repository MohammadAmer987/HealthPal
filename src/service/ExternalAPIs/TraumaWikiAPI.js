import axios from "axios";

export const TraumaWikiAPI = {
  async getWikiSummary(topic) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const response = await axios.get(url);
    return response.data.extract;
  }
};
export const translate = async (text) => {
  const res = await axios.post("https://translate.argosopentech.com/translate", {
    q: text,
    source: "en",
    target: "ar"
  });
  return res.data.translatedText;
};
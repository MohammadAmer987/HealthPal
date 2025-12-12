import SupportGroup from "../models/SupportGroup.js";
import SupportPost from "../models/SupportPost.js";
export const createGroup = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    await SupportGroup.create(name, description, category);

    res.status(201).json({ message: "Support group created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllGroups = async (req, res) => {
  try {
    const [rows] = await SupportGroup.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const createPost = async (req, res) => {
  try {
    const { group_id } = req.params;
    const { user_id, content, is_anonymous } = req.body;

    await SupportPost.create(group_id, user_id, content, is_anonymous);

    res.status(201).json({ message: "Post added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getGroupPosts = async (req, res) => {
  try {
    const { group_id } = req.params;
    const [rows] = await SupportPost.getByGroup(group_id);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

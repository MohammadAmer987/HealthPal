import { InventoryItem } from "../models/InventoryItem.js";
import { InventoryRequest } from "../models/inventoryRequest.js";
// Add new inventory item
export const addInventoryItem = async (req, res) => {
  try {
    const data = req.body;
    await InventoryItem.create(data);

    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    console.error("Add Inventory Error:", err);
    res.status(500).json({ error: err });
  }
};

// Get all items
export const getInventoryItems = async (req, res) => {
  try {
    const [items] = await InventoryItem.getAll();
    res.json(items);
  } catch (err) {
    console.error("Get Inventory Error:", err);
    res.status(500).json({ error: err });
  }
};

// Filter by category
export const getInventoryByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const [items] = await InventoryItem.getByCategory(category);
    res.json(items);
  } catch (err) {
    console.error("Category Error:", err);
    res.status(500).json({ error: err });
  }
};

// Request item
export const requestInventoryItem = async (req, res) => {
  try {
    const item_id = req.params.id;
    const { requester_id } = req.body;

    await InventoryRequest.create(item_id, requester_id);

    res.json({ message: "Request submitted" });
  } catch (err) {
    console.error("Request Inventory Error:", err);
    res.status(500).json({ error: err });
  }
};

// Approve or reject
export const updateRequestStatus = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { status } = req.body;

    await InventoryRequest.updateStatus(request_id, status);

    res.json({ message: "Request status updated" });
  } catch (err) {
    console.error("Update Request Error:", err);
    res.status(500).json({ error: err });
  }
};

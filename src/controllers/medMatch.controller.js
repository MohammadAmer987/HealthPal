import MedMatch from "../models/MedMatch.js";
import MedRequest from "../models/MedRequest.js";
import MedicineSupply from "../models/MedicineSupply.js";

export const matchMedication = async (req, res) => {
  try {
    const { request_id, supply_id, quantity } = req.body;

    if (!request_id || !supply_id || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1) Get request
    const [reqRows] = await MedRequest.getById(request_id);
    if (reqRows.length === 0) return res.status(404).json({ message: "Request not found" });

    const request = reqRows[0];

    if (request.status !== "open") {
      return res.status(400).json({ message: "Request is not open" });
    }

    // 2) Get supply
    const [supRows] = await MedicineSupply.getById(supply_id);
    if (supRows.length === 0) return res.status(404).json({ message: "Supply not found" });

    const supply = supRows[0];

    if (supply.quantity_available < quantity) {
      return res.status(400).json({ message: "Not enough supply available" });
    }

    // 3) Deduct from supply
    await MedicineSupply.reduceQuantity(supply_id, quantity);

    // 4) Update request status → matched
    await MedRequest.updateStatus(request_id, "matched");

    // 5) Insert match record
    await MedMatch.create(request_id, supply_id, quantity);

    res.json({
      message: "Medication matched successfully",
      matched: {
        request_id,
        supply_id,
        matched_quantity: quantity,
        remaining_in_supply: supply.quantity_available - quantity
      }
    });

  } catch (err) {
    console.error("Match error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

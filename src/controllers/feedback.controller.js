import Feedback from "../models/Feedback.js";

export const createFeedback = async (req, res) => {
    try {
        const { case_id } = req.params;
        const { feedback, rating } = req.body;

        if (!feedback || !rating)
            return res.status(400).json({ message: "Feedback and rating required" });

        await Feedback.addFeedback(case_id, feedback, rating);

        res.status(201).json({ message: "Feedback added successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
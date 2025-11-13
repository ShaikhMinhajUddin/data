import Inspection from "../models/Inspection.js";

// existing single record handler
export const addInspection = async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    await inspection.save();
    res.status(201).json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save inspection" });
  }
};

// ✅ New bulk upload handler
export const bulkInsert = async (req, res) => {
  try {
    const inspections = req.body;

    if (!Array.isArray(inspections) || inspections.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    await Inspection.insertMany(inspections);
    res.status(200).json({ message: `${inspections.length} inspections added successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bulk insert failed", error });
  }
};

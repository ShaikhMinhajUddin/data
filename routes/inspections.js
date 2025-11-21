import express from "express";
import Inspection from "../models/Inspection.js";

const router = express.Router();

/* ✅ GET all inspections */
router.get("/", async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ✅ GET inspection by ID */
router.get("/:id", async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }
    res.json(inspection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ✅ POST new inspection */
router.post("/", async (req, res) => {
  try {
    const newInspection = new Inspection(req.body);
    await newInspection.save();

    res
      .status(201)
      .json({ message: "Inspection saved successfully", data: newInspection });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to save inspection" });
  }
});


/* ✅ POST imported inspections (from Excel/CSV) */
router.post("/import", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    await Inspection.insertMany(data);
    res.status(200).json({ message: `Imported ${data.length} records successfully!` });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Failed to import inspection data" });
  }
});


/* ✅ UPDATE inspection by ID */
router.put("/:id", async (req, res) => {
  try {
    const updatedInspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!updatedInspection) {
      return res.status(404).json({ error: "Inspection not found" });
    }

    res.json({
      message: "Inspection updated successfully",
      data: updatedInspection,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update inspection" });
  }
});

/* DELETE ALL inspections */
router.delete("/deleteAll", async (req, res) => {
  try {
    await Inspection.deleteMany({});
    res.status(200).json({ message: "All inspections deleted successfully!" });
  } catch (err) {
    console.error("Delete All error:", err);
    res.status(500).json({ message: "Failed to delete all inspections." });
  }
});


/* ✅ DELETE inspection by ID */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inspection.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ error: "Inspection not found" });

    res.json({ message: "Inspection deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found! Check your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Inspection Schema
const inspectionSchema = new mongoose.Schema({
  serialNo: Number,
  year: Number,
  month: String,
  inspectionId: Number,
  inspectionDate: Date,
  servicePerformed: String,
  inspectionType: String,
  dpi: String,
  bvFinal: String,
  aktiSelf: String,
  inspectorName: String,
  offeredQtyCtn: Number,
  offeredQtyPacks: Number,
  noOfInspection: Number,
  pass: Number,
  fail: Number,
  abort: Number,
  pending: Number,
  inspectionStatus: String,
  sampleSize: Number,

  major: Number,
  minor: Number,
  oql: Number,
  percentAllowed: Number,
  critical: Number,
  actualMajor: Number,
  actualMinor: Number,
  actualOql: Number,

  pulledTerry: Number,
  rawEdge: Number,
  weaving: Number,
  uncutThread: Number,
  stainMajor: Number,
  skipStitch: Number,
  brokenStitch: Number,
  runoffStitch: Number,
  poorShape: Number,
  pleat: Number,
  insecureLabel: Number,
  missingLabel: Number,
  contaminationMajor: Number,
  slantLabel: Number,
  damageFabric: Number,
  hole: Number,
  looseStitch: Number,

  singleUntrimmedThread: Number,
  contaminationMinor: Number,
  flyYarn: Number,
  dustMark: Number,
  stainMinor: Number
}, { timestamps: true });

const Inspection = mongoose.model("Inspection", inspectionSchema);

// ==================== ROUTES ====================

// ✅ Bulk insert inspections
app.post("/api/inspections/bulk", async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }
    await Inspection.insertMany(data);
    res.status(200).json({ message: `Bulk insert successful (${data.length} records)` });
  } catch (err) {
    console.error("Bulk insert error:", err);
    res.status(500).json({ error: "Failed to insert bulk data" });
  }
});

// ✅ Create a single inspection
app.post("/api/inspections", async (req, res) => {
  try {
    const newInspection = new Inspection(req.body);
    const saved = await newInspection.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving inspection:", err);
    res.status(500).json({ error: "Failed to save inspection" });
  }
});

// ✅ Get all inspections
app.get("/api/inspections", async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ createdAt: -1 });
    res.json(inspections);
  } catch (err) {
    console.error("Error fetching inspections:", err);
    res.status(500).json({ error: "Failed to fetch inspections" });
  }
});

// ✅ Get a single inspection by ID
app.get("/api/inspections/:id", async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ error: "Inspection not found" });
    res.json(inspection);
  } catch (err) {
    console.error("Error fetching inspection:", err);
    res.status(500).json({ error: "Failed to fetch inspection" });
  }
});

// ✅ Update inspection by ID
app.put("/api/inspections/:id", async (req, res) => {
  try {
    const updated = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Inspection not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating inspection:", err);
    res.status(500).json({ error: "Failed to update inspection" });
  }
});

// ✅ Delete inspection by ID
app.delete("/api/inspections/:id", async (req, res) => {
  try {
    const deleted = await Inspection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Inspection not found" });
    res.json({ message: "Inspection deleted successfully" });
  } catch (err) {
    console.error("Error deleting inspection:", err);
    res.status(500).json({ error: "Failed to delete inspection" });
  }
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

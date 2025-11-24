import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


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
  customer: String,
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

  lassar:Number,
  patta:Number,
  shadeOut:Number,

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
import inspectionRoutes from "./routes/inspections.js";
app.use("/api/inspections", inspectionRoutes);



// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

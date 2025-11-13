import mongoose from "mongoose";

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

  major: Number,
  minor: Number,
  oql: Number,
  percentAllowed: Number,

  critical: Number,
  actualMajor: Number,
  actualMinor: Number,
  actualOql: Number,

  // Major Defects
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

  // Minor Defects
  singleUntrimmedThread: Number,
  contaminationMinor: Number,
  flyYarn: Number,
  dustMark: Number,
  stainMinor: Number,
}, { timestamps: true });

export default mongoose.model("Inspection", inspectionSchema);

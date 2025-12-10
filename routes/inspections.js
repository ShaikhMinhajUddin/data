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

/* ✅ POST imported inspections (from Excel/CSV) - UPDATED */
router.post("/import", async (req, res) => {
  try {
    const data = req.body;

    console.log("📥 Import request received, records count:", data?.length);
    
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    // Log first record for debugging
    console.log("📋 First record sampleSize:", data[0]?.sampleSize);
    console.log("📋 First record offeredQtyCtn:", data[0]?.offeredQtyCtn);
    console.log("📋 First record offeredQtyPacks:", data[0]?.offeredQtyPacks);
    console.log("📋 First record keys:", Object.keys(data[0]));

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Process each record individually
    for (let i = 0; i < data.length; i++) {
      try {
        const item = data[i];
        
        // Create a clean copy
        const inspectionData = { ...item };
        
        // REMOVE any MongoDB reserved fields
        delete inspectionData._id;
        delete inspectionData.__v;
        delete inspectionData.createdAt;
        delete inspectionData.updatedAt;
        
        // Ensure required numeric fields exist with defaults
        inspectionData.sampleSize = Number(inspectionData.sampleSize) || 0;
        inspectionData.offeredQtyCtn = Number(inspectionData.offeredQtyCtn) || 0;
        inspectionData.offeredQtyPacks = Number(inspectionData.offeredQtyPacks) || 0;
        
        // Ensure other important numeric fields
        inspectionData.major = Number(inspectionData.major) || 0;
        inspectionData.minor = Number(inspectionData.minor) || 0;
        inspectionData.oql = Number(inspectionData.oql) || 0;
        inspectionData.actualMajor = Number(inspectionData.actualMajor) || 0;
        inspectionData.actualMinor = Number(inspectionData.actualMinor) || 0;
        inspectionData.actualOql = Number(inspectionData.actualOql) || 0;
        inspectionData.dpi = Number(inspectionData.dpi) || 0;
        
        // Ensure pass/fail/abort/pending fields
        inspectionData.pass = Number(inspectionData.pass) || 0;
        inspectionData.fail = Number(inspectionData.fail) || 0;
        inspectionData.abort = Number(inspectionData.abort) || 0;
        inspectionData.pending = Number(inspectionData.pending) || 0;
        
        // Handle inspectionStatus if missing
        if (!inspectionData.inspectionStatus) {
          if (inspectionData.pass === 1) {
            inspectionData.inspectionStatus = "Pass";
          } else if (inspectionData.fail === 1) {
            inspectionData.inspectionStatus = "Fail";
          } else if (inspectionData.pending === 1) {
            inspectionData.inspectionStatus = "Pending";
          } else {
            inspectionData.inspectionStatus = "Abort";
          }
        }
        
        // Convert date string to Date object
        if (inspectionData.inspectionDate) {
          if (typeof inspectionData.inspectionDate === 'string') {
            inspectionData.inspectionDate = new Date(inspectionData.inspectionDate);
          }
          // If date is invalid, set to current date
          if (isNaN(inspectionData.inspectionDate.getTime())) {
            inspectionData.inspectionDate = new Date();
          }
        } else {
          inspectionData.inspectionDate = new Date();
        }
        
        // Ensure year and month exist
        if (!inspectionData.year && inspectionData.inspectionDate) {
          inspectionData.year = inspectionData.inspectionDate.getFullYear();
        }
        
        if (!inspectionData.month && inspectionData.inspectionDate) {
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          inspectionData.month = months[inspectionData.inspectionDate.getMonth()];
        }
        
        // Create and save inspection
        const newInspection = new Inspection(inspectionData);
        await newInspection.save();
        
        results.success++;
        
      } catch (itemError) {
        results.failed++;
        results.errors.push({
          index: i,
          error: itemError.message,
          data: data[i]
        });
        console.error(`❌ Error in record ${i}:`, itemError.message);
      }
    }

    console.log(`✅ Import results: ${results.success} successful, ${results.failed} failed`);

    res.status(200).json({ 
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      results: results
    });
  } catch (err) {
    console.error("❌ Import error:", err.message);
    console.error("❌ Import stack:", err.stack);
    
    res.status(500).json({ 
      error: "Failed to import inspection data",
      details: err.message 
    });
  }
});

/* ✅ UPDATE inspection by ID */
router.put("/:id", async (req, res) => {
  try {
    const updatedInspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
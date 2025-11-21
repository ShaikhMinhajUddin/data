import Inspection from "../models/Inspection.js";

// existing single record handler
export const addInspection = async (req, res) => {
  try {
    const {
      lassar = 0,
      patta = 0,
      shadeOut = 0,
      ...rest
    } = req.body;

    const inspection = new Inspection({
      ...rest,
      lassar: Number(lassar),
      patta: Number(patta),
      shadeOut: Number(shadeOut),
    });

    await inspection.save();
    res.status(201).json(inspection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save inspection" });
  }
};


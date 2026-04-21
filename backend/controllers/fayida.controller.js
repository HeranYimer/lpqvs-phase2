import { verifyFayidaID } from "../services/fayida.service.js";

export const verifyFayida = async (req, res) => {
  const { fayidaId, fullName } = req.body;

  try {
    const result = await verifyFayidaID(fayidaId);

    // ❌ API FAILED → fallback
    if (!result.success && result.fallback) {
      return res.status(200).json({
        verified: false,
        manualVerificationRequired: true,
        message: "Fayida system unavailable. Proceed with manual verification."
      });
    }

    // ❌ ID NOT FOUND
    if (!result.data) {
      return res.status(404).json({
        verified: false,
        message: "Fayida ID not found"
      });
    }

    // ✅ AC2: VALIDATE DETAILS
    const isMatch =
      result.data.fullName.toLowerCase() === fullName.toLowerCase();

    if (!isMatch) {
      return res.status(400).json({
        verified: false,
        message: "Details do not match Fayida records"
      });
    }

    // ✅ SUCCESS
    return res.json({
      verified: true,
      data: result.data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Verification error"
    });
  }
};
import { FAKE_FAYIDA_DB } from "../utils/fayida.mock.js";

export const verifyFayidaID = async (fayidaId) => {
  try {
    const record = FAKE_FAYIDA_DB.find(
      (user) => user.fayidaId === fayidaId
    );

    if (!record) {
      return {
        success: true,
        data: null
      };
    }

    return {
      success: true,
      data: record
    };

  } catch (error) {
    console.error("Fayida verification error:", error);

    return {
      success: false,
      fallback: true
    };
  }
};
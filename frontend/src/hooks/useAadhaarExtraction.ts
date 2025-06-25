import { useState } from "react";
import type { IAadhaarData } from "../interfaces/IAadhaar";
import { extractAadhaarData } from "../service/apiService";

export const useAadhaarExtraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<IAadhaarData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractData = async (
    frontImage: File | null,
    backImage: File | null
  ) => {
    if (!frontImage || !backImage) return;

    setIsLoading(true);
    setError(null);

    try {
      

      const data = await extractAadhaarData(frontImage, backImage);

      

      setExtractedData(data);
    } catch (error: any) {
      console.error("Error extracting Aadhaar data:", error);
      setError(
        error.response?.data?.message || "Failed to extract Aadhaar data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    setExtractedData(null);
  };

  return {
    isLoading,
    extractedData,
    extractData,
    resetData,
    error,
  };
};

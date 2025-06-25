import { useState } from 'react';

interface ExtractedData {
  name: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  address: string;
}

export const useAadhaarExtraction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const extractData = async (frontImage: File | null, backImage: File | null) => {
    if (!frontImage || !backImage) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data - in real implementation, this would call your OCR API
    const mockData: ExtractedData = {
      name: 'JOHN DOE',
      aadhaarNumber: '1234 5678 9012',
      dateOfBirth: '15/08/1990',
      address: '123 Main Street, Sector 1, New Delhi, Delhi - 110001'
    };

    setExtractedData(mockData);
    setIsLoading(false);
  };

  const resetData = () => {
    setExtractedData(null);
  };

  return {
    isLoading,
    extractedData,
    extractData,
    resetData
  };
};
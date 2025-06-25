import fs from 'fs';

// Clean and normalize text
export const cleanText = (text: string): string => {
  return text
    .replace(/[^\w\s\/:.-]/g, ' ') // Remove special characters except common ones
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

// Aadhaar number validation
export const isValidAadhaar = (aadhaar: string): boolean => {
  const cleaned = aadhaar.replace(/\D/g, '');
  return cleaned.length === 12 && /^\d{12}$/.test(cleaned);
};

// Pincode validation
export const isValidPincode = (pincode: string): boolean => {
  const cleaned = pincode.replace(/\D/g, '');
  return cleaned.length === 6 && /^[1-8]\d{5}$/.test(cleaned); // Valid Indian pincode
};

// Extract name
export const extractName = (text: string): string => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  const namePatterns = [
    /(?:Name|नाम)\s*:?\s*([A-Za-z\s]{2,50})/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*){0,3})$/m,
    /\b([A-Z][a-z]+(?:\s+[A-Z]\.?){0,2})\b/m,
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim();
      if (/^[A-Z][a-z]*(?:\s+[A-Z][a-z]*){0,3}(?:\s+[A-Z]\.?)?$/.test(name)) {
        return name;
      }
    }
  }

  for (const line of lines) {
    const cleaned = cleanText(line);
    if (cleaned.match(/government|india|aadhaar|unique/i)) continue;

    if (
      (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]*){0,2}(?:\s+[A-Z]\.?)?$/.test(cleaned) && cleaned.length <= 50) ||
      /^[A-Z][a-z]+\s+[A-Z]\.?$/i.test(cleaned)
    ) {
      return cleaned;
    }
  }

  return '';
};

// Extract Aadhaar number
export const extractAadhaarNumber = (text: string): string => {
  const patterns = [
    /(\d{4}\s+\d{4}\s+\d{4})/g,
    /(\d{12})/g,
    /(\d{4}[-\s]\d{4}[-\s]\d{4})/g,
  ];

  for (const pattern of patterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const aadhaar = match[1].replace(/[\s-]/g, '');
      if (isValidAadhaar(aadhaar)) {
        return aadhaar;
      }
    }
  }

  return '';
};

// Extract DOB
export const extractDOB = (text: string): string => {
  const dobPatterns = [
    /(?:DOB|Date of Birth|जन्म तिथि)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/gi,
    /(?:Birth|Born)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/gi,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/g,
  ];

  for (const pattern of dobPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const dateStr = match[1];
      const parts = dateStr.split(/[\/\-\.]/);
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2025) {
          return dateStr;
        }
      }
    }
  }

  return '';
};

// Extract gender
export const extractGender = (text: string): string => {
  const genderPatterns = [
    /(?:Gender|Sex|लिंग)\s*:?\s*(Male|Female|M|F|MALE|FEMALE|पुरुष|महिला)/i,
    /\b(Male|Female|MALE|FEMALE|पुरुष|महिला)\b/i,
  ];

  for (const pattern of genderPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const gender = match[1].toLowerCase();
      if (gender.includes('m') || gender.includes('पुरुष')) return 'Male';
      if (gender.includes('f') || gender.includes('महिला')) return 'Female';
    }
  }

  return '';
};

// Extract address
export const extractAddress = (text: string): string => {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  const addressPatterns = [
    /(?:Address|पता)\s*:?\s*([\s\S]*?)(?=\n\s*\n|\Z)/i,
    /(?:S\/O|D\/O|W\/O|C\/O)\s+([^,\n]*(?:,\s*[^,\n]*)*)/i,
  ];

  for (const pattern of addressPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      let address = match[1].trim().replace(/\s+/g, ' ');
      if (address.length > 10 && address.length < 200) {
        return address;
      }
    }
  }

  const addressLines = lines.filter(line => {
    const cleaned = cleanText(line);
    return (
      cleaned.length > 5 &&
      !cleaned.match(/\d{12}/) &&
      !cleaned.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}/) &&
      !cleaned.match(/^(Male|Female|MALE|FEMALE)$/i) &&
      !cleaned.match(/government|india|aadhaar|unique/i) &&
      !cleaned.match(/^\d{6}$/) &&
      cleaned.length < 100
    );
  });

  return addressLines.slice(0, 4).join(', ') || '';
};

// Extract pincode
export const extractPincode = (text: string): string => {
  const patterns = [
    /(?:PIN|Pincode|Pin Code)\s*:?\s*(\d{6})/gi,
    /\b(\d{6})\b/g,
  ];

  for (const pattern of patterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const pincode = match[1];
      if (isValidPincode(pincode)) {
        return pincode;
      }
    }
  }

  return '';
};

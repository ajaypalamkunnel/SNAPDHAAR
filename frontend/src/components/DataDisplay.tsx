import React, { useState } from 'react';
import { Copy, Check, Loader2, Scan } from 'lucide-react';

interface ExtractedData {
  name: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  address: string;
}

interface DataDisplayProps {
  data: ExtractedData | null;
  isLoading: boolean;
  onExtract: () => void;
  canExtract: boolean;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ 
  data, 
  isLoading, 
  onExtract, 
  canExtract 
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const DataField: React.FC<{ label: string; value: string; field: string }> = ({ 
    label, 
    value, 
    field 
  }) => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      <div className="flex items-center justify-between">
        <span className="text-gray-900 dark:text-gray-100 font-mono">
          {value || 'Not extracted'}
        </span>
        {value && (
          <button
            onClick={() => copyToClipboard(value, field)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            aria-label={`Copy ${label}`}
          >
            {copiedField === field ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Extracted Data
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Upload both sides of your Aadhaar card to extract information
        </p>
      </div>

      <button
        onClick={onExtract}
        disabled={!canExtract || isLoading}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2
          ${canExtract && !isLoading
            ? 'bg-[#05782d] hover:bg-green-700 hover:scale-[1.02] shadow-lg hover:shadow-xl'
            : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Extracting Data...</span>
          </>
        ) : (
          <>
            <Scan className="w-5 h-5" />
            <span>Extract Data</span>
          </>
        )}
      </button>

      <div className="space-y-4">
        <DataField 
          label="Name" 
          value={data?.name || ''} 
          field="name" 
        />
        <DataField 
          label="Aadhaar Number" 
          value={data?.aadhaarNumber || ''} 
          field="aadhaarNumber" 
        />
        <DataField 
          label="Date of Birth" 
          value={data?.dateOfBirth || ''} 
          field="dateOfBirth" 
        />
        <DataField 
          label="Address" 
          value={data?.address || ''} 
          field="address" 
        />
      </div>

      {data && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✓ Data extracted successfully! You can copy individual fields using the copy buttons.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
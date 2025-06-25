import  { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext'; 
import Header from './components/Header';
import ImageUpload from './components/ImageUpload'; 
import DataDisplay from './components/DataDisplay';
import { useAadhaarExtraction } from './hooks/useAadhaarExtraction';

function AppContent() {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const { isLoading, extractedData, extractData, resetData,error } = useAadhaarExtraction();

  const handleFrontImageSelect = (file: File) => {
    setFrontImage(file);
    resetData();
  };

  const handleBackImageSelect = (file: File) => {
    setBackImage(file);
    resetData();
  };

  const handleFrontImageRemove = () => {
    setFrontImage(null);
    resetData();
  };

  const handleBackImageRemove = () => {
    setBackImage(null);
    resetData();
  };

  const handleExtract = () => {
    extractData(frontImage, backImage);
  };

  const canExtract = frontImage !== null && backImage !== null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#191414] transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Extract Aadhaar Data
            <span className="text-[#05782d]"> Instantly</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload clear images of both sides of your Aadhaar card to automatically extract 
            your personal information with advanced OCR technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Upload */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Upload Aadhaar Images
              </h2>
              
              <div className="space-y-6">
                <ImageUpload
                  label="Front Side"
                  onImageSelect={handleFrontImageSelect}
                  image={frontImage}
                  onImageRemove={handleFrontImageRemove}
                />
                
                <ImageUpload
                  label="Back Side"
                  onImageSelect={handleBackImageSelect}
                  image={backImage}
                  onImageRemove={handleBackImageRemove}
                />
              </div>
              
              {frontImage && backImage && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Both images uploaded successfully! Ready for data extraction.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Data Display */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <DataDisplay
                data={extractedData}
                isLoading={isLoading}
                onExtract={handleExtract}
                canExtract={canExtract}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#05782d] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Secure Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your images are processed securely and never stored on our servers.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#05782d] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Fast Extraction
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get your Aadhaar data extracted in seconds with high accuracy.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#05782d] rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Mobile Friendly
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Works perfectly on all devices - desktop, tablet, and mobile.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
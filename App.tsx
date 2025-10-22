
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { generateHugImage } from './services/geminiService';

const App: React.FC = () => {
  const [childhoodImage, setChildhoodImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState('nostalgic');

  const styles = [
    { id: 'nostalgic', label: 'Nostalgic' },
    { id: 'playful', label: 'Playful' },
    { id: 'sentimental', label: 'Sentimental' },
  ];

  const handleGenerate = useCallback(async () => {
    if (!childhoodImage || !currentImage) {
      setError("Please upload both a childhood and a current photo.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // The data URL includes a prefix like `data:image/jpeg;base64,` which needs to be removed.
      const childImgBase64 = childhoodImage.split(',')[1];
      const currentImgBase64 = currentImage.split(',')[1];
      
      const resultImageUrl = await generateHugImage(childImgBase64, currentImgBase64, style);
      setGeneratedImage(resultImageUrl);
    } catch (e) {
      console.error(e);
      let userFriendlyError = "Sorry, something went wrong while creating your image. Please try again.";
      if (e instanceof Error) {
        if (e.message.includes("API key not configured")) {
          userFriendlyError = "The application is not configured correctly. An API key is missing.";
        } else if (e.message.includes("Invalid API Key")) {
            userFriendlyError = "Authentication failed. The provided API key is invalid.";
        } else if (e.message.includes("safety concerns")) {
            userFriendlyError = "The image could not be generated due to safety filters. Please try with different photos.";
        } else if (e.message.includes("No image was generated")) {
            userFriendlyError = "The AI could not generate an image from your photos. Please try again with different ones."
        }
      }
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  }, [childhoodImage, currentImage, style]);

  const handleReset = () => {
    setChildhoodImage(null);
    setCurrentImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const canGenerate = childhoodImage && currentImage && !isLoading;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <p className="text-center text-slate-600 mb-8">
            Upload a photo from your childhood and one from today. Our AI will create a magical moment where you get to hug your younger self.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ImageUploader 
              label="Childhood Photo" 
              onImageUpload={setChildhoodImage}
              imagePreview={childhoodImage}
            />
            <ImageUploader 
              label="Current Photo" 
              onImageUpload={setCurrentImage}
              imagePreview={currentImage}
            />
          </div>

          {!generatedImage && (
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-3">Choose a Style</h3>
              <div className="flex justify-center items-center gap-3">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      style === s.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            {generatedImage ? (
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <a
                  href={generatedImage}
                  download="shurgee.png"
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-md"
                >
                  Download Image
                </a>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
                >
                  Create Another One
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`px-8 py-3 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md ${
                  canGenerate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                ✨ Generate Hug
              </button>
            )}
          </div>
          
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          <ResultDisplay 
            imageUrl={generatedImage}
            isLoading={isLoading}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>"ShurGee" by R Tasaduk | Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
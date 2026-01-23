import React, { useState, useCallback } from 'react';
import { PredictionForm } from './components/PredictionForm';
import { PriceDisplay } from './components/PriceDisplay';
import { predictHousePrice } from './services/geminiService';
import type { PredictionResult, PredictionError } from './types';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [size, setSize] = useState<number>(2000);
  const [bhk, setBhk] = useState<number>(3);
  const [location, setLocation] = useState<string>('Tumkur, Karnataka');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<PredictionError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (!location.trim()) {
      setError({ message: "Location is a required field." });
      return;
    }
    setIsLoading(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await predictHousePrice(size, bhk, location);
      setPrediction(result);
    } catch (e) {
      if (e instanceof Error) {
        setError({ message: e.message });
      } else {
        setError({ message: "An unknown error occurred." });
      }
    } finally {
      setIsLoading(false);
    }
  }, [size, bhk, location]);

  return (
    <main className="bg-gray-900 min-h-screen w-full flex flex-col items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
              <SparklesIcon />
              AI House Price Predictor
            </h1>
            <p className="text-gray-400 mt-3 text-lg">
              Estimate property values with generative AI
            </p>
          </div>

          <PredictionForm
            size={size}
            setSize={setSize}
            bhk={bhk}
            setBhk={setBhk}
            location={location}
            setLocation={setLocation}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <PriceDisplay
            prediction={prediction}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google's Gemini API.</p>
        <p>Disclaimer: This is for informational purposes only and not a real valuation.</p>
        <p className="mt-2">
            Reference: <a href="https://igr.karnataka.gov.in/page/Revised+Guidelines+Value/en" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Karnataka IGR Guidelines</a>
        </p>
      </footer>
    </main>
  );
};

export default App;
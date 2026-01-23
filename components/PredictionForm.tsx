import React from 'react';
import { LoaderIcon } from './Icons';

interface PredictionFormProps {
  size: number;
  setSize: (size: number) => void;
  bhk: number;
  setBhk: (bhk: number) => void;
  location: string;
  setLocation: (location: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  size,
  setSize,
  bhk,
  setBhk,
  location,
  setLocation,
  onSubmit,
  isLoading,
}) => {
  const bhkOptions = [1, 2, 3, 4, 5];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2">
            Size (sq. ft.)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              id="size"
              min="600"
              max="8000"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              disabled={isLoading}
            />
            <span className="text-lg font-semibold text-blue-300 w-24 text-right">
              {size.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">
            BHK
          </label>
          <div className="flex space-x-2">
            {bhkOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBhk(option)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
                  bhk === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-700 hover:bg-gray-600 text-gray-300'
                }`}
                disabled={isLoading}
              >
                {option}{option === 5 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
          Location (e.g., City, State or Zip Code)
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Belagarahalli , Tiptur"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
        />
        <p className="mt-2 text-xs text-gray-400">
           Reference: <a href="https://igr.karnataka.gov.in/page/Revised+Guidelines+Value/en" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Check Karnataka IGR Revised Guidelines</a> for official values.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !location}
        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
            <>
                <LoaderIcon />
                Predicting...
            </>
        ) : (
          'Predict Price'
        )}
      </button>
    </form>
  );
};
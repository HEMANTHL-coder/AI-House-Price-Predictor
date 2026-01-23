import React from 'react';
import type { PredictionResult, PredictionError } from '../types';
import { LoaderIcon } from './Icons';

interface PriceDisplayProps {
  prediction: PredictionResult | null;
  error: PredictionError | null;
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  prediction,
  error,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 text-center bg-gray-900/50 rounded-lg min-h-[180px] flex flex-col justify-center items-center">
        <LoaderIcon />
        <p className="text-gray-400 mt-2 text-lg">AI is analyzing the market...</p>
        <p className="text-gray-500 text-sm">This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 text-center bg-red-900/30 border border-red-500/50 rounded-lg min-h-[180px] flex flex-col justify-center items-center">
        <p className="text-red-400 font-semibold">Error</p>
        <p className="text-red-300 mt-2">{error.message}</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="mt-8 p-6 text-center bg-gray-900/50 rounded-lg min-h-[180px] flex flex-col justify-center items-center">
        <p className="text-gray-500">Your price prediction will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 text-center bg-gray-900/50 border border-gray-700 rounded-lg animate-fade-in">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        Estimated Market Value
      </p>
      <p className="text-5xl font-bold my-2 text-green-400">
        {formatCurrency(prediction.predictedPrice)}
      </p>
      <p className="text-gray-400 mb-4">
        Range: {formatCurrency(prediction.priceRangeLow)} - {formatCurrency(prediction.priceRangeHigh)}
      </p>
      <div className="text-left bg-gray-800/60 p-4 rounded-md">
        <p className="font-semibold text-blue-300 mb-1">AI Reasoning:</p>
        <p className="text-gray-300 text-sm">{prediction.reasoning}</p>
      </div>
    </div>
  );
};
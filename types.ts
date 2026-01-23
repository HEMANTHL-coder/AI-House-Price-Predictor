export interface PredictionResult {
  predictedPrice: number;
  reasoning: string;
  priceRangeLow: number;
  priceRangeHigh: number;
}

export interface PredictionError {
    message: string;
}

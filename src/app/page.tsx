"use client";

import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState("RELIANCE.NS"); // Initial value

  const handleSearch = async () => {
    setLoading(true);
    try {
      const predictionResponse = await axios.get(
        `http://127.0.0.1:8000/predict?ticker=${ticker}`
      );
      setPredictionData(predictionResponse.data);
      console.log("API Response Data:", predictionResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const chartData = {
    labels: predictionData?.chart_data?.dates,
    datasets: [
      {
        label: "Historical Price",
        data: predictionData?.chart_data?.prices,
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Prediction",
        data: predictionData?.chart_data?.prediction,
        borderColor: "orange",
        fill: false,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Stock Prediction & Recommendation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                placeholder="Enter stock ticker (e.g., RELIANCE.NS)"
                className="border p-2 rounded-md w-full mr-2"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Loading..." : `Get ${ticker} Prediction`}
              </button>
            </div>
            {predictionData && (
              <div>
                {predictionData.error ? (
                  <p className="text-red-500 text-center text-xl">{predictionData.error}</p>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-4">
                      {predictionData.stock_symbol}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold">Last Price</p>
                        <p className="text-2xl">
                          ${predictionData.last_price?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-lg font-semibold">Prediction</p>
                        <p className="text-2xl">
                          ${predictionData.prediction?.toFixed(2) || "N/A"}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-lg text-center text-white ${
                          predictionData.recommendation === "BUY"
                            ? "bg-green-500"
                            : predictionData.recommendation === "SELL"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      >
                        <p className="text-lg font-semibold">Recommendation</p>
                        <p className="text-2xl">
                          {predictionData.recommendation || "N/A"}
                        </p>
                      </div>
                    </div>
                    <Line data={chartData} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>Enter a stock ticker (e.g., RELIANCE.NS, AAPL, GOOG) to get its prediction and recommendation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

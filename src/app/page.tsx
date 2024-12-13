"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './styles.css'; // Import custom styles

type CSVRow = {
  [key: string]: string;
};

const Home: React.FC = () => {
  const [data, setData] = useState<CSVRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [areLastColumnsRevealed, setAreLastColumnsRevealed] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<CSVRow>(file, {
        header: true,
        complete: (results) => {
          setData(results.data);
          setCurrentIndex(0); // Reset to the first row
          setAreLastColumnsRevealed(false); // Hide the last two columns initially
        },
      });
    }
  };

  const handleNextRow = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    setAreLastColumnsRevealed(false); // Reset revealed columns
  };

  const handlePreviousRow = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    setAreLastColumnsRevealed(false); // Reset revealed columns
  };

  const handleRevealColumns = () => {
    setShowSplashScreen(true);
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownInterval);
      setShowSplashScreen(false);
      setAreLastColumnsRevealed(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      {showSplashScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <h1 className="text-6xl font-bold text-white">{countdown}</h1>
            <div className="balloon-container">
              <div className="balloon balloon1"></div>
              <div className="balloon balloon2"></div>
              <div className="balloon balloon3"></div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full text-center py-4 mb-8 animate-bounce">
        <h1 className="text-6xl font-bold text-white">Team Social - Data+AI+MW</h1>
      </div>
      <h1 className="text-5xl font-bold mb-8 text-white">Do You Know Your Colleagues Better Than Copilot!</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto w-full">
        {data.length > 0 && (
          <>
            <div className="text-3xl font-bold text-white mb-4 text-center">
              Favourite...
            </div>
            <div className="flex flex-wrap justify-center space-x-4">
              {Object.entries(data[currentIndex])
                .slice(0, -2)
                .map(([key, value], i) => (
                  <div
                    key={i}
                    className="p-4 bg-white shadow-md rounded-lg border border-gray-300 text-2xl text-green-600"
                  >
                    <div className="font-bold mb-2 text-red-600">{key}</div>
                    <div>{value}</div>
                  </div>
                ))}
            </div>
            {areLastColumnsRevealed && (
              <>
                <div className="text-3xl font-bold text-white mb-4 text-center">
                  Person
                </div>
                <div className="flex flex-wrap justify-center space-x-4 mt-4">
                  {Object.entries(data[currentIndex])
                    .slice(-2)
                    .map(([key, value], i) => (
                      <div
                        key={i}
                        className="p-4 bg-white shadow-md rounded-lg border border-gray-300 text-2xl text-green-600"
                      >
                        <div className="font-bold mb-2 text-red-600">{key}</div>
                        <div>{value}</div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {data.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-center space-y-4">
          {!areLastColumnsRevealed && (
            <button
              onClick={handleRevealColumns}
              className="p-2 bg-green-500 text-white rounded"
            >
              Reveal
            </button>
          )}
          <div className="flex space-x-4">
            <button
              onClick={handlePreviousRow}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Back
            </button>
            <button
              onClick={handleNextRow}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Next 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
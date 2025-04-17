import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingTip, setLoadingTip] = useState('');

  const tips = [
    "Tip: High-quality photos get more trade offers",
    "Did you know? You can bundle multiple items in one trade",
    "Pro tip: Be clear about item condition in your listings",
    "Remember: You can negotiate trades before accepting",
    "Safety first: Always meet in public places for exchanges"
  ];

  useEffect(() => {
    // Set random tip
    setLoadingTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* App Logo/Title - consistent with your design */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Barter Marketplace</h1>
        <p className="text-center text-gray-500 mt-1">Trade what you have for what you need</p>
      </div>
      
      {/* Animated loading spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Trading tips */}
      <div className="mt-8 max-w-md text-center px-4">
        <p className="text-xs text-gray-500 italic">
          {loadingTip}
        </p>
      </div>
      
      {/* Optional: App slogan at bottom */}
      <div className="absolute bottom-8">
        <p className="text-xs text-gray-400">No money? No problem!</p>
      </div>
    </div>
  );
}
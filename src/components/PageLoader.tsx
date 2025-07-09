
import { useEffect, useState } from 'react';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-50 backdrop-blur-sm">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20"
            style={{
              background: `linear-gradient(45deg, ${i % 2 === 0 ? '#eab308' : '#06b6d4'}, transparent)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-cyan-400 opacity-75"></div>
          </div>
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-cyan-500 flex items-center justify-center shadow-2xl">
            <img 
              src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
              alt="Loading..." 
              className="w-12 h-12 object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Spinning rings */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-yellow-200 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-cyan-200 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          <div className="absolute inset-4 border-4 border-yellow-300 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-6 border-4 border-cyan-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/50">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Loading text with typewriter effect */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
            RentZoo
          </h2>
          <p className="text-gray-600 mt-2 animate-bounce">Loading amazing features...</p>
        </div>

        {/* Floating dots */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;

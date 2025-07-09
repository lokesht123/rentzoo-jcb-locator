
import { useEffect, useState } from 'react';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 6;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/20 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-auto px-8">
        
        {/* Road/Ground */}
        <div className="relative h-32 mb-8">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-muted-foreground/10 via-muted-foreground/20 to-muted-foreground/10 rounded-lg"></div>
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full"></div>
          <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse"></div>
          
          {/* Animated Backhoe Loader */}
          <div className="absolute bottom-4 left-0 animate-[slide-loader_3s_ease-in-out_infinite]">
            <div className="relative w-16 h-12">
              {/* Main body */}
              <div className="absolute bottom-0 left-4 w-8 h-6 bg-primary rounded-sm shadow-lg">
                <div className="absolute top-1 left-1 w-2 h-1 bg-primary-foreground/20 rounded-sm"></div>
                <div className="absolute top-1 right-1 w-1 h-3 bg-primary-foreground/30 rounded-sm"></div>
              </div>
              
              {/* Cabin */}
              <div className="absolute bottom-4 left-5 w-4 h-4 bg-secondary rounded-t-lg shadow-md">
                <div className="absolute top-1 left-1 w-1 h-1 bg-secondary-foreground/40 rounded-full"></div>
              </div>
              
              {/* Arm */}
              <div className="absolute bottom-6 left-8 w-6 h-1 bg-primary rotate-12 origin-left rounded-full shadow-sm animate-[arm-move_2s_ease-in-out_infinite]"></div>
              
              {/* Bucket */}
              <div className="absolute bottom-4 left-12 w-3 h-2 bg-primary rounded-sm shadow-sm animate-[bucket-tilt_2s_ease-in-out_infinite]"></div>
              
              {/* Wheels */}
              <div className="absolute bottom-1 left-2 w-3 h-3 bg-foreground/80 rounded-full shadow-inner animate-spin"></div>
              <div className="absolute bottom-1 left-8 w-4 h-4 bg-foreground/80 rounded-full shadow-inner animate-spin"></div>
            </div>
          </div>
          
          {/* Destination marker */}
          <div className="absolute bottom-8 right-8 flex flex-col items-center animate-bounce">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-secondary-foreground rounded-full"></div>
            </div>
            <div className="w-px h-6 bg-secondary mt-1"></div>
          </div>
          
          {/* Dust particles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-6 w-1 h-1 bg-muted-foreground/40 rounded-full animate-float"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Progress section */}
        <div className="flex flex-col items-center space-y-6">
          
          {/* Brand */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RentZoo
            </h2>
            <p className="text-sm text-muted-foreground font-medium">Equipment arriving to destination...</p>
          </div>

          {/* Progress bar */}
          <div className="w-80 max-w-sm space-y-2">
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;

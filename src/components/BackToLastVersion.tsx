
import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BackToLastVersion = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleRevert = () => {
    // This would typically trigger a revert to the previous version
    // For now, we'll just hide the component
    setIsVisible(false);
    
    // In a real implementation, you might:
    // - Call an API to revert changes
    // - Navigate to a previous state
    // - Show a confirmation dialog
    console.log('Reverting to previous version...');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-white/90 backdrop-blur-md border-yellow-300 shadow-xl max-w-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-yellow-700">
              New Features Added
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 mb-3">
            Don't like the new features? You can revert to the previous version.
          </p>
          <Button
            onClick={handleRevert}
            variant="outline"
            size="sm"
            className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to Previous Version
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackToLastVersion;

import { Loader2 } from 'lucide-react';

// Fullscreen loading spinner component with semi-transparent backdrop
const Loader = () => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-background/80"
      role="progressbar"
      aria-label="Loading content"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Loader;

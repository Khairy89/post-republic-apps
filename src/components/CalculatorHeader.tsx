
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft } from "lucide-react";

const CalculatorHeader = () => {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/assets/logo_post-transparent.png" 
                alt="PostRepublic" 
                className="h-12 w-auto"
              />
            </Link>
          </div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CalculatorHeader;

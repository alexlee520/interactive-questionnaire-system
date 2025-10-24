import React from "react";
import { Card } from "@/components/ui/card";

export interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface StepContainerProps {
  children: React.ReactNode;
}

export function StepContainer({ children }: StepContainerProps) {
  return (
    <div className="w-full max-w-[760px] mx-auto opacity-100 translate-y-0 transition-all duration-[450ms] ease-out">
      {children}
    </div>
  );
}


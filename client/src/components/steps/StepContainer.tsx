interface StepContainerProps {
  children: React.ReactNode;
  questionNumber?: string;
}

export function StepContainer({ children, questionNumber }: StepContainerProps) {
  return (
    <div className="w-full max-w-[760px] opacity-100 translate-y-0 transition-all duration-[450ms] ease-out">
      {questionNumber && (
        <div className="text-muted-foreground text-[0.9rem] mb-3 font-semibold tracking-[0.02em]" data-testid={`text-step-${questionNumber}`}>
          {questionNumber}
        </div>
      )}
      {children}
    </div>
  );
}

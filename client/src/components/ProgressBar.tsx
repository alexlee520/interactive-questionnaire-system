interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-primary transition-all duration-300 z-[1000]"
      style={{ 
        width: `${progress}%`,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.35)'
      }}
      data-theme-glow="true"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      data-testid="progress-bar"
    />
  );
}

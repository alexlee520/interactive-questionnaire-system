import { AlertTriangle } from "lucide-react";
import { StepContainer } from "./StepContainer";

interface PrivacyRejectedStepProps {
  onReconsider: () => void;
  onHome: () => void;
}

export function PrivacyRejectedStep({ onReconsider, onHome }: PrivacyRejectedStepProps) {
  return (
    <StepContainer>
      <div className="bg-amber-500/10 border-2 border-amber-500 rounded-xl px-[18px] py-[18px] my-5 flex items-start gap-3.5">
        <AlertTriangle className="w-6 h-6 flex-shrink-0 text-amber-500" strokeWidth={2} />
        <div className="flex-1">
          <div className="font-bold mb-1 text-foreground">無法繼續問卷</div>
          <div className="text-muted-foreground text-[0.95rem] leading-[1.6]">
            很抱歉,我們需要您同意個人資料使用條款才能繼續。這是為了確保我們能夠合法且安全地處理您的資料,為您提供最佳服務。
          </div>
        </div>
      </div>
      
      <div className="mt-[26px] flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={onReconsider}
          className="bg-background text-foreground border-2 border-border px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:border-border/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-testid="button-reconsider"
        >
          <span>←</span>
          <span>重新考慮</span>
        </button>
        
        <button
          type="button"
          onClick={onHome}
          className="flex-1 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-testid="button-home"
        >
          <span>返回首頁</span>
        </button>
      </div>
    </StepContainer>
  );
}

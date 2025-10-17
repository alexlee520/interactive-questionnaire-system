import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface PrivacyConsentStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onReject: () => void;
  onChange: (value: string) => void;
}

export function PrivacyConsentStep({ value, onNext, onPrev, onReject, onChange }: PrivacyConsentStepProps) {
  const handleSelect = (selected: string) => {
    onChange(selected);
    if (selected === "同意") {
      setTimeout(onNext, 300);
    } else {
      setTimeout(onReject, 300);
    }
  };

  return (
    <StepContainer questionNumber="第 3 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        個人資料使用同意
      </h1>
      
      <div 
        className="bg-card border border-border rounded-xl px-[18px] py-[18px] text-muted-foreground text-[0.98rem] leading-[1.7] mb-5 max-h-[220px] overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-card"
        role="region"
        aria-label="個資說明"
        tabIndex={0}
      >
        <p><strong className="text-foreground">個人資料蒐集、處理及利用告知事項</strong></p><br/>
        <p>為提供您更完善的服務,我們需要蒐集您的個人資料。您所提供的個人資料,將依據個人資料保護法及相關法令規定,僅用於以下目的:</p><br/>
        <ul className="pl-5 list-disc">
          <li>合作夥伴關係建立與維護</li>
          <li>商業服務諮詢與推廣</li>
          <li>客戶管理與服務</li>
          <li>行銷業務(包含但不限於廣告行銷、問卷調查等)</li>
        </ul><br/>
        <p>您可以選擇是否提供個人資料,若您選擇不提供,可能影響您參與本計畫的權益。</p>
      </div>
      
      <div className="grid gap-3.5" role="radiogroup" aria-label="個人資料使用同意">
        <label 
          className={`bg-background border-2 ${
            value === "同意" ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md" : "border-border"
          } text-foreground px-[22px] py-[18px] rounded-xl cursor-pointer flex items-center gap-3.5 font-semibold transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
          data-testid="option-agree"
        >
          <input 
            type="radio" 
            name="privacyConsent" 
            value="同意" 
            className="sr-only" 
            checked={value === "同意"}
            onChange={(e) => handleSelect(e.target.value)}
          />
          <span className="w-[34px] h-[34px] rounded-lg bg-card text-foreground flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0">
            ✓
          </span>
          <span>我同意以上個人資料使用條款</span>
        </label>
        
        <label 
          className={`bg-background border-2 ${
            value === "不同意" ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md" : "border-border"
          } text-foreground px-[22px] py-[18px] rounded-xl cursor-pointer flex items-center gap-3.5 font-semibold transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
          data-testid="option-disagree"
        >
          <input 
            type="radio" 
            name="privacyConsent" 
            value="不同意" 
            className="sr-only" 
            checked={value === "不同意"}
            onChange={(e) => handleSelect(e.target.value)}
          />
          <span className="w-[34px] h-[34px] rounded-lg bg-card text-foreground flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0">
            ✗
          </span>
          <span>我不同意</span>
        </label>
      </div>
      
      <NavigationButtons onPrev={onPrev} showNext={false} />
    </StepContainer>
  );
}

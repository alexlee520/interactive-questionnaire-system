import { UserPlus, CheckCircle, Heart } from "lucide-react";
import { StepContainer } from "./StepContainer";
import { QuestionnaireData } from "@/pages/Questionnaire";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface CompletionStepProps {
  type: number;
  data: QuestionnaireData;
}

export function CompletionStep({ type, data }: CompletionStepProps) {
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/responses", data);
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  if (type === 100) {
    return (
      <StepContainer>
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-[120px] h-[120px] mx-auto mb-5 bg-primary/10 dark:bg-primary/15 border-2 border-primary rounded-[20px] flex items-center justify-center shadow-sm">
            <UserPlus className="w-[60px] h-[60px] text-primary" strokeWidth={2} />
          </div>
          
          <h2 className="text-[2.2rem] my-2 font-black text-foreground">
            合作的旅程,即將啟程!
          </h2>
          
          <p className="text-muted-foreground text-[1.05rem] mb-5.5">
            我們的專業顧問將於 <strong className="text-foreground">3 個工作天內</strong> 與您聯繫,<br />
            量身打造最適合您的合作方案。
          </p>
          
          <div className="bg-background border border-border rounded-[14px] px-5.5 py-5.5 mt-4 text-left shadow-sm">
            <ResultItem label="商務信箱" value={data.email} />
            <ResultItem label="商家名稱" value={data.businessName} />
            <ResultItem label="聯絡人" value={data.contactName} />
            <ResultItem label="聯絡電話" value={data.contactPhone} />
            <ResultItem label="資訊來源" value={data.infoSource.join(", ")} />
            <ResultItem label="合作意向" value="希望與專人討論" last />
          </div>
          
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="mt-6 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? "提交中..." : "確認提交"}
            </button>
          ) : (
            <div className="mt-6 text-primary font-bold text-lg" data-testid="text-submitted">
              ✓ 已成功提交!
            </div>
          )}
        </div>
      </StepContainer>
    );
  }

  if (type === 101) {
    return (
      <StepContainer>
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-[120px] h-[120px] mx-auto mb-5 bg-primary/10 dark:bg-primary/15 border-2 border-primary rounded-[20px] flex items-center justify-center shadow-sm">
            <CheckCircle className="w-[60px] h-[60px] text-primary" strokeWidth={2} />
          </div>
          
          <h2 className="text-[2.2rem] my-2 font-black text-foreground">
            感謝您的寶貴回饋!
          </h2>
          
          <p className="text-muted-foreground text-[1.05rem] mb-5.5">
            您的意見對我們至關重要,是我們持續優化服務的基石。
          </p>
          
          <div className="bg-background border border-border rounded-[14px] px-5.5 py-5.5 mt-4 text-left shadow-sm">
            <ResultItem label="商務信箱" value={data.email} />
            <ResultItem label="商家名稱" value={data.businessName} />
            <ResultItem label="聯絡人" value={data.contactName} />
            <ResultItem label="聯絡電話" value={data.contactPhone} />
            <ResultItem label="資訊來源" value={data.infoSource.join(", ")} />
            <ResultItem label="推薦意願" value={data.referral || ""} last />
          </div>
          
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="mt-6 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? "提交中..." : "確認提交"}
            </button>
          ) : (
            <div className="mt-6 text-primary font-bold text-lg" data-testid="text-submitted">
              ✓ 已成功提交!
            </div>
          )}
        </div>
      </StepContainer>
    );
  }

  if (type === 102) {
    return (
      <StepContainer>
        <div className="text-center animate-in fade-in duration-500">
          <div className="w-[120px] h-[120px] mx-auto mb-5 bg-primary/10 dark:bg-primary/15 border-2 border-primary rounded-[20px] flex items-center justify-center shadow-sm">
            <Heart className="w-[60px] h-[60px] text-primary" strokeWidth={2} />
          </div>
          
          <h2 className="text-[2.2rem] my-2 font-black text-foreground">
            謝謝您撥冗填寫!
          </h2>
          
          <p className="text-muted-foreground text-[1.05rem] mb-5.5">
            即使目前不適合,您的反饋仍是我們改進的重要依據。<br />
            期待未來有機會再次為您服務!
          </p>
          
          <div className="bg-background border border-border rounded-[14px] px-5.5 py-5.5 mt-4 text-left shadow-sm">
            <ResultItem label="商務信箱" value={data.email} />
            <ResultItem label="商家名稱" value={data.businessName} />
            <ResultItem label="資訊來源" value={data.infoSource.join(", ")} />
            <ResultItem label="不考慮原因" value={data.notInterestedReason || ""} last />
          </div>
          
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="mt-6 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? "提交中..." : "確認提交"}
            </button>
          ) : (
            <div className="mt-6 text-primary font-bold text-lg" data-testid="text-submitted">
              ✓ 已成功提交!
            </div>
          )}
        </div>
      </StepContainer>
    );
  }

  return null;
}

function ResultItem({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`py-3.5 ${!last ? "border-b border-border" : ""}`}>
      <div className="font-bold mb-1.5 text-muted-foreground text-[0.9rem] tracking-[0.01em]">
        {label}
      </div>
      <div className="text-[1.02rem] text-foreground font-bold">
        {value}
      </div>
    </div>
  );
}

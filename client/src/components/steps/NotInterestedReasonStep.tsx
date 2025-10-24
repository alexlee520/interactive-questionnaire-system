import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavigationButtons } from "./NavigationButtons";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface NotInterestedReasonStepProps extends StepProps {
  value: string[];
  otherValue: string;
  onChange: (value: string[]) => void;
  onOtherChange: (value: string) => void;
  isSubmitting?: boolean;
}

const reasons = [
  "時機不合適",
  "對合作內容不了解",
  "公司資源或預算不足",
  "目前無相關需求",
];

export function NotInterestedReasonStep({ value, otherValue, onChange, onOtherChange, onNext, onPrev, isSubmitting = false }: NotInterestedReasonStepProps) {
  const [error, setError] = useState("");

  const handleCheckboxChange = (reason: string, checked: boolean) => {
    if (checked) {
      onChange([...value, reason]);
    } else {
      onChange(value.filter((r) => r !== reason));
    }
  };

  const handleNext = () => {
    if (value.length === 0 && !otherValue.trim()) {
      setError("請至少選擇或填寫一個原因。");
      return;
    }
    setError("");
    onNext();
  };

  const isOtherChecked = value.includes("其他");

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 A6: 無合作意願原因</CardTitle>
        <CardDescription>
          （針對無合作意願者）請問您目前沒有合作意願的主要原因是什麼？(可複選)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reasons.map((reason) => (
            <div key={reason} className="flex items-center space-x-2">
              <Checkbox
                id={`reason-${reason}`}
                checked={value.includes(reason)}
                onCheckedChange={(checked) => {
                  handleCheckboxChange(reason, checked as boolean);
                  if (error) setError("");
                }}
              />
              <Label htmlFor={`reason-${reason}`}>{reason}</Label>
            </div>
          ))}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reason-other"
                checked={isOtherChecked}
                onCheckedChange={(checked) => {
                  handleCheckboxChange("其他", checked as boolean);
                  if (!checked) onOtherChange(""); // 取消勾選時清空其他欄位
                  if (error) setError("");
                }}
              />
              <Label htmlFor="reason-other">其他：</Label>
            </div>
            {isOtherChecked && (
              <Textarea
                placeholder="請簡述您的其他原因"
                value={otherValue}
                onChange={(e) => onOtherChange(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <NavigationButtons
          onNext={handleNext}
          onPrev={onPrev}
          nextText={isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "完成並送出"}
          nextDisabled={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}


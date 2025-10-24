import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";
import { useState } from "react";

interface CompanyNameStepProps extends StepProps {
  value: string;
  onChange: (value: string) => void;
}

export function CompanyNameStep({ value, onChange, onNext, onPrev }: CompanyNameStepProps) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!value.trim()) {
      setError("公司名稱為必填項目。");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 A2: 公司名稱</CardTitle>
        <CardDescription>
          請填寫您的公司名稱。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="companyName">公司名稱</Label>
          <Input
            id="companyName"
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (error && e.target.value.trim()) setError("");
            }}
            placeholder="例如：OO科技股份有限公司"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <NavigationButtons
          onNext={handleNext}
          onPrev={onPrev}
          nextText="下一步"
        />
      </CardContent>
    </Card>
  );
}


import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";
import { useState } from "react";

interface NewCustomerCountStepProps extends StepProps {
  value: number;
  onChange: (value: number) => void;
}

export function NewCustomerCountStep({ value, onChange, onNext, onPrev }: NewCustomerCountStepProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    // 允許空值，但如果是非空值，則必須是有效的非負整數
    if (rawValue.trim() === "") {
      onChange(0); // 傳遞 0 作為空值
      setError("");
      return;
    }

    const num = parseInt(rawValue, 10);
    if (isNaN(num) || num < 0) {
      setError("請輸入一個有效的非負整數。");
    } else {
      onChange(num);
      setError("");
    }
  };

  const handleNext = () => {
    if (error) return;
    onNext();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 B2: 新顧客數量</CardTitle>
        <CardDescription>
          截至目前為止，我們的合作為您帶來了大約多少位新顧客？
          <br />
          <span className="text-sm text-muted-foreground">（請輸入人數，如不確定可估算大約值）</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="customerCount">新顧客人數</Label>
          <Input
            id="customerCount"
            type="number"
            min="0"
            step="1"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="例如：100"
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


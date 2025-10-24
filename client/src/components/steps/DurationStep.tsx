import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";

interface DurationStepProps extends StepProps {
  value: string;
  onChange: (value: string) => void;
}

const durations = [
  { value: "<3m", label: "不到3個月" },
  { value: "3-6m", label: "3–6個月" },
  { value: "6-12m", label: "6–12個月" },
  { value: "1y+", label: "1年以上" },
];

export function DurationStep({ value, onChange, onNext, onPrev }: DurationStepProps) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 B1: 合作時間</CardTitle>
        <CardDescription>
          您與本公司的合作時間有多久了？
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="duration">合作時間</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="請選擇合作時間" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <NavigationButtons
          onNext={onNext}
          onPrev={onPrev}
          nextText="下一步"
        />
      </CardContent>
    </Card>
  );
}


import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";

interface TitleStepProps extends StepProps {
  value: string;
  onChange: (value: string) => void;
}

const titles = [
  { value: "商家老闆", label: "商家老闆" },
  { value: "行銷主管", label: "行銷主管" },
  { value: "門市主管", label: "門市主管" },
  { value: "其他", label: "其他" },
];

export function TitleStep({ value, onChange, onNext, onPrev }: TitleStepProps) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 A4: 您的職稱</CardTitle>
        <CardDescription>
          請選擇您的職稱。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="title">職稱</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id="title">
              <SelectValue placeholder="請選擇您的職稱" />
            </SelectTrigger>
            <SelectContent>
              {titles.map((title) => (
                <SelectItem key={title.value} value={title.value}>
                  {title.label}
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


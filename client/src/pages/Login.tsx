import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "登入失敗");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "登入成功",
        description: "歡迎回來！",
      });
      setLocation("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "登入失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ParticleBackground />
      <ThemeToggle />

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="bg-card border-2 border-border rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">管理員登入</h1>
              <p className="text-muted-foreground">互動式商家合作問卷系統</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">使用者名稱</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="請輸入使用者名稱"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "登入中..." : "登入"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>預設帳號: admin</p>
              <p>預設密碼: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

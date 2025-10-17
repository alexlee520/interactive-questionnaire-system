import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed top-5 right-5 z-[1001] bg-card border-2 border-border rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label="切換深色/淺色主題"
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Sun className="w-6 h-6 text-foreground" strokeWidth={2} />
      ) : (
        <Moon className="w-6 h-6 text-foreground" strokeWidth={2} />
      )}
    </button>
  );
}

    import { Moon, Sun } from 'lucide-react';
    import { useTheme } from '@/contexts/ThemeContext';
    import { useEffect, useState } from 'react';

    const ThemeToggle = () => {
      const { theme, toggleTheme } = useTheme();
      const [mounted, setMounted] = useState(false);

      // useEffect para garantir que o componente seja montado antes de renderizar a interface do usuário dependente do tema
      useEffect(() => setMounted(true), []);

      if (!mounted) return null;

      return (
        <button
          onClick={() => toggleTheme()}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          aria-label="Alternar tema"
        >
          {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
        </button>
      );
    };

    export default ThemeToggle;
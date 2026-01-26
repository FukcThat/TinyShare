import { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('light');

  const SelectTheme = (theme) => {
    setCurrentTheme(theme);
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('tinyShareColorPrefTheme', theme);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem('tinyShareColorPrefTheme');
    if (localTheme) {
      SelectTheme(localTheme);
      return;
    }
    window
      .matchMedia(`(prefers-color-scheme: dark)`)
      .addEventListener('change', (e) =>
        SelectTheme(e.matches ? 'dark' : 'light'),
      );
    SelectTheme(
      window.matchMedia(`(prefers-color-scheme: dark)`).matches
        ? 'dark'
        : 'light',
    );

    return () => {
      (window.matchMedia(`(prefers-color-scheme: dark)`),
        removeEventListener('change', () => {}));
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, SelectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

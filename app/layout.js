'use client'; // This directive is crucial for client-side components in App Router

import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../app/globals.css'; // Global CSS for custom styles like scrollbar
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Inter } from 'next/font/google'; // Import Inter from next/font/google

// Configure the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // This ensures the font is displayed as soon as possible
  weight: ['400', '600', '700'] // Specify the weights you need
});

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from local storage or default to 'light'
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : 'light';
    return savedTheme ? savedTheme : 'light';
  });

  useEffect(() => {
    // Apply theme to the document's root HTML element for Bootstrap dark mode
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme (exported for use in page.js)
export const useTheme = () => useContext(ThemeContext);

export default function RootLayout({ children }) {
  // Load Bootstrap JavaScript client-side
  useEffect(() => {
    // Dynamically import Bootstrap JS only on the client side
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .catch(e => console.error("Error loading Bootstrap JS:", e));
  }, []);

  return (
    // Apply the Inter font to the html tag using its className
    <html lang="en" className={inter.className}>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

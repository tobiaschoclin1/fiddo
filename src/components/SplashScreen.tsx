"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center animate-pulse">
        <img
          src="/brand/fiddo_new_logo.png"
          alt="Fiddo Logo"
          className="h-32 w-auto mx-auto mb-6"
        />
        <h1 className="font-bold text-5xl mb-3">
          <span className="text-fiddo-blue">F</span>
          <span className="text-fiddo-orange">i</span>
          <span className="text-fiddo-turquoise">d</span>
          <span className="text-fiddo-blue">d</span>
          <span className="text-fiddo-orange">o</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium">Smart management</p>
      </div>
    </div>
  );
}

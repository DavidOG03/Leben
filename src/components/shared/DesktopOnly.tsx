"use client";

import React, { useEffect, useState } from "react";

const MESSAGES = [
  {
    title: "Size Absolutely Matters.",
    text: "Your screen is currently too small for this level of productivity. Leben requires at least a bit more room to breathe.",
    footer: "Go get a real computer, we'll be waiting. 😉"
  },
  {
    title: "Is this a phone for ants?",
    text: "How do you expect to build an empire on a screen the size of a chocolate bar? Switch to a desktop for the full experience.",
    footer: "We don't judge, but your productivity might. 🐜"
  },
  {
    title: "Too Much Power, Too Little Screen.",
    text: "Your device is sweating just trying to load this much potential. Give it a break and open this on your desktop.",
    footer: "Your phone just called. It's tired. 📱💤"
  },
  {
    title: "Desktop Elitism? Maybe.",
    text: "We believe in the 'One True Screen' philosophy. And that screen is significantly wider than the one you're using right now.",
    footer: "Wider is better. Ask any architect. 🏛️"
  }
];

const DesktopOnly = () => {
  const [mounted, setMounted] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    setMsgIndex(Math.floor(Math.random() * MESSAGES.length));
  }, []);

  if (!mounted) return null;

  return (
    <div className="desktop-only-overlay">
      <div className="desktop-only-content">
        <div className="desktop-only-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <h1>{MESSAGES[msgIndex].title}</h1>
        <p>{MESSAGES[msgIndex].text}</p>
        <div className="desktop-only-badge">Currently Available in Desktop View</div>
        <div className="desktop-only-footer">{MESSAGES[msgIndex].footer}</div>
      </div>
    </div>
  );
};

export default DesktopOnly;

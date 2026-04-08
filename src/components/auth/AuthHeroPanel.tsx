// AuthHeroPanel.tsx
// The left side of the split-layout auth pages.
// Accepts props so Sign In and Sign Up can show different content.

interface AuthHeroPanelProps {
  heading: string;
  subheading: string;
  features?: { label: string; description: string }[];
  badge?: string;
}

export function AuthHeroPanel({
  heading,
  subheading,
  features,
  badge,
}: AuthHeroPanelProps) {
  return (
    <div className="auth-hero">
      {/* Ambient glow behind the text */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-content">
        {badge && <span className="hero-badge">{badge}</span>}

        <h1 className="hero-heading">{heading}</h1>
        <p className="hero-subheading">{subheading}</p>

        {features && features.length > 0 && (
          <div className="hero-features">
            {features.map((f) => (
              <div key={f.label} className="hero-feature">
                <span className="feature-label">{f.label}</span>
                <p className="feature-description">{f.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

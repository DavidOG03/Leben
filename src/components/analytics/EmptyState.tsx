"use client";

interface EmptyStateProps {
  icon: string;
  message: string;
  hint: string;
}

/**
 * EmptyState renders a ghost-like placeholder when a section has no data.
 * It gives users a clear signal of what to do next rather than showing nothing.
 */
export default function EmptyState({ icon, message, hint }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-6"
      style={{ minHeight: "80px" }}
    >
      <span style={{ fontSize: "22px", opacity: 0.4 }}>{icon}</span>
      <p style={{ fontSize: "12px", color: "#444", fontWeight: 500 }}>
        {message}
      </p>
      <p
        style={{
          fontSize: "10px",
          color: "#333",
          textAlign: "center",
          maxWidth: "160px",
          lineHeight: 1.5,
        }}
      >
        {hint}
      </p>
    </div>
  );
}

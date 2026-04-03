"use client";

import { useState } from "react";
import { GoalFormData } from "@/utils/goals.types";
import { useLebenStore } from "@/store/useStore";

const ICON_OPTIONS = [
  "🌐",
  "🏃",
  "🚀",
  "💰",
  "📚",
  "🎯",
  "🧠",
  "🎨",
  "💪",
  "🌱",
];

interface AddGoalModalProps {
  onClose: () => void;
}

export default function AddGoalModal({ onClose }: AddGoalModalProps) {
  const addGoal = useLebenStore((s: any) => s.addGoal);

  const [form, setForm] = useState<GoalFormData>({
    title: "",
    deadline: "",
    icon: "🎯",
    milestones: ["", "", ""],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof GoalFormData, string>>
  >({});

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = "Goal title is required";
    if (!form.deadline.trim()) next.deadline = "Deadline is required";
    const filledMilestones = form.milestones.filter(
      (m: string) => m.trim() !== "",
    );
    if (filledMilestones.length === 0)
      next.milestones = "Add at least one milestone";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    addGoal(form);
    onClose();
  }

  function updateMilestone(index: number, value: string) {
    const updated = [...form.milestones];
    updated[index] = value;
    setForm((prev: GoalFormData) => ({ ...prev, milestones: updated }));
  }

  function addMilestoneField() {
    setForm((prev: GoalFormData) => ({
      ...prev,
      milestones: [...prev.milestones, ""],
    }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="rounded-2xl w-full max-w-md p-6 flex flex-col gap-5"
        style={{
          backgroundColor: "#111",
          border: "1px solid #1e1e1e",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="font-black text-white"
            style={{ fontSize: "20px", letterSpacing: "-0.02em" }}
          >
            New Goal
          </h2>
          <button
            onClick={onClose}
            style={{ color: "#555", fontSize: "18px", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Icon picker */}
        <div>
          <label
            style={{
              fontSize: "10px",
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Icon
          </label>
          <div className="flex gap-2 flex-wrap mt-2">
            {ICON_OPTIONS.map((icon) => (
              <button
                key={icon}
                onClick={() =>
                  setForm((prev: GoalFormData) => ({ ...prev, icon }))
                }
                className="rounded-xl flex items-center justify-center transition-all"
                style={{
                  width: "36px",
                  height: "36px",
                  fontSize: "18px",
                  border:
                    form.icon === icon
                      ? "1px solid #7c6af0"
                      : "1px solid #2a2a2a",
                  backgroundColor:
                    form.icon === icon ? "rgba(124,106,240,0.15)" : "#161616",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            style={{
              fontSize: "10px",
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Goal Title
          </label>
          <input
            value={form.title}
            onChange={(e) =>
              setForm((prev: GoalFormData) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="e.g. Master Spanish"
            className="w-full mt-2 rounded-xl px-4 py-3 text-white outline-none"
            style={{
              backgroundColor: "#161616",
              border: errors.title ? "1px solid #e05c5c" : "1px solid #2a2a2a",
              fontSize: "14px",
            }}
          />
          {errors.title && (
            <p style={{ fontSize: "11px", color: "#e05c5c", marginTop: "4px" }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label
            style={{
              fontSize: "10px",
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Deadline
          </label>
          <input
            type="month"
            value={form.deadline}
            onChange={(e) =>
              setForm((prev: GoalFormData) => ({
                ...prev,
                deadline: e.target.value,
              }))
            }
            className="w-full mt-2 rounded-xl px-4 py-3 text-white outline-none"
            style={{
              backgroundColor: "#161616",
              border: errors.deadline
                ? "1px solid #e05c5c"
                : "1px solid #2a2a2a",
              fontSize: "14px",
              colorScheme: "dark",
            }}
          />
          {errors.deadline && (
            <p style={{ fontSize: "11px", color: "#e05c5c", marginTop: "4px" }}>
              {errors.deadline}
            </p>
          )}
        </div>

        {/* Milestones */}
        <div>
          <label
            style={{
              fontSize: "10px",
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Milestones
          </label>
          <div className="flex flex-col gap-2 mt-2">
            {form.milestones.map((m: string, i: number) => (
              <input
                key={i}
                value={m}
                onChange={(e) => updateMilestone(i, e.target.value)}
                placeholder={`Milestone ${i + 1}`}
                className="w-full rounded-xl px-4 py-3 text-white outline-none"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #2a2a2a",
                  fontSize: "13px",
                }}
              />
            ))}
          </div>
          {errors.milestones && (
            <p style={{ fontSize: "11px", color: "#e05c5c", marginTop: "4px" }}>
              {errors.milestones}
            </p>
          )}
          <button
            onClick={addMilestoneField}
            className="mt-2"
            style={{ fontSize: "12px", color: "#7c6af0" }}
          >
            + Add milestone
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold"
            style={{
              backgroundColor: "#161616",
              border: "1px solid #2a2a2a",
              color: "#888",
              fontSize: "13px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#f0f0f0",
              color: "#0a0a0a",
              fontSize: "13px",
            }}
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}

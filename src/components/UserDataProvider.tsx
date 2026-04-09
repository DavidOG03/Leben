"use client";

import { useLoadUserData } from "@/hooks/useLoadUserData";

export default function UserDataProvider() {
  useLoadUserData();
  return null;
}

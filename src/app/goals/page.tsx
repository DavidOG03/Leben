import { redirect } from "next/navigation";

export default function GoalsPage() {
  redirect("/trackers?tab=goals");
}

import type { Metadata } from "next";
import "./globals.css";
import UserDataProvider from "@/components/UserDataProvider";

export const metadata: Metadata = {
  title: "Leben",
  description: "Your personal operating system",
};

import NotificationManager from "@/components/shared/NotificationManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <UserDataProvider />
        <NotificationManager />
        {children}
      </body>
    </html>
  );
}

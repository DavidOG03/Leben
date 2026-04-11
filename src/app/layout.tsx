import type { Metadata } from "next";
import "./globals.css";
import UserDataProvider from "@/components/UserDataProvider";
import DesktopOnly from "@/components/shared/DesktopOnly";

export const metadata: Metadata = {
  title: "Leben",
  description: "Your personal operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DesktopOnly />
        <UserDataProvider />
        {children}
      </body>
    </html>
  );
}

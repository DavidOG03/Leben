import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import UserDataProvider from "@/components/UserDataProvider";
import NotificationManager from "@/components/shared/NotificationManager";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700", "800"],
});

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
      <body className={`${dmSans.className} antialiased`}>
        <UserDataProvider />
        <NotificationManager />
        {children}
      </body>
    </html>
  );
}

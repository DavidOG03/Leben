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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const originalError = console.error;
              console.error = (...args) => {
                if (args[0]?.message?.includes('The play() request was interrupted') || 
                    (typeof args[0] === 'string' && args[0].includes('The play() request was interrupted'))) {
                  return;
                }
                originalError.apply(console, args);
              };
              window.addEventListener('unhandledrejection', (event) => {
                if (event.reason?.name === 'AbortError' && event.reason?.message?.includes('play()')) {
                  event.preventDefault();
                }
              });
            `,
          }}
        />
        <UserDataProvider />
        <NotificationManager />
        {children}
      </body>
    </html>
  );
}

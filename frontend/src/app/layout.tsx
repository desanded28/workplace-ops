import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ToastProvider } from "@/components/Toast";
// import { Background } from "@/components/Background";
// import { FloatingCans } from "@/components/FloatingCans";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workplace Ops Dashboard",
  description: "Jira Cloud migration tracker, automation rules, and integration status",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ToastProvider>
          {/* <Background /> */}
          {/* <FloatingCans /> */}
          <div className="relative z-10 flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-[220px] px-8 py-7 overflow-auto min-h-screen">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}

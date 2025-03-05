import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper"; // Updated import

export const metadata: Metadata = {
  title: "EchoChat",
  description: "AI Chatbot with EchoGPT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import UiProvider from "@/context/UiProvider";

export const metadata: Metadata = {
  title: "InquireAI",
  description: "AI Chatbot with InquireAI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex">
        <UiProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </UiProvider>
      </body>
    </html>
  );
}
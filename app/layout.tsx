import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Import the font
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import UiProvider from "@/context/UiProvider";

// Load the Outfit font
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "InquireAI",
  description: "AI Chatbot with InquireAI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex ${outfit.className}`}>
        <UiProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </UiProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Türkçe / Vocabulary Logger", description: "Minimal Turkish vocabulary logger" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

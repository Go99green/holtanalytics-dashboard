import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holt Analytics | Gulls Commercial Intelligence FY27",
  description:
    "Executive decision dashboard for San Diego Gulls commercial performance: scenario planning, operating leverage, conversion friction, and FY27 revenue strategy.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

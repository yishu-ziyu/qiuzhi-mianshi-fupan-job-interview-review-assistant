import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "求职面试复盘助手 | Job Interview Review Assistant",
  description: "中文优先的面试复盘与面试前准备系统（Chinese-first interview review and prep system）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}

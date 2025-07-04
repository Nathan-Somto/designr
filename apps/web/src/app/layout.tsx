import type { Metadata } from "next";
import localFont from "next/font/local";
import '@designr/ui/globals.css';
import { Toaster } from "#/components/toaster";
const DMSans = localFont({
  src: [
    { path: "./fonts/DMSans-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/DMSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/DMSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/DMSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/DMSans-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-DMsans",
});

export const metadata: Metadata = {
  title: "Designr | Unleash your Inner Designer",
  description: "Designr is a graphic design tool that helps you unleash your inner designer through the help of our next-gen ai features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel='icon'
        href="/logo.svg"
        type='image/svg+xml'
        sizes="any"
      />
      <body className={`${DMSans.variable} font-DMsans !pointer-events-auto !overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

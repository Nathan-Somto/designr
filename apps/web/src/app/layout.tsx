import type { Metadata } from "next";
import localFont from "next/font/local";
import '@designr/ui/globals.css';
const merienda = localFont({
  src: [
    { path: "./fonts/Merienda-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Merienda-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Merienda-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Merienda-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Merienda-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-merienda",
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
      <body className={`${merienda.variable} font-merienda !pointer-events-auto`}
      >
        {children}
      </body>
    </html>
  );
}

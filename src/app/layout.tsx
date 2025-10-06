import type { Metadata } from "next";
import { Roboto  } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ScoreProvider } from "./contexts/ScoreContext";

const roboto = Roboto ({
  weight: ['400', '700'], 
  subsets: ['latin'], 
  display: 'swap', 
  variable: '--font-roboto', 
});

 

export const metadata: Metadata = {
  title: "Asking Bee",
  description: "AI-powered question generator and answer reviewer by Ivan Alcuino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className}   antialiased`}
      >
        <ScoreProvider>
          <Navbar />
          {children}
        </ScoreProvider>
      </body>
    </html>
  );
}

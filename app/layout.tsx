import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/layout/PageTransition";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebnD Merch Store",
  description: "For buying WebnD merch",
  icons:{
    icon:'/logo.png'
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
          <PageTransition>
            <Toaster/>
          {children}


        {/* <Footer /> */}
        </PageTransition>

        </body>
    </html>
  );
}

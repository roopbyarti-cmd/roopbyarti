declare global {
  interface Window {
    dataLayer: any[];
  }
}

import Header from "@/components/Header";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Script from "next/script";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <title>Roop By Arti</title>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-P1K1CRL4CF" />
        <Script id="gtag-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-P1K1CRL4CF');`}
        </Script>
      </head>
      <body>
        <Header />   {/* 🔥 ADD THIS */}
        {children}
        {/* 🔥 Toast Container */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "#111",
              color: "#fff",
            },
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
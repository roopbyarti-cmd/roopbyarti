import Header from "@/components/Header";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
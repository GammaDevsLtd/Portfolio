import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // our CSS variable for later use
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Gammadevs Technologies Limited",
  description: "We are a technology company engaged in the design, development, deployment, and maintenance of digital solutions, including websites, mobile and desktop applications, and interactive games. We provide product design, UI/UX, branding, and technology consultancy services, as well as mentorship and training programs aimed at empowering the next generation of digital creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${raleway.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}

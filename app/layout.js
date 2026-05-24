import { Inter } from "next/font/google";
import "./globals.css";
import "material-symbols/rounded.css";
import { ToastProvider } from "@/_contexts/toastContext";
import { Toaster } from "@/_components/toaster/toaster";
import { ModalProvider } from "@/_contexts/modalContext";
import  ModalRoot  from "@/_components/modals/modalRoot/modalRoot";
import { AuthProvider } from "@/_contexts/authContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Serfi IA — Asistente financiero inteligente",
  description: "Tu asistente inteligente de Serfinanzas para presupuestos, ahorro, créditos e inversiones.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}` }>
      <body>
        <AuthProvider>
          <ModalProvider>
            <ToastProvider>
              <Toaster position="top-right"/>
              <ModalRoot/>
              {children}
            </ToastProvider>
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

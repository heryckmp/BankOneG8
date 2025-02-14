import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter relative" suppressHydrationWarning>
      <div className="absolute inset-0 main-gradient" />
      <div className="relative z-10 flex w-full">
        <div className="auth-asset group">
          <div className="w-full h-full relative">
            <div className="auth-gradient-overlay" />
            <div className="auth-ben-image" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center">
              <h2 className="plaid-heading text-4xl mb-6 transition-colors duration-500 group-hover:text-white">
                Bem-vindo ao OneG8
              </h2>
              <p className="text-gray-600 transition-colors duration-500 text-lg max-w-md group-hover:text-gray-300">
                Sua solução bancária moderna para uma gestão financeira simplificada e transações seguras.
              </p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

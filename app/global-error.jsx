"use client";

import Error from "next/error";

export default function GlobalError({ error }) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h1>
          <p className="text-gray-600 mb-4">Pedimos desculpas pelo inconveniente. Por favor, tente novamente mais tarde.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}

import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-base-200 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-base-100 p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center space-y-6 border border-base-200">
        <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-base-content">
          ¡Compra Exitosa!
        </h1>
        
        <p className="text-lg text-base-content/80">
          Tu boleto ha sido confirmado y registrado exitosamente. Hemos validado tu identidad y tu asiento está asegurado.
        </p>
        
        <div className="pt-6">
          <Link href="/" className="btn btn-primary w-full text-lg h-auto py-3">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import CheckoutForm from "./_components/CheckoutForm";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string | undefined;

  if (!token) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-primary drop-shadow-md">
            Confirmación de Compra
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Por favor, valida tu identidad antes de que expire el tiempo de reserva de tu asiento.
          </p>
        </div>

        <section className="relative z-10 w-full flex justify-center">
          <CheckoutForm token={token} />
        </section>
      </div>
    </main>
  );
}

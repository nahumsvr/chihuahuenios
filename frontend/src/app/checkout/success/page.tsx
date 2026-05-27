import CheckoutSuccessClient from "./_components/CheckoutSuccessClient";

export const metadata = {
  title: "Compra Exitosa — Chihuahueños",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-base-200 py-20 px-4 flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-base-100 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-base-200">
        <CheckoutSuccessClient />
      </div>
    </main>
  );
}

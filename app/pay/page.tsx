import PayCheckout from "./pay-checkout";

export default async function PayPage({ searchParams }: { searchParams: Promise<{ slug?: string; outcome?: string }> }) {
  const { slug = "", outcome } = await searchParams;
  return <PayCheckout key={slug} slug={slug} outcome={outcome} />;
}

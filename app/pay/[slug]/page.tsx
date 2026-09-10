import PayCheckout from "../pay-checkout";

export default async function PayPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ outcome?: string }>;
}) {
  const { slug } = await params;
  const { outcome } = await searchParams;
  return <PayCheckout key={slug} slug={slug} outcome={outcome} />;
}

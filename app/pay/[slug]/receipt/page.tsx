import PayCheckout from "../../pay-checkout";

export default async function ReceiptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PayCheckout key={slug} slug={slug} receipt />;
}

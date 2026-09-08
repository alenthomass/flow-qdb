export const metadata = {
  title: "Flow · Business dashboard",
  description: "Payments and finance dashboard for Qatar businesses"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, height: "100%", background: "#F2F2F5" }}>{children}</body>
    </html>
  );
}

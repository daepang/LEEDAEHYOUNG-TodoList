export const metadata = {
  title: "LEEDAEHYOUNG-TodoList",
  description: "Local markdown-based LEEDAEHYOUNG-TodoList",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

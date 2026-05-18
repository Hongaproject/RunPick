import { Footer } from "@/components/common/Footer";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

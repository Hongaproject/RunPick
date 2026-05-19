import { Footer } from "@/components/common/Footer";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-auto">
      {children} <Footer />
    </div>
  );
}

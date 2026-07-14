import { CursorProvider } from "@/components/marketing/cursor-tracker";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <CursorProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CursorProvider>
  );
}

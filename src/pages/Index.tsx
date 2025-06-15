
import ShippingOrderForm from "@/components/ShippingOrderForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="w-full flex flex-col items-center py-10 mb-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">PostRepublic</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl text-center">
          Simple, reliable international shipping—powered by PostRepublic using DHL rates. Get your estimated price instantly.
        </p>
      </header>

      {/* Main form */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-2xl px-3 md:px-0">
          <ShippingOrderForm />
        </div>
      </main>

      {/* WhatsApp floating button */}
      <WhatsAppButton />

      {/* Footer Contact */}
      <footer className="w-full mt-16 pb-10">
        <ContactSection />
        <div className="text-xs text-center text-muted-foreground pt-6">© {new Date().getFullYear()} PostRepublic. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Index;

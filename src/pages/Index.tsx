
import React, { useState } from "react";
import ShippingOrderForm from "@/components/ShippingOrderForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactSection from "@/components/ContactSection";
import AuthForm from "@/components/AuthForm";
import UserNav from "@/components/UserNav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, LogIn } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors">
      {/* Header with Navigation */}
      <header className="w-full border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">PostRepublic</h1>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Search size={16} />
                <span className="hidden sm:inline">Track Shipment</span>
              </Button>
              
              {user ? (
                <UserNav user={user} onSignOut={() => {}} />
              ) : (
                <>
                  <Dialog open={showAuth} onOpenChange={setShowAuth}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <LogIn size={16} />
                        <span className="hidden sm:inline">Login</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <AuthForm onSuccess={() => setShowAuth(false)} />
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <span>Register</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full flex flex-col items-center py-16 mb-8">
        <div className="w-full max-w-6xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Simple, reliable international shipping
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by PostRepublic using DHL rates. Get your estimated price instantly.
          </p>
        </div>
      </section>

      {/* Main form */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-2xl px-3 md:px-0">
          <ShippingOrderForm 
            user={user} 
            onAuthRequired={() => setShowAuth(true)} 
          />
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

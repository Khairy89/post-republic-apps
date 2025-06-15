
import React, { useState } from "react";
import ShippingOrderForm from "@/components/ShippingOrderForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactSection from "@/components/ContactSection";
import AuthForm from "@/components/AuthForm";
import UserNav from "@/components/UserNav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
      {/* Header */}
      <header className="w-full flex flex-col items-center py-10 mb-2">
        <div className="w-full max-w-6xl px-4 flex justify-between items-start mb-6">
          <div></div>
          <div className="flex-1 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">PostRepublic</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Simple, reliable international shipping—powered by PostRepublic using DHL rates. Get your estimated price instantly.
            </p>
          </div>
          {/* removed UserNav/Auth button from here */}
          <div />
        </div>
      </header>

      {/* Main form - Always show to everyone */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-2xl px-3 md:px-0">
          <ShippingOrderForm 
            user={user} 
            onAuthRequired={() => setShowAuth(true)} 
          />
        </div>
      </main>

      {/* UserNav/Auth - now moved below main, before footer */}
      <div className="w-full flex justify-center mb-4">
        {user ? (
          <UserNav user={user} onSignOut={() => {}} />
        ) : (
          <Dialog open={showAuth} onOpenChange={setShowAuth}>
            <DialogTrigger asChild>
              <Button variant="outline">Sign In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <AuthForm onSuccess={() => setShowAuth(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

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

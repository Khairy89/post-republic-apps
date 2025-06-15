
import React from "react";
import { Mail, Phone } from "lucide-react";

const ContactSection: React.FC = () => (
  <section className="max-w-2xl mx-auto mt-16 bg-card/70 rounded-xl px-6 py-8 shadow mb-8 flex flex-col gap-2 items-center">
    <h3 className="text-xl font-bold mb-2">Contact Us</h3>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-base text-muted-foreground">
      <div className="flex items-center gap-2">
        <Phone size={20} />
        <a href="tel:+60123456789" className="hover:underline">+60 12-345-6789</a>
      </div>
      <div className="flex items-center gap-2">
        <Mail size={20} />
        <a href="mailto:hello@postrepublic.com" className="hover:underline">hello@postrepublic.com</a>
      </div>
    </div>
  </section>
);

export default ContactSection;

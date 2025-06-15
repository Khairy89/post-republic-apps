
import React from "react";
import { MessageCircle } from "lucide-react";

const ContactSection: React.FC = () => (
  <section className="max-w-2xl mx-auto mt-16 bg-card/70 rounded-xl px-6 py-8 shadow mb-8 flex flex-col gap-2 items-center">
    <h3 className="text-xl font-bold mb-2">Contact Us</h3>
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-base text-muted-foreground">
      <a
        href="https://wa.me/60148478701?text=RepublicPostQuery"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <MessageCircle size={20} />
        <span>WhatsApp us</span>
      </a>
    </div>
  </section>
);

export default ContactSection;


import React from "react";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "60148478701";

const WhatsAppButton: React.FC = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=RepublicPostQuery`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed z-50 bottom-6 right-6 md:bottom-10 md:right-10 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-3 flex items-center gap-2 group transition-all"
    aria-label="Chat on WhatsApp"
    title="Chat on WhatsApp"
  >
    <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
    <span className="hidden md:inline text-lg font-bold pr-2">WhatsApp</span>
  </a>
);

export default WhatsAppButton;

import React from "react";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { company } from "@/data/company";
const Whatsapp = () => {
    const contact = company.whatsapp;

    if (!contact) return null;
    
  return (
    <Link
      href={`https://wa.me/${contact}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50"
    >
      <div className="absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white shadow-xl transition-all duration-300 group-hover:block">
        Chat with us
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_18px_50px_rgba(37,211,102,0.6)] active:scale-95">
        <MessageCircle className="h-6 w-6" />
      </div>

      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/30"></span>
    </Link>
  );
};

export default Whatsapp;
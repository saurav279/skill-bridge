import type { Metadata } from "next";
import { ContactsView } from "@/components/admin/contact-views";

export const metadata: Metadata = {
  title: "Contact inbox",
};

export default function AdminContactsPage() {
  return <ContactsView />;
}

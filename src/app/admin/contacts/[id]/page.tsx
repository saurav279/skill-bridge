import type { Metadata } from "next";
import { ContactDetailView } from "@/components/admin/contact-views";

export const metadata: Metadata = {
  title: "Message",
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminContactDetailPage({ params }: Props) {
  const { id } = await params;
  return <ContactDetailView id={id} />;
}

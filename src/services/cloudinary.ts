import { getApiBaseUrl } from "@/services/fetchApi";

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  

try {
  // throw new Error("test");
    const res = await fetch(`${getApiBaseUrl()}/cloudinary/upload`, {
      method: "POST",
      body: formData,
      // do not set Content-Type — browser sets multipart boundary
    });
  
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(err?.error ?? "Upload failed");
    }
  
    const data = (await res.json()) as { secureUrl: string };
    return data.secureUrl;
} catch (error) {

  throw error;
}
}

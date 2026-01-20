
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request AI melebihi batas waktu")), timeoutMs)
    ),
  ]);
};

export const summarizeDocument = async (title: string, content: string) => {
  try {
    const response: GenerateContentResponse = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Buatkan ringkasan sangat singkat (maksimal 20 kata) untuk dokumen berjudul "${title}" dengan konten berikut: ${content}. Gunakan Bahasa Indonesia yang formal.`,
      }),
      15000
    );
    return response.text || "Ringkasan tidak tersedia.";
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "AI sedang sibuk, ringkasan akan diperbarui nanti.";
  }
};

export const analyzeScannedDocument = async (base64Image: string) => {
  try {
    const response: GenerateContentResponse = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
            { text: "Analisis gambar dokumen ini. Berikan output dalam format JSON dengan kunci: title (judul yang cocok), summary (ringkasan 15 kata), category (satu kata kategori yang cocok). Jawab HANYA JSON." }
          ]
        },
      }),
      20000
    );
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
};

export const chatWithArchives = async (query: string, archiveData: string, focusedDoc?: string) => {
  try {
    const context = focusedDoc 
      ? `Anda sedang berdiskusi KHUSUS tentang dokumen ini: ${focusedDoc}. Abaikan dokumen lain kecuali relevan.`
      : `Gunakan data arsip berikut untuk menjawab: ${archiveData}`;

    const response: GenerateContentResponse = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
        Anda adalah asisten arsip cerdas untuk "ArsipDigital Pro". 
        ${context}
        
        Pertanyaan Pengguna:
        ${query}
        `,
      }),
      25000
    );
    return response.text || "Maaf, saya tidak menemukan jawaban yang relevan.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Terjadi kendala koneksi dengan otak AI kami.";
  }
};

export const suggestCategory = async (title: string, description: string, availableCategories: string[]) => {
  try {
    const categoriesString = availableCategories.join(', ');
    const response: GenerateContentResponse = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dari daftar kategori berikut: [${categoriesString}], pilih satu yang paling sesuai.
        Judul: "${title}"
        Deskripsi: "${description}"
        Berikan HANYA nama kategorinya saja.`,
      }),
      10000
    );
    const suggested = response.text?.trim() || "Umum";
    return availableCategories.find(v => suggested.toLowerCase() === v.toLowerCase()) || availableCategories[0] || "Umum";
  } catch (error) {
    return availableCategories[0] || "Umum";
  }
};

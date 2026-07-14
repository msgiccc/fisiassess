const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export interface EvaluationResult {
  skor: number;
  feedback: string;
}

export async function evaluateAnswer(
  soal: string,
  kunci: string,
  jawaban: string,
  representasi: string
): Promise<EvaluationResult> {
  const prompt = `Kamu adalah asisten penilai esai fisika yang sangat teliti. 
Evaluasi jawaban siswa untuk **Representasi ${representasi}**.

SOAL: ${soal}
KUNCI JAWABAN (REFERENSI): ${kunci}
JAWABAN SISWA: ${jawaban}

Berikan skor antara 0-100 berdasarkan seberapa tepat dan lengkap jawaban siswa dibandingkan dengan kunci jawaban. 
Sertakan feedback (saran peningkatan) singkat dalam Bahasa Indonesia yang membangun.
OUTPUT HARUS HANYA BERUPA JSON VALID TANPA FORMATTING MARKDOWN. Format:
{"skor": number, "feedback": "string"}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Menggunakan Gemini 2.5 Flash karena performa tinggi, pintar, dan rate limit panjang
        model: "google/gemini-2.5-flash", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Suhu rendah agar penilaian konsisten
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Bersihkan dari formatting markdown ```json ... ``` jika ada
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(content);
    return {
      skor: typeof result.skor === 'number' ? result.skor : 0,
      feedback: result.feedback || 'Tidak ada feedback.',
    };
  } catch (error) {
    console.error(`Gagal mengevaluasi representasi ${representasi}:`, error);
    return {
      skor: 0,
      feedback: "Maaf, terjadi kesalahan saat AI mengevaluasi jawaban ini. Silakan coba lagi.",
    };
  }
}

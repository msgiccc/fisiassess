import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ArrowLeft, Upload, Play, CheckCircle, FileSpreadsheet, Download, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface ExcelDataRow {
  'Nama Siswa': string;
  'Verbal': string;
  'Matematik': string;
  'Grafik': string;
  'Visual': string;
}

export default function BulkEvaluasi() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [soal, setSoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [excelData, setExcelData] = useState<ExcelDataRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

  // State untuk Modal Feedback
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  useEffect(() => {
    if (id) fetchSoal();
  }, [id]);

  const fetchSoal = async () => {
    const { data, error } = await supabase
      .from('assessment_soal')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Gagal mengambil detail soal');
    } else {
      setSoal(data);
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as ExcelDataRow[];
        
        if (data.length > 0 && data[0]['Nama Siswa'] !== undefined) {
          setExcelData(data);
          toast.success(`Berhasil membaca ${data.length} baris data.`);
        } else {
          toast.error('Format Excel tidak sesuai. Pastikan ada kolom: Nama Siswa, Verbal, Matematik, Grafik, Visual.');
        }
      } catch (err) {
        toast.error('Gagal memproses file Excel.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Nama Siswa': 'Andi',
        'Verbal': 'Energi kinetik adalah...',
        'Matematik': 'Ek = 1/2 m v^2',
        'Grafik': 'Grafik parabola terbuka ke atas',
        'Visual': 'Gambar bola menggelinding menuruni bidang miring'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Template_Evaluasi_FisGrade.xlsx");
  };

  const startBulkEvaluation = async () => {
    if (excelData.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setResults([]);

    let currentResults = [];

    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      
      try {
        const prompt = `Kamu adalah asisten penilai esai fisika. 
Evaluasi 4 representasi jawaban siswa berikut berdasarkan kunci jawaban.
Berikan skor (0-100) dan feedback singkat yang membangun untuk masing-masing representasi.
OUTPUT HARUS HANYA BERUPA JSON VALID TANPA MARKDOWN.

SOAL: ${soal.soal_text}

[VERBAL]
Kunci: ${soal.kunci_verbal}
Jawaban: ${row['Verbal'] || ''}

[MATEMATIK]
Kunci: ${soal.kunci_matematik}
Jawaban: ${row['Matematik'] || ''}

[GRAFIK]
Kunci: ${soal.kunci_grafik}
Jawaban: ${row['Grafik'] || ''}

[VISUAL]
Kunci: ${soal.kunci_visual}
Jawaban: ${row['Visual'] || ''}

Format Output:
{"verbal":{"skor":number,"feedback":"..."},"matematik":{"skor":number,"feedback":"..."},"grafik":{"skor":number,"feedback":"..."},"visual":{"skor":number,"feedback":"..."}}`;

        let response;
        let retries = 3;
        let delayMs = 2000;
        
        while (retries > 0) {
          response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "meta-llama/llama-3.3-70b-instruct:free", 
              messages: [{ role: "user", content: prompt }],
              temperature: 0.1,
            }),
          });

          if (response.ok) break;

          if (response.status === 429) {
            const errText = await response.text();
            let waitTime = delayMs;
            try {
              const errJson = JSON.parse(errText);
              if (errJson.error?.metadata?.retry_after_seconds) {
                waitTime = (errJson.error.metadata.retry_after_seconds + 1) * 1000;
              }
            } catch (e) {}
            
            console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
            await new Promise(r => setTimeout(r, waitTime));
            retries--;
            delayMs *= 2; // Exponential backoff
          } else {
            const errText = await response.text();
            throw new Error(`API HTTP ${response.status}: ${errText}`);
          }
        }

        if (!response || !response.ok) {
          throw new Error(`API Limit / Timeout setelah beberapa kali percobaan.`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content.trim();
        
        // Ekstrak JSON menggunakan regex untuk menghindari teks tambahan dari AI
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error(`Invalid AI Output: ${content.substring(0, 50)}...`);
        }
        
        const evalResult = JSON.parse(jsonMatch[0]);

        const totalSkor = Math.round(((evalResult.verbal?.skor || 0) + (evalResult.matematik?.skor || 0) + (evalResult.grafik?.skor || 0) + (evalResult.visual?.skor || 0)) / 4);

        // Siapkan feedback JSON string, disisipkan nama dari Excel agar DetailSoalGuru bisa membacanya
        const feedbackString = JSON.stringify({
          nama_excel: row['Nama Siswa'],
          verbal: evalResult.verbal?.feedback || '-',
          matematik: evalResult.matematik?.feedback || '-',
          grafik: evalResult.grafik?.feedback || '-',
          visual: evalResult.visual?.feedback || '-',
        });

        // Simpan ke tabel yang BENAR: assessment_jawaban
        await supabase.from('assessment_jawaban').insert([{
          soal_id: id,
          siswa_id: user?.id, // Sementara menggunakan ID guru yang mengunggah
          jawaban_verbal: row['Verbal'] || '',
          jawaban_matematik: row['Matematik'] || '',
          jawaban_grafik: row['Grafik'] || '',
          jawaban_visual: row['Visual'] || '',
          skor_verbal: evalResult.verbal?.skor || 0,
          skor_matematik: evalResult.matematik?.skor || 0,
          skor_grafik: evalResult.grafik?.skor || 0,
          skor_visual: evalResult.visual?.skor || 0,
          feedback: feedbackString
        }]);

        currentResults.push({
          nama: row['Nama Siswa'],
          skor_verbal: evalResult.verbal?.skor || 0,
          skor_matematik: evalResult.matematik?.skor || 0,
          skor_grafik: evalResult.grafik?.skor || 0,
          skor_visual: evalResult.visual?.skor || 0,
          skor_total: totalSkor,
          feedback: {
            verbal: evalResult.verbal?.feedback || '-',
            matematik: evalResult.matematik?.feedback || '-',
            grafik: evalResult.grafik?.feedback || '-',
            visual: evalResult.visual?.feedback || '-',
          },
          status: 'Sukses'
        });

        // Beri jeda kecil antar siswa agar tidak hit rate limit (1 detik)
        await new Promise(r => setTimeout(r, 1500));

      } catch (err: any) {
        console.error("Bulk Eval Error:", err);
        currentResults.push({
          nama: row['Nama Siswa'],
          skor_verbal: 0, skor_matematik: 0, skor_grafik: 0, skor_visual: 0, skor_total: 0,
          feedback: null,
          status: `Gagal: ${err.message?.substring(0, 40) || 'Unknown'}`
        });
      }

      setResults([...currentResults]);
      setProgress(Math.round(((i + 1) / excelData.length) * 100));
    }

    setIsProcessing(false);
    toast.success('Evaluasi massal selesai!');
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-full">Memuat...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <Link to={`/soal/${id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Detail Soal
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Evaluasi Massal (Mode Excel)</h1>
          <p className="text-slate-500">
            Unggah file Excel berisi data esai siswa untuk soal: <span className="font-semibold text-slate-800">{soal?.judul}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <FileSpreadsheet className="w-6 h-6" />
              <h2 className="text-xl font-bold">1. Persiapkan Data Excel</h2>
            </div>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Pastikan tabel Excel Anda memiliki susunan kolom persis seperti berikut (perhatikan kapitalisasinya):
              <br/><br/>
              <b>Nama Siswa | Verbal | Matematik | Grafik | Visual</b>
            </p>
            <button 
              onClick={downloadTemplate}
              className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors gap-2"
            >
              <Download className="w-4 h-4" />
              Unduh Template
            </button>
          </div>

          <div className="card p-8 bg-primary/5 border-primary/20 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-primary-pale rounded-full flex items-center justify-center text-primary mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">2. Unggah File Disini</h2>
            <p className="text-slate-500 text-sm mb-6">Mendukung file .xlsx dan .xls</p>
            
            <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
              <span>Pilih File Excel</span>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>

        {excelData.length > 0 && (
          <div className="card p-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Hasil Analisis & Pratinjau ({excelData.length} Baris)
              </h2>
              
              {!isProcessing && progress === 0 && (
                <button 
                  onClick={startBulkEvaluation}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Mulai Penilaian Otomatis
                </button>
              )}
            </div>

            {(isProcessing || progress > 0) && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between text-sm font-semibold mb-2 text-slate-700">
                  <span>Progres Penilaian</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="p-4 w-10">No</th>
                    <th className="p-4">Nama Siswa</th>
                    <th className="p-4 text-center">Verbal</th>
                    <th className="p-4 text-center">Matematik</th>
                    <th className="p-4 text-center">Grafik</th>
                    <th className="p-4 text-center">Visual</th>
                    <th className="p-4 text-center border-l border-slate-200">Total</th>
                    <th className="p-4 text-center">Saran AI</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {excelData.map((row, index) => {
                    const res = results[index];
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-400">{index + 1}</td>
                        <td className="p-4 font-medium text-slate-800">{row['Nama Siswa']}</td>
                        <td className="p-4 text-center">{res ? <span className="font-semibold text-slate-700">{res.skor_verbal}</span> : '-'}</td>
                        <td className="p-4 text-center">{res ? <span className="font-semibold text-slate-700">{res.skor_matematik}</span> : '-'}</td>
                        <td className="p-4 text-center">{res ? <span className="font-semibold text-slate-700">{res.skor_grafik}</span> : '-'}</td>
                        <td className="p-4 text-center">{res ? <span className="font-semibold text-slate-700">{res.skor_visual}</span> : '-'}</td>
                        <td className="p-4 text-center border-l border-slate-100">
                          {res ? (
                            <span className="font-bold text-primary text-base">{res.skor_total}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {res && res.feedback ? (
                            <button 
                              onClick={() => setSelectedFeedback({ nama: row['Nama Siswa'], ...res.feedback })}
                              className="text-primary hover:text-primary-light flex items-center justify-center w-full gap-1 font-medium"
                            >
                              <Search className="w-4 h-4" /> Detail
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {res ? (
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${res.status === 'Sukses' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {res.status}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Menunggu</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Modal Feedback */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800">Detail Evaluasi: {selectedFeedback.nama}</h3>
                <button 
                  onClick={() => setSelectedFeedback(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                <div>
                  <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span>Verbal</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedFeedback.verbal}</p>
                </div>
                <div>
                  <h4 className="font-bold text-amber-500 mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Matematik</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedFeedback.matematik}</p>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-500 mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Grafik</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedFeedback.grafik}</p>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-500 mb-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Visual / Fisik</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedFeedback.visual}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

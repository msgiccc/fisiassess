import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { ArrowLeft, Upload, Play, CheckCircle, FileSpreadsheet, Download, Search, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface ExcelDataRow {
  'Nama Siswa': string;
  'Verbal'?: string;
  'Matematik'?: string;
  'Grafik'?: string;
  'Visual'?: string;
}

export default function BulkEvaluasi() {
  const { id } = useParams<{ id: string }>();
  const [soal, setSoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [excelData, setExcelData] = useState<ExcelDataRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);

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

  const hasVerbal = !!soal?.kunci_verbal;
  const hasMatematik = !!soal?.kunci_matematik;
  const hasGrafik = !!soal?.kunci_grafik;
  const hasVisual = !!soal?.kunci_visual;
  const activeCount = [hasVerbal, hasMatematik, hasGrafik, hasVisual].filter(Boolean).length || 1;

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
        
        if (data.length > 0) {
          let isValid = data[0]['Nama Siswa'] !== undefined;
          if (hasVerbal && data[0]['Verbal'] === undefined) isValid = false;
          if (hasMatematik && data[0]['Matematik'] === undefined) isValid = false;
          if (hasGrafik && data[0]['Grafik'] === undefined) isValid = false;
          if (hasVisual && data[0]['Visual'] === undefined) isValid = false;

          if (isValid) {
            setExcelData(data);
            toast.success(`Berhasil membaca ${data.length} baris data.`);
          } else {
            toast.error('Format Excel tidak sesuai dengan representasi aktif. Pastikan kolom sesuai.');
          }
        } else {
          toast.error('File Excel kosong.');
        }
      } catch (err) {
        toast.error('Gagal memproses file Excel.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    let templateRow: any = { 'Nama Siswa': 'Andi' };
    if (hasVerbal) templateRow['Verbal'] = 'Energi kinetik adalah...';
    if (hasMatematik) templateRow['Matematik'] = 'Ek = 1/2 m v^2';
    if (hasGrafik) templateRow['Grafik'] = 'Grafik parabola...';
    if (hasVisual) templateRow['Visual'] = 'Gambar bola...';

    const ws = XLSX.utils.json_to_sheet([templateRow]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `Template_${activeCount}_Representasi.xlsx`);
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      toast.error('Belum ada hasil evaluasi untuk diekspor');
      return;
    }
    
    const exportData = results.map(res => {
      const row: any = { 'Nama Siswa': res.nama };
      if (hasVerbal) { row['Skor Verbal'] = res.skor_verbal; row['Feedback Verbal'] = res.feedback?.verbal; }
      if (hasMatematik) { row['Skor Matematik'] = res.skor_matematik; row['Feedback Matematik'] = res.feedback?.matematik; }
      if (hasGrafik) { row['Skor Grafik'] = res.skor_grafik; row['Feedback Grafik'] = res.feedback?.grafik; }
      if (hasVisual) { row['Skor Visual'] = res.skor_visual; row['Feedback Visual'] = res.feedback?.visual; }
      row['Skor Total'] = res.skor_total;
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil Evaluasi");
    XLSX.writeFile(wb, `Hasil_Evaluasi_${soal?.judul || 'FisGrade'}.xlsx`);
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
        let prompt = `Kamu adalah asisten penilai esai fisika.
Evaluasi ${activeCount} representasi jawaban siswa berikut berdasarkan kunci jawaban bertingkat.
Berikan skor (0-100) dan feedback singkat yang membangun untuk masing-masing representasi.
PENTING: Meskipun rubrik mencantumkan kriteria untuk skor tertentu (100, 75, 50, 25, 0), Anda WAJIB memberikan skor di rentang 0-100 secara dinamis (misalnya 88, 65, atau 40) dengan menginterpolasi jawaban siswa terhadap kriteria tersebut.
OUTPUT HARUS HANYA BERUPA JSON VALID TANPA MARKDOWN.

SOAL: ${soal.soal_text}\n`;

        let jsonFormat = [];
        if (hasVerbal) {
          prompt += `\n[VERBAL]\nKunci (Bertingkat):\n${soal.kunci_verbal}\nJawaban Siswa: ${row['Verbal'] || ''}\n`;
          jsonFormat.push('"verbal":{"skor":number,"feedback":"..."}');
        }
        if (hasMatematik) {
          prompt += `\n[MATEMATIK]\nKunci (Bertingkat):\n${soal.kunci_matematik}\nJawaban Siswa: ${row['Matematik'] || ''}\n`;
          jsonFormat.push('"matematik":{"skor":number,"feedback":"..."}');
        }
        if (hasGrafik) {
          prompt += `\n[GRAFIK]\nKunci (Bertingkat):\n${soal.kunci_grafik}\nJawaban Siswa: ${row['Grafik'] || ''}\n`;
          jsonFormat.push('"grafik":{"skor":number,"feedback":"..."}');
        }
        if (hasVisual) {
          prompt += `\n[VISUAL]\nKunci (Bertingkat):\n${soal.kunci_visual}\nJawaban Siswa: ${row['Visual'] || ''}\n`;
          jsonFormat.push('"visual":{"skor":number,"feedback":"..."}');
        }

        prompt += `\nFormat Output:\n{${jsonFormat.join(',')}}`;

        let evalResult = null;
        let retries = 5;
        let delayMs = 3000;
        
        while (retries > 0) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "openrouter/free", 
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                response_format: { type: "json_object" }
              }),
            });

            if (response.status === 429) {
              const errText = await response.text();
              let waitTime = delayMs;
              try {
                const errJson = JSON.parse(errText);
                if (errJson.error?.metadata?.retry_after_seconds) {
                  waitTime = (errJson.error.metadata.retry_after_seconds + 1) * 1000;
                }
              } catch (e) {}
              
              await new Promise(r => setTimeout(r, waitTime));
              retries--;
              delayMs *= 2;
              continue;
            }

            if (!response.ok) {
              throw new Error(`API HTTP ${response.status}`);
            }

            const data = await response.json();
            let content = data.choices[0].message.content.trim();
            
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found");
            
            evalResult = JSON.parse(jsonMatch[0]);
            if (evalResult && typeof evalResult === 'object') break;
            
          } catch (e: any) {
             await new Promise(r => setTimeout(r, 2000));
             retries--;
          }
        }

        if (!evalResult) throw new Error(`Gagal (5x retries)`);

        let total = 0;
        if (hasVerbal) total += (evalResult.verbal?.skor || 0);
        if (hasMatematik) total += (evalResult.matematik?.skor || 0);
        if (hasGrafik) total += (evalResult.grafik?.skor || 0);
        if (hasVisual) total += (evalResult.visual?.skor || 0);
        const totalSkor = Math.round(total / activeCount);

        const feedbackString = JSON.stringify({
          nama_excel: row['Nama Siswa'],
          verbal: evalResult.verbal?.feedback || '-',
          matematik: evalResult.matematik?.feedback || '-',
          grafik: evalResult.grafik?.feedback || '-',
          visual: evalResult.visual?.feedback || '-',
        });

        await supabase.from('assessment_jawaban').insert([{
          soal_id: id,
          siswa_id: null, 
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

        await new Promise(r => setTimeout(r, 1500));

      } catch (err: any) {
        currentResults.push({
          nama: row['Nama Siswa'],
          skor_verbal: 0, skor_matematik: 0, skor_grafik: 0, skor_visual: 0, skor_total: 0,
          feedback: null,
          status: `Gagal`
        });
      }

      setResults([...currentResults]);
      setProgress(Math.round(((i + 1) / excelData.length) * 100));
    }

    setIsProcessing(false);
    toast.success('Evaluasi massal selesai!');
  };

  const getRadarData = (res: any) => {
    const d = [];
    if (hasVerbal) d.push({ representasi: 'Verbal', skor: res.skor_verbal, fullMark: 100 });
    if (hasMatematik) d.push({ representasi: 'Matematik', skor: res.skor_matematik, fullMark: 100 });
    if (hasGrafik) d.push({ representasi: 'Grafik', skor: res.skor_grafik, fullMark: 100 });
    if (hasVisual) d.push({ representasi: 'Visual', skor: res.skor_visual, fullMark: 100 });
    return d;
  };

  if (loading) return <DashboardLayout><div className="flex justify-center h-full">Memuat...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-10">
        <Link to={`/input-esai`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Rubrik
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Evaluasi Massal (Mode Excel)</h1>
          <p className="text-slate-500">Unggah file Excel berisi data esai siswa untuk: <span className="font-semibold text-slate-800">{soal?.judul}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <FileSpreadsheet className="w-6 h-6" />
              <h2 className="text-xl font-bold">1. Persiapkan Data Excel</h2>
            </div>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              Pastikan tabel Excel Anda memiliki susunan kolom yang sesuai dengan representasi aktif:
              <br/><br/>
              <b>Nama Siswa {hasVerbal && '| Verbal '} {hasMatematik && '| Matematik '} {hasGrafik && '| Grafik '} {hasVisual && '| Visual'}</b>
            </p>
            <button onClick={downloadTemplate} className="w-full py-2.5 rounded-xl border-2 border-slate-200 font-semibold hover:bg-slate-50 flex justify-center items-center gap-2">
              <Download className="w-4 h-4" /> Unduh Template Excel
            </button>
          </div>

          <div className="card p-8 bg-primary/5 border-primary/20 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-primary-pale rounded-full flex items-center justify-center text-primary mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">2. Unggah File Disini</h2>
            <label className="btn-primary cursor-pointer inline-flex items-center gap-2 mt-4">
              <span>Pilih File Excel</span>
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={isProcessing} />
            </label>
          </div>
        </div>

        {excelData.length > 0 && (
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Hasil Analisis & Pratinjau ({excelData.length} Baris)
              </h2>
              <div className="flex gap-3">
                {!isProcessing && progress === 0 && (
                  <button onClick={startBulkEvaluation} className="btn-primary flex items-center gap-2">
                    <Play className="w-4 h-4" /> Mulai Penilaian Otomatis
                  </button>
                )}
                {results.length > 0 && !isProcessing && (
                  <button onClick={exportToExcel} className="py-2.5 px-4 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-50 flex gap-2">
                    <Download className="w-4 h-4" /> Unduh Rekap (XLSX)
                  </button>
                )}
              </div>
            </div>

            {(isProcessing || progress > 0) && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between font-semibold mb-2"><span>Progres Penilaian</span><span>{progress}%</span></div>
                <div className="w-full bg-slate-200 rounded-full h-3"><div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 w-10">No</th>
                    <th className="p-4">Nama Siswa</th>
                    {hasVerbal && <th className="p-4 text-center">Verbal</th>}
                    {hasMatematik && <th className="p-4 text-center">Matematik</th>}
                    {hasGrafik && <th className="p-4 text-center">Grafik</th>}
                    {hasVisual && <th className="p-4 text-center">Visual</th>}
                    <th className="p-4 text-center">Total</th>
                    <th className="p-4 text-center">Saran AI</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {excelData.map((row, index) => {
                    const res = results[index];
                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="p-4 text-slate-400">{index + 1}</td>
                        <td className="p-4 font-medium">{row['Nama Siswa']}</td>
                        {hasVerbal && <td className="p-4 text-center">{res ? res.skor_verbal : '-'}</td>}
                        {hasMatematik && <td className="p-4 text-center">{res ? res.skor_matematik : '-'}</td>}
                        {hasGrafik && <td className="p-4 text-center">{res ? res.skor_grafik : '-'}</td>}
                        {hasVisual && <td className="p-4 text-center">{res ? res.skor_visual : '-'}</td>}
                        <td className="p-4 text-center font-bold text-primary">{res ? res.skor_total : '-'}</td>
                        <td className="p-4 text-center">
                          {res && res.feedback ? (
                            <button onClick={() => setSelectedFeedback({ ...res, nama: row['Nama Siswa'] })} className="text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                              <Search className="w-4 h-4" /> Detail
                            </button>
                          ) : '-'}
                        </td>
                        <td className="p-4">{res ? res.status : 'Menunggu'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Feedback with Radar Chart */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-50 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                <h3 className="font-bold text-xl text-slate-800">Detail Hasil Evaluasi AI: {selectedFeedback.nama}</h3>
                <button onClick={() => setSelectedFeedback(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Radar Chart Section */}
                  <GlassCard className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-white border-0 shadow-sm">
                    <div className="w-48 h-48 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(selectedFeedback)}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="representasi" stroke="#64748b" fontSize={12} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                          <RechartsTooltip />
                          <Radar name="Skor Siswa" dataKey="skor" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-500 text-sm mb-1">Skor Akhir</p>
                      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-glow to-secondary-glow">
                        {selectedFeedback.skor_total}
                      </h2>
                    </div>
                  </GlassCard>

                  {/* Feedback Section */}
                  <div className="lg:col-span-2 space-y-4">
                    {hasVerbal && (
                    <GlassCard className="bg-white border-0 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold flex items-center"><span className="w-3 h-3 rounded-full bg-primary-glow mr-3"></span> Verbal</h3>
                        <span className="text-xl font-bold text-slate-900">{selectedFeedback.skor_verbal}/100</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">{selectedFeedback.feedback.verbal}</p>
                    </GlassCard>
                    )}

                    {hasMatematik && (
                    <GlassCard className="bg-white border-0 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold flex items-center"><span className="w-3 h-3 rounded-full bg-secondary-glow mr-3"></span> Matematik</h3>
                        <span className="text-xl font-bold text-slate-700">{selectedFeedback.skor_matematik}/100</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">{selectedFeedback.feedback.matematik}</p>
                    </GlassCard>
                    )}

                    {hasGrafik && (
                    <GlassCard className="bg-white border-0 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold flex items-center"><span className="w-3 h-3 rounded-full bg-accent mr-3"></span> Grafik</h3>
                        <span className="text-xl font-bold text-accent">{selectedFeedback.skor_grafik}/100</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">{selectedFeedback.feedback.grafik}</p>
                    </GlassCard>
                    )}

                    {hasVisual && (
                    <GlassCard className="bg-white border-0 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-400 mr-3"></span> Visual / Fisik</h3>
                        <span className="text-xl font-bold text-emerald-400">{selectedFeedback.skor_visual}/100</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">{selectedFeedback.feedback.visual}</p>
                    </GlassCard>
                    )}
                  </div>
                </div>

                {selectedFeedback.skor_total < 80 && (
                  <GlassCard className="mt-8 border-warning/30 bg-warning/5">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        <span className="text-warning text-xl">💡</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-warning mb-2">Saran Peningkatan Umum</h3>
                        <p className="text-slate-600 leading-relaxed">Skor akhir masih di bawah 80. Tinjaulah rubrik dengan nilai terendah di atas untuk melatih pemahaman Anda secara spesifik.</p>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

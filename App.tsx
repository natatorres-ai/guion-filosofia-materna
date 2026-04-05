/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  ChevronRight, 
  Settings2,
  MessageSquare,
  Hash,
  Video,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PILARES = [
  "regulación emocional de la madre",
  "límites firmes sin lucha",
  "no rescatar al hijo",
  "aprendizaje por experiencia",
  "proceso no lineal de los hijos"
];

interface GeneratedContent {
  guion: {
    hook: string;
    desarrollo: string;
    cierre: string;
  };
  caption: string;
  hashtags: string[];
}

export default function App() {
  const [tema, setTema] = useState('');
  const [numVariaciones, setNumVariaciones] = useState(1);
  const [longitud, setLongitud] = useState('corto');
  const [idioma, setIdioma] = useState('Español');
  const [intensidad, setIntensidad] = useState('directo');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const promptTema = tema.trim() || PILARES[Math.floor(Math.random() * PILARES.length)];
      
      const systemInstruction = `
        Actúa como un experto en maternidad consciente y psicología práctica del canal 'Filosofía Materna'.
        Tu objetivo es generar contenido para TikTok que sea directo, claro, sin juicio y sin tecnicismos.
        
        REGLAS DE ORO:
        - DURACIÓN: El guión debe estar diseñado para durar entre 20 y 30 segundos al ser leído a ritmo normal.
        - Usa frases cortas y contundentes.
        - Prioriza el enfoque práctico y experiencial, no teórico.
        - Incluye ideas alineadas con: regulación emocional de la madre, límites firmes sin lucha, no rescatar, aprendizaje por experiencia, proceso no lineal del adolescente.
        - Evita lenguaje complejo o académico.
        - Evita contenido genérico o motivacional vacío.
        - Cada output debe sentirse como contenido real de TikTok (breve, claro, aplicable).
      `;

      const userPrompt = `
        Genera ${numVariaciones} variaciones de contenido para TikTok sobre el tema: "${promptTema}".
        
        PARÁMETROS:
        - Idioma: ${idioma}
        - Intensidad: ${intensidad}
        - Longitud del guión: ${longitud} (Asegura que siempre dure entre 20-30 segundos)
        
        FORMATO DE SALIDA (JSON ARRAY):
        Retorna un array de objetos JSON con esta estructura exacta:
        [
          {
            "guion": {
              "hook": "1-2 líneas impactantes",
              "desarrollo": "3-6 líneas prácticas",
              "cierre": "frase contundente final"
            },
            "caption": "texto breve y accionable",
            "hashtags": ["hashtag1", "hashtag2", ...]
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        setResults(parsed);
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un error al generar el contenido. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2d2d2d] font-sans selection:bg-[#e8d5c4]">
      {/* Header */}
      <header className="border-b border-[#e5e1da] bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8b7e74] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8b7e74]/20">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">Filosofía Materna</h1>
              <p className="text-xs text-[#8b7e74] font-medium uppercase tracking-widest">Content Generator</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-[#8b7e74]">
            <span>Regulación</span>
            <ChevronRight size={14} />
            <span>Límites</span>
            <ChevronRight size={14} />
            <span>Vínculo</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Controls */}
          <aside className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-[#e5e1da] shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[#8b7e74] mb-2">
                <Settings2 size={18} />
                <h2 className="font-bold uppercase text-xs tracking-widest">Configuración</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#5c544e]">Tema (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ej: El hijo que no escucha..."
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e1da] focus:ring-2 focus:ring-[#8b7e74] focus:border-transparent outline-none transition-all placeholder:text-[#c4c0b9]"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                  />
                  <p className="text-[10px] text-[#8b7e74] italic">*Si se deja vacío, se usará un pilar aleatorio.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#5c544e]">Variaciones</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-[#e5e1da] bg-white outline-none focus:ring-2 focus:ring-[#8b7e74]"
                      value={numVariaciones}
                      onChange={(e) => setNumVariaciones(Number(e.target.value))}
                    >
                      {[1, 2, 3, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#5c544e]">Longitud</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-[#e5e1da] bg-white outline-none focus:ring-2 focus:ring-[#8b7e74]"
                      value={longitud}
                      onChange={(e) => setLongitud(e.target.value)}
                    >
                      <option value="corto">Corto</option>
                      <option value="medio">Medio</option>
                      <option value="largo">Largo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#5c544e]">Intensidad</label>
                  <div className="flex p-1 bg-[#f3f1ed] rounded-xl">
                    {['suave', 'directo', 'contundente'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setIntensidad(mode)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-tighter rounded-lg transition-all ${
                          intensidad === mode 
                            ? 'bg-white text-[#8b7e74] shadow-sm' 
                            : 'text-[#c4c0b9] hover:text-[#8b7e74]'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#5c544e]">Idioma</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-[#e5e1da] bg-white outline-none focus:ring-2 focus:ring-[#8b7e74]"
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                  >
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Portugués">Portugués</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={generateContent}
                disabled={loading}
                className="w-full bg-[#8b7e74] hover:bg-[#766b62] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8b7e74]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    Generar Contenido
                  </>
                )}
              </button>
            </section>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {results.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {results.map((res, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-[2rem] border border-[#e5e1da] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-8 space-y-8">
                        {/* Guion Section */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#8b7e74]">
                              <Video size={20} />
                              <h3 className="font-bold uppercase text-xs tracking-widest">Guión de TikTok</h3>
                            </div>
                            <button 
                              onClick={() => copyToClipboard(`GUION:\nHook: ${res.guion.hook}\nDesarrollo: ${res.guion.desarrollo}\nCierre: ${res.guion.cierre}`, idx)}
                              className="p-2 hover:bg-[#f3f1ed] rounded-lg transition-colors text-[#8b7e74]"
                            >
                              {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="p-4 bg-[#fdfcfb] border-l-4 border-[#8b7e74] rounded-r-xl">
                              <span className="text-[10px] font-bold text-[#8b7e74] uppercase block mb-1">Hook</span>
                              <p className="text-lg font-medium leading-tight italic">"{res.guion.hook}"</p>
                            </div>
                            <div className="p-4 bg-[#faf9f6] rounded-xl">
                              <span className="text-[10px] font-bold text-[#c4c0b9] uppercase block mb-1">Desarrollo</span>
                              <p className="text-[#5c544e] leading-relaxed">{res.guion.desarrollo}</p>
                            </div>
                            <div className="p-4 bg-[#8b7e74]/5 rounded-xl border border-[#8b7e74]/10">
                              <span className="text-[10px] font-bold text-[#8b7e74] uppercase block mb-1">Cierre</span>
                              <p className="font-bold text-[#2d2d2d]">{res.guion.cierre}</p>
                            </div>
                          </div>
                        </div>

                        <hr className="border-[#f3f1ed]" />

                        {/* Combined Caption & Hashtags Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#8b7e74]">
                              <MessageSquare size={18} />
                              <h4 className="font-bold uppercase text-[10px] tracking-widest">Caption & Hashtags</h4>
                            </div>
                            <button 
                              onClick={() => {
                                const fullText = `${res.caption}\n\n${res.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')}`;
                                copyToClipboard(fullText, idx + 100); // Offset index for distinction
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#f3f1ed] hover:bg-[#e5e1da] rounded-lg transition-colors text-[#8b7e74] text-xs font-bold"
                            >
                              {copiedIndex === idx + 100 ? (
                                <><Check size={14} /> Copiado</>
                              ) : (
                                <><Copy size={14} /> Copiar todo</>
                              )}
                            </button>
                          </div>
                          
                          <div className="bg-[#fdfcfb] p-6 rounded-2xl border border-[#e5e1da] space-y-4">
                            <p className="text-sm text-[#5c544e] leading-relaxed whitespace-pre-wrap">
                              {res.caption}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f3f1ed]">
                              {res.hashtags.map((tag, tIdx) => (
                                <span key={tIdx} className="text-[#8b7e74] text-xs font-medium">
                                  #{tag.replace('#', '')}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[600px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-[#e5e1da] rounded-[3rem] bg-white/50"
                >
                  <div className="w-20 h-20 bg-[#f3f1ed] rounded-full flex items-center justify-center text-[#c4c0b9]">
                    <RefreshCw size={32} />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <h3 className="font-bold text-lg">Listo para crear</h3>
                    <p className="text-sm text-[#8b7e74]">Configura los parámetros a la izquierda y genera contenido alineado con Filosofía Materna.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e5e1da] text-center space-y-4">
        <p className="text-xs text-[#c4c0b9] uppercase tracking-widest font-bold">Filosofía Materna © 2026</p>
        <div className="flex justify-center gap-6 text-[10px] font-bold text-[#8b7e74] uppercase tracking-tighter">
          <span>Regulación Emocional</span>
          <span>Límites sin Lucha</span>
          <span>No Rescatar</span>
        </div>
      </footer>
    </div>
  );
}

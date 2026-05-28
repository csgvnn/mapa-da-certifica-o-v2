import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Trophy } from "lucide-react";
import treasureMap from "@/assets/treasure-map.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mapa de Certificação" },
      {
        name: "description",
        content:
          "Journey Tracker visualizes and records progress through sequential and flexible map stages.",
      },
      { property: "og:title", content: "Mapa de Certificação" },
      {
        property: "og:description",
        content:
          "Journey Tracker visualizes and records progress through sequential and flexible map stages.",
      },
    ],
  }),
  component: MapaCertificacao,
});

type Etapa = {
  id: number;
  titulo: string;
  tipo: "sequencial" | "flexivel";
  left: string;
  top: string;
};

const ETAPAS: Etapa[] = [
  { id: 1, titulo: "Planejamento e Desenho de Políticas Públicas", tipo: "sequencial", left: "11%", top: "31%" },
  { id: 2, titulo: "Planejamento e Monitoramento Governamental", tipo: "sequencial", left: "37%", top: "33%" },
  { id: 3, titulo: "Gestão e Elaboração de Planos Estratégicos", tipo: "sequencial", left: "61%", top: "26%" },
  { id: 4, titulo: "Gestão dos objetivos e resultados chaves (OKRs) da organização", tipo: "sequencial", left: "88%", top: "28%" },
  { id: 5, titulo: "Transformando Metas e Objetivos Estratégicos em Projetos", tipo: "sequencial", left: "83%", top: "49%" },
  { id: 6, titulo: "Análise de Dados Aplicadas à Rede SIPOFE", tipo: "sequencial", left: "66%", top: "54%" },
  { id: 7, titulo: "Análise de Políticas Públicas", tipo: "sequencial", left: "44%", top: "54%" },
  { id: 8, titulo: "Inteligência Artificial e Ferramentas Generativas (Livre EAD)", tipo: "flexivel", left: "26%", top: "52%" },
  { id: 9, titulo: "Indicadores de Desempenho (Livre EAD)", tipo: "flexivel", left: "14%", top: "77%" },
  { id: 10, titulo: "Design Thinking para Inovação no Setor Público (Livre)", tipo: "flexivel", left: "34%", top: "78%" },
  { id: 11, titulo: "Execução Orçamentária e Financeira - Módulo I (Livre)", tipo: "flexivel", left: "52%", top: "79%" },
  { id: 12, titulo: "Economia do Setor Público (Livre)", tipo: "flexivel", left: "72%", top: "79%" },
];

const STORAGE_KEY = "mapa-certificacao-progresso";
const NAME_KEY = "mapa-certificacao-nome";

function MapaCertificacao() {
  const [concluidas, setConcluidas] = useState<number[]>([]);
  const [nome, setNome] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConcluidas(JSON.parse(raw));
      const n = localStorage.getItem(NAME_KEY);
      if (n) setNome(n);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(concluidas));
    } catch {}
  }, [concluidas]);

  useEffect(() => {
    try {
      localStorage.setItem(NAME_KEY, nome);
    } catch {}
  }, [nome]);

  const toggle = (id: number) => {
    setConcluidas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].sort((a, b) => a - b),
    );
  };

  const reiniciar = () => {
    if (confirm("Tem certeza que deseja reiniciar todo o progresso?")) setConcluidas([]);
  };

  const total = ETAPAS.length;
  const feitas = concluidas.length;
  const pct = Math.round((feitas / total) * 100);

  // pirata segue a última etapa concluída
  const ultima = useMemo(() => {
    if (concluidas.length === 0) return null;
    const id = concluidas[concluidas.length - 1];
    return ETAPAS.find((e) => e.id === id) ?? null;
  }, [concluidas]);

  return (
    <div className="min-h-screen bg-[#1a1410] text-amber-50 flex flex-col lg:flex-row">
      <aside className="lg:w-96 w-full lg:h-screen lg:sticky lg:top-0 bg-gradient-to-b from-[#2a1d12] to-[#1a1410] border-r-4 border-amber-900/50 p-5 overflow-y-auto">
        <header className="mb-5">
          <h1 className="text-2xl font-black tracking-wide text-stone-200" style={{ fontFamily: "Georgia, serif" }}>
            🏴‍☠️ Mapa da Certificação
          </h1>
          <p className="text-sm text-stone-300/70">SIPOFE Planejamento</p>
        </header>

        <a
          href="https://goias.gov.br/escoladegoverno/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 block text-center rounded-lg bg-amber-700/60 hover:bg-amber-600/80 border border-amber-500/50 py-2 px-4 text-sm font-bold text-amber-50 transition-colors"
        >
          Acesse a EGOV
        </a>

        <div className="mb-4 rounded-xl bg-amber-950/40 p-4 border border-amber-800/40">
          <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
            Capitão(ã) do mapa
          </label>
          <input
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#1a1410] border border-amber-800/60 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="mb-6 rounded-xl bg-amber-950/40 p-4 border border-amber-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="text-amber-500/80" size={16} /> Progresso
            </span>
            <span className="text-sm font-bold text-stone-200">
              {feitas}/{total} • {pct}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-amber-950 overflow-hidden border border-amber-800/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <button
            onClick={reiniciar}
            className="mt-3 text-xs text-stone-200/70 hover:text-stone-300 underline"
          >
            Reiniciar progresso
          </button>
        </div>

        <SidebarSecao
          titulo="Sequencial (1–7)"
          sub="ordem obrigatória"
          dotClass="bg-amber-900"
          etapas={ETAPAS.filter((e) => e.tipo === "sequencial")}
          concluidas={concluidas}
          onToggle={toggle}
        />
        <SidebarSecao
          titulo="Flexível (8–12)"
          sub="ordem livre"
          dotClass="bg-orange-500"
          etapas={ETAPAS.filter((e) => e.tipo === "flexivel")}
          concluidas={concluidas}
          onToggle={toggle}
        />
      </aside>

      <main className="flex-1 p-4 lg:p-6">
        <div className="relative w-full max-w-[1400px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-900/60">
          <img src={treasureMap} alt="Mapa" className="w-full h-auto block select-none" draggable={false} />

          {ETAPAS.map((e) => {
            const done = concluidas.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                title={e.titulo}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                style={{ left: e.left, top: e.top }}
              >
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-[3px] shadow-lg font-black text-sm md:text-base ${
                    done
                      ? "bg-emerald-500 border-emerald-900 text-white"
                      : e.tipo === "sequencial"
                        ? "bg-amber-100 border-amber-900 text-amber-950"
                        : "bg-orange-400 border-orange-900 text-orange-950"
                  }`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : e.id}
                </div>
              </button>
            );
          })}

          {ultima && (
            <img
              src="https://cdn-icons-png.flaticon.com/512/3068/3068322.png"
              alt="Pirata"
              className="absolute w-16 md:w-20 -translate-x-1/2 pointer-events-none transition-all duration-1000 ease-in-out drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
              style={{ left: ultima.left, top: `calc(${ultima.top} - 60px)` }}
            />
          )}
        </div>

        {nome && (
          <p className="text-center mt-4 text-stone-300/80 italic">
            Boa jornada, Capitão(ã) <span className="font-bold text-amber-300">{nome}</span>!
          </p>
        )}
      </main>
    </div>
  );
}

function SidebarSecao({
  titulo,
  sub,
  dotClass,
  etapas,
  concluidas,
  onToggle,
}: {
  titulo: string;
  sub: string;
  dotClass: string;
  etapas: Etapa[];
  concluidas: number[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-3 h-3 rounded-full ${dotClass}`} />
        <h2 className="font-bold text-stone-300">{titulo}</h2>
        <span className="text-xs text-stone-300/60">— {sub}</span>
      </div>
      <ul className="space-y-2">
        {etapas.map((e) => {
          const done = concluidas.includes(e.id);
          return (
            <li key={e.id}>
              <div
                onClick={() => onToggle(e.id)}
                className="flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer bg-amber-950/30 border-amber-900/40 hover:bg-amber-900/30"
              >
                <button
                  className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                    done
                      ? "bg-emerald-500 border-emerald-700 text-white"
                      : "bg-transparent border-amber-700/60"
                  }`}
                  title={done ? "Marcar como não concluída" : "Marcar como concluída"}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-500/80">#{e.id}</span>
                  </div>
                  <p className={`text-sm leading-snug ${done ? "line-through text-stone-300/60" : "text-stone-200"}`}>
                    {e.titulo}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

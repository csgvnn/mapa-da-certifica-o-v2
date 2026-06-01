import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Trophy, Flag } from "lucide-react";
import treasureMap from "@/assets/treasure-map.png";
import pirateImg from "@/assets/pirate.png";
import mermaidImg from "@/assets/mermaid.png";
import parrotImg from "@/assets/parrot.png";
import seaMonsterImg from "@/assets/sea-monster.png";

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
  { id: 1, titulo: "Planejamento e Desenho de Políticas Públicas", tipo: "sequencial", left: "13.9%", top: "29.8%" },
  { id: 2, titulo: "Planejamento e Monitoramento Governamental", tipo: "sequencial", left: "38.1%", top: "31.7%" },
  { id: 3, titulo: "Gestão e Elaboração de Planos Estratégicos", tipo: "sequencial", left: "62.4%", top: "27.0%" },
  { id: 4, titulo: "Gestão dos objetivos e resultados chaves (OKRs) da organização", tipo: "sequencial", left: "88.0%", top: "27.5%" },
  { id: 5, titulo: "Transformando Metas e Objetivos Estratégicos em Projetos", tipo: "sequencial", left: "86.9%", top: "53.1%" },
  { id: 6, titulo: "Análise de Dados Aplicadas à Rede SIPOFE", tipo: "sequencial", left: "67.6%", top: "53.1%" },
  { id: 7, titulo: "Análise de Políticas Públicas", tipo: "sequencial", left: "46.8%", top: "56.4%" },
  { id: 8, titulo: "Inteligência Artificial e Ferramentas Generativas (Livre EAD)", tipo: "flexivel", left: "29.7%", top: "54.1%" },
  { id: 9, titulo: "Indicadores de Desempenho (Livre EAD)", tipo: "flexivel", left: "16.7%", top: "78.7%" },
  { id: 10, titulo: "Design Thinking para Inovação no Setor Público (Livre)", tipo: "flexivel", left: "36.7%", top: "79.7%" },
  { id: 11, titulo: "Execução Orçamentária e Financeira - Módulo I (Livre)", tipo: "flexivel", left: "56.6%", top: "79.7%" },
  { id: 12, titulo: "Economia do Setor Público (Livre)", tipo: "flexivel", left: "75.3%", top: "78.7%" },
];

// Posição do baú do tesouro no mapa (ajuste fino via styles.css se necessário)
const BAU_POS = { left: "50%", top: "93%" };

const AVATARS = [
  { id: "pirata", nome: "Pirata", img: pirateImg },
  { id: "sereia", nome: "Sereia", img: mermaidImg },
  { id: "papagaio", nome: "Papagaio", img: parrotImg },
  { id: "monstro", nome: "Monstro do Mar", img: seaMonsterImg },
] as const;

type AvatarId = (typeof AVATARS)[number]["id"];

const STORAGE_KEY = "mapa-certificacao-progresso";
const NAME_KEY = "mapa-certificacao-nome";
const AVATAR_KEY = "mapa-certificacao-avatar";
const FINALIZADA_KEY = "mapa-certificacao-finalizada";

function MapaCertificacao() {
  const [concluidas, setConcluidas] = useState<number[]>([]);
  const [nome, setNome] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("pirata");
  const [finalizada, setFinalizada] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConcluidas(JSON.parse(raw));
      const n = localStorage.getItem(NAME_KEY);
      if (n) setNome(n);
      const a = localStorage.getItem(AVATAR_KEY) as AvatarId | null;
      if (a && AVATARS.some((x) => x.id === a)) setAvatar(a);
      const f = localStorage.getItem(FINALIZADA_KEY);
      if (f === "1") setFinalizada(true);
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

  useEffect(() => {
    try {
      localStorage.setItem(AVATAR_KEY, avatar);
    } catch {}
  }, [avatar]);

  useEffect(() => {
    try {
      localStorage.setItem(FINALIZADA_KEY, finalizada ? "1" : "0");
    } catch {}
  }, [finalizada]);

  const isBloqueada = (etapa: Etapa) => {
    if (etapa.tipo !== "sequencial" || etapa.id === 1) return false;
    return !concluidas.includes(etapa.id - 1);
  };

  const [comemorando, setComemorando] = useState(false);

  const toggle = (id: number) => {
    const etapa = ETAPAS.find((e) => e.id === id);
    if (!etapa) return;
    const jaFeita = concluidas.includes(id);
    if (!jaFeita && isBloqueada(etapa)) {
      alert(`Você precisa concluir a etapa ${id - 1} antes de iniciar a etapa ${id}.`);
      return;
    }
    // se desmarcar algo, sai do estado finalizado
    if (jaFeita && finalizada) setFinalizada(false);
    setConcluidas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].sort((a, b) => a - b),
    );
    if (!jaFeita) {
      setComemorando(true);
      window.setTimeout(() => setComemorando(false), 2400);
    }
  };

  const reiniciar = () => {
    if (confirm("Tem certeza que deseja reiniciar todo o progresso?")) {
      setConcluidas([]);
      setFinalizada(false);
    }
  };

  const total = ETAPAS.length;
  const feitas = concluidas.length;
  const pct = Math.round((feitas / total) * 100);
  const todasConcluidas = feitas === total;

  const finalizarJornada = () => {
    if (!todasConcluidas) return;
    setFinalizada(true);
    setComemorando(true);
    window.setTimeout(() => setComemorando(false), 3500);
  };

  // pirata segue a última etapa concluída — ou vai para o baú se finalizada
  const posPersonagem = useMemo(() => {
    if (finalizada) return BAU_POS;
    if (concluidas.length === 0) return null;
    const id = concluidas[concluidas.length - 1];
    const e = ETAPAS.find((x) => x.id === id);
    return e ? { left: e.left, top: e.top } : null;
  }, [concluidas, finalizada]);

  const avatarAtual = AVATARS.find((a) => a.id === avatar) ?? AVATARS[0];

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

        <div className="mb-4 rounded-xl bg-amber-950/40 p-4 border border-amber-800/40">
          <label className="block text-xs font-semibold text-stone-300 mb-2 uppercase tracking-wider">
            Escolha seu avatar
          </label>
          <div className="grid grid-cols-4 gap-2">
            {AVATARS.map((a) => {
              const selecionado = avatar === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAvatar(a.id)}
                  title={a.nome}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                    selecionado
                      ? "border-amber-400 bg-amber-900/40 scale-105 shadow-lg"
                      : "border-amber-800/40 bg-[#1a1410] hover:border-amber-600/60"
                  }`}
                >
                  <img src={a.img} alt={a.nome} className="w-12 h-12 object-contain" />
                  <span className="text-[10px] font-semibold text-stone-300 leading-tight text-center">
                    {a.nome}
                  </span>
                </button>
              );
            })}
          </div>
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
            onClick={finalizarJornada}
            disabled={!todasConcluidas || finalizada}
            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-sm font-bold border-2 transition-all ${
              !todasConcluidas
                ? "bg-stone-800/40 border-stone-700/40 text-stone-500 cursor-not-allowed"
                : finalizada
                  ? "bg-emerald-700/40 border-emerald-500/60 text-emerald-200 cursor-default"
                  : "bg-gradient-to-r from-amber-500 to-yellow-400 border-amber-300 text-amber-950 hover:brightness-110 shadow-lg animate-pulse"
            }`}
          >
            <Flag size={16} />
            {finalizada ? "Jornada Finalizada!" : "Finalizar Jornada"}
          </button>

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
            const locked = !done && isBloqueada(e);
            return (
              <button
                key={e.id}
                id={`caixinha-${e.id}`}
                onClick={() => toggle(e.id)}
                title={locked ? `Bloqueada — conclua a etapa ${e.id - 1} primeiro` : e.titulo}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                  locked ? "cursor-not-allowed opacity-70" : "hover:scale-110"
                }`}
                style={{ left: e.left, top: e.top }}
              >
                <div
                  className={`caixinha-etapa caixinha-${e.id} w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center border-[3px] shadow-lg font-black text-sm md:text-base ${
                    done
                      ? "bg-emerald-500 border-emerald-900 text-white"
                      : locked
                        ? "bg-stone-600 border-stone-900 text-stone-300"
                        : e.tipo === "sequencial"
                          ? "bg-amber-100 border-amber-900 text-amber-950"
                          : "bg-orange-400 border-orange-900 text-orange-950"
                  }`}
                >
                  {done ? <Check size={18} strokeWidth={3} /> : locked ? "🔒" : e.id}
                </div>
              </button>
            );
          })}

          {posPersonagem && (
            <img
              id={`avatar-${avatarAtual.id}`}
              data-avatar={avatarAtual.id}
              data-finalizada={finalizada ? "true" : "false"}
              src={avatarAtual.img}
              alt={avatarAtual.nome}
              className={`avatar-mapa avatar-${avatarAtual.id} ${finalizada ? "avatar-finalizada avatar-no-bau" : "avatar-no-mapa"} absolute w-16 md:w-20 pointer-events-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)] transition-[left,top] duration-1000 ease-in-out -translate-x-1/2 ${
                finalizada ? "-translate-y-1/2" : ""
              } ${comemorando ? "animate-pirate-celebrate" : "animate-pirate-walk"}`}
              style={{
                left: posPersonagem.left,
                top: finalizada ? posPersonagem.top : `calc(${posPersonagem.top} - 60px)`,
              }}
            />
          )}
        </div>

        {nome && (
          <p className="text-center mt-4 text-stone-300/80 italic">
            {finalizada ? "🏆 Jornada concluída por " : "Boa jornada, Capitão(ã) "}
            <span className="font-bold text-amber-300">{nome}</span>
            {finalizada ? "! Tesouro conquistado!" : "!"}
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
          const locked =
            !done && e.tipo === "sequencial" && e.id > 1 && !concluidas.includes(e.id - 1);
          return (
            <li key={e.id}>
              <div
                onClick={() => !locked && onToggle(e.id)}
                title={locked ? `Bloqueada — conclua a etapa ${e.id - 1} primeiro` : undefined}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors bg-amber-950/30 border-amber-900/40 ${
                  locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-amber-900/30"
                }`}
              >
                <button
                  disabled={locked}
                  className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                    done
                      ? "bg-emerald-500 border-emerald-700 text-white"
                      : locked
                        ? "bg-stone-700 border-stone-800 text-stone-300"
                        : "bg-transparent border-amber-700/60"
                  }`}
                  title={done ? "Marcar como não concluída" : "Marcar como concluída"}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : locked ? <span className="text-[10px]">🔒</span> : null}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-500/80">#{e.id}</span>
                  </div>
                  <p className={`text-sm leading-snug ${done ? "line-through text-stone-300/60" : locked ? "text-stone-400" : "text-stone-200"}`}>
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

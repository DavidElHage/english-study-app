// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Flashcard {
  id: string;
  english: string;
  portuguese: string;
  context: string;
}

export default function Home() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [english, setEnglish] = useState('');
  const [portuguese, setPortuguese] = useState('');
  const [context, setContext] = useState('');
  const [revealId, setRevealId] = useState<string | null>(null);

  // Carregar os cartões do Back-end
  const fetchCards = async () => {
    const res = await fetch('/api/flashcards');
    const data = await res.json();
    if (Array.isArray(data)) setCards(data);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Enviar novo cartão
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!english || !portuguese) return;

    const res = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ english, portuguese, context }),
    });

    if (res.ok) {
      setEnglish('');
      setPortuguese('');
      setContext('');
      fetchCards(); // Atualiza a lista
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-indigo-400 mb-2">My English Study Lab</h1>
          <p className="text-slate-400">Cadastre termos, expressões e force sua memória!</p>
        </header>

        {/* Formulário de Cadastro */}
        <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-12">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">Adicionar Novo Termo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expressão em Inglês</label>
                <input
                  type="text"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="E.g., Breakdown"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tradução em Português</label>
                <input
                  type="text"
                  value={portuguese}
                  onChange={(e) => setPortuguese(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="E.g., Quebrar, falhar, análise detalhada"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contexto / Frase de Exemplo (Opcional)</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="E.g., We need a breakdown of the software costs."
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Adicionar Card
            </button>
          </form>
        </section>

        {/* Grid de Flashcards */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-slate-200">Seus Flashcards ({cards.length})</h2>
          {cards.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Nenhum card cadastrado ainda. Comece adicionando um acima!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setRevealId(revealId === card.id ? null : card.id)}
                  className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md cursor-pointer hover:border-indigo-500 transition-all min-h-[160px] flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Inglês</span>
                    <p className="text-xl font-bold mt-1 text-white">{card.english}</p>
                    {card.context && (
                      <p className="text-sm text-slate-400 italic mt-2">"{card.context}"</p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    {revealId === card.id ? (
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Tradução</span>
                        <p className="text-lg font-semibold text-emerald-300 mt-1">{card.portuguese}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 text-center font-medium uppercase tracking-wider animate-pulse">
                        Clique para revelar a tradução
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
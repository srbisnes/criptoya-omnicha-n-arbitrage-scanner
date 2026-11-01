'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, AlertTriangle } from 'lucide-react';

interface Opp {
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  grossProfitPercent: number;
}

export default function Home() {
  const [coin, setCoin] = useState('USDT');
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchArb = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/arb?coin=${coin}&min=0.2`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOpps(data.opportunities || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArb();
    const id = setInterval(fetchArb, 45000);
    return () => clearInterval(id);
  }, [coin]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            CryptoYa Arbitrage Scanner
          </h1>
          <p className="text-slate-400 mt-1">Omnichaín LATAM • Powered by CryptoYa API • Fee-aware detection</p>
        </div>
        <button
          onClick={fetchArb}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg disabled:opacity-50"
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
          Actualizar
        </button>
      </header>

      <div className="mb-6 flex gap-3">
        {['USDT', 'BTC', 'ETH', 'USDC', 'DAI'].map(c => (
          <button
            key={c}
            onClick={() => setCoin(c)}
            className={`px-4 py-2 rounded-full ${coin === c ? 'bg-cyan-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            {c}/ARS
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded flex items-center gap-2">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      <div className="grid gap-4">
        {opps.length === 0 && !loading && (
          <p className="text-center text-slate-500 py-12">No hay oportunidades por encima del umbral en este momento.</p>
        )}
        {opps.map((o, i) => (
          <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-emerald-700 transition">
            <div>
              <div className="text-sm text-slate-400">COMPRA → VENTA</div>
              <div className="text-xl font-semibold mt-1">
                {o.buyExchange} → {o.sellExchange}
              </div>
              <div className="text-slate-300 text-sm mt-1">
                Buy: ${o.buyPrice.toLocaleString()} • Sell: ${o.sellPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-400 text-2xl font-bold">
                <TrendingUp size={22} />
                +{o.grossProfitPercent}%
              </div>
              <div className="text-xs text-slate-500">gross (antes fees retiro)</div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-slate-600 text-sm">
        Datos en tiempo real vía CryptoYa • No es consejo financiero • Verifica fees de retiro y liquidez antes de ejecutar
      </footer>
    </main>
  );
}
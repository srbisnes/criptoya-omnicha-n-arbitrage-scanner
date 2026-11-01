# CryptoYa Omnichaín Arbitrage Scanner

Expert scanner de arbitraje cross-exchange alimentado por la API pública de CryptoYa (https://criptoya.com/api).

## Features
- Detección en tiempo real de spreads entre exchanges LATAM (Binance P2P, Lemon, Belo, Ripio, etc.)
- Cálculo de profit bruto sobre totalAsk / totalBid
- Dashboard Next.js con auto-refresh
- API route `/api/arb?coin=USDT&min=0.3`
- Listo para deploy en Vercel

## Setup local
```bash
npm install
npm run dev
```

## Deploy
Push a GitHub y conectar a Vercel. No requiere secrets (API pública).

## Arquitectura
- Frontend: Next.js 14 App Router + Tailwind
- Data: CryptoYa public API (120 req/min)
- Logic: lib/criptoya.ts → findArbitrage()

**Elcryptoboy** — Omnichaín Web3 Solutions
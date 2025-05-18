// app/api/crypto/chart/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coin = searchParams.get('coin');
  const currency = searchParams.get('currency');

  if (!coin || !currency) {
    return NextResponse.json({ error: 'Faltan parámetros coin o currency' }, { status: 400 });
  }

  try {
    // Llamada al API externo (por ejemplo CoinGecko)
    const extRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=7`
    );
    if (!extRes.ok) {
      return NextResponse.json({ error: 'Error al obtener datos externos' }, { status: extRes.status });
    }
    const data = await extRes.json();
    // Devuelve sólo lo que necesitas (p. ej. data.prices)
    return NextResponse.json({ prices: data.prices });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error interno' }, { status: 500 });
  }
}

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function estaSaudavel(): Promise<boolean> {
  try {
    const resposta = await fetch(`${BASE_URL}/health`);
    return resposta.ok;
  } catch {
    return false;
  }
}

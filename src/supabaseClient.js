// src/supabaseClient.js
// ─────────────────────────────────────────────────────────────
// Configure as variáveis no arquivo .env.local (desenvolvimento)
// e no painel da Vercel (produção).
//
// .env.local:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGci...
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '❌ Variáveis de ambiente do Supabase não encontradas.\n' +
    'Crie um arquivo .env.local com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Mantém a sessão no localStorage do navegador
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ── Helpers de autenticação ───────────────────────────────────

/** Cadastra um novo usuário e cria perfil */
export async function signUp({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (data.user && name) {
    await new Promise(r => setTimeout(r, 1500));
    await supabase
      .from('profiles')
      .update({ name })
      .eq('id', data.user.id);
  }

  return data;
}

/** Login com email/senha */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Logout */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Retorna o usuário logado (ou null) */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Helpers de plano ─────────────────────────────────────────

/** Carrega o plano salvo do usuário. Retorna null se não existir. */
export async function loadUserPlan(userId) {
  const { data, error } = await supabase
    .from('user_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? data.plan_data : null;
}

/** Salva/atualiza o plano do usuário (upsert). */
export async function saveUserPlan(userId, planData) {
  const { error } = await supabase
    .from('user_plans')
    .upsert(
      { user_id: userId, plan_data: planData, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}

// ── Helpers TACO ─────────────────────────────────────────────

/** Busca todos os alimentos TACO (cache em memória) */
let _tacoCache = null;
export async function getTacoFoods() {
  if (_tacoCache) return _tacoCache;

  const { data, error } = await supabase
    .from('taco_foods')
    .select('*')
    .order('name');

  if (error) throw error;
  _tacoCache = data;
  return data;
}

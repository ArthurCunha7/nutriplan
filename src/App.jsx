// src/App.jsx — NutriPlan completo
// Novidades: 🛒 Lista de compras | 🔄 Troca de tipo de treino por dia
import { useState, useMemo, useRef, useEffect } from "react";
import { supabase, signUp, signIn, signOut, loadUserPlan, saveUserPlan } from "./supabaseClient";

// ── TACO DB ───────────────────────────────────────────────────────────────────
const TACO_DB = [{"id":1,"n":"Arroz, integral, cozido","c":"Cereais","e":124,"p":2.6,"l":1.0,"cb":25.8},{"id":3,"n":"Arroz, tipo 1, cozido","c":"Cereais","e":128,"p":2.5,"l":0.2,"cb":28.1},{"id":7,"n":"Aveia, flocos, crua","c":"Cereais","e":394,"p":13.9,"l":8.5,"cb":66.6},{"id":52,"n":"Pão, trigo, forma, integral","c":"Cereais","e":253,"p":9.4,"l":3.7,"cb":49.9},{"id":53,"n":"Pão, trigo, francês","c":"Cereais","e":300,"p":8.0,"l":3.1,"cb":58.6},{"id":88,"n":"Batata, doce, cozida","c":"Vegetais","e":77,"p":0.6,"l":0.1,"cb":18.4},{"id":91,"n":"Batata, inglesa, cozida","c":"Vegetais","e":52,"p":1.2,"l":0.0,"cb":11.9},{"id":100,"n":"Brócolis, cozido","c":"Vegetais","e":25,"p":2.1,"l":0.5,"cb":4.4},{"id":109,"n":"Cenoura, cozida","c":"Vegetais","e":30,"p":0.8,"l":0.2,"cb":6.7},{"id":116,"n":"Couve, manteiga, refogada","c":"Vegetais","e":90,"p":1.7,"l":6.6,"cb":8.7},{"id":129,"n":"Mandioca, cozida","c":"Vegetais","e":125,"p":0.6,"l":0.3,"cb":30.1},{"id":157,"n":"Tomate, com semente, cru","c":"Vegetais","e":15,"p":1.1,"l":0.2,"cb":3.1},{"id":179,"n":"Banana, nanica, crua","c":"Frutas","e":92,"p":1.4,"l":0.1,"cb":23.8},{"id":182,"n":"Banana, prata, crua","c":"Frutas","e":98,"p":1.3,"l":0.1,"cb":26.0},{"id":222,"n":"Maçã, Fuji, com casca, crua","c":"Frutas","e":56,"p":0.3,"l":0.0,"cb":15.2},{"id":226,"n":"Mamão, Papaia, cru","c":"Frutas","e":40,"p":0.5,"l":0.1,"cb":10.4},{"id":239,"n":"Morango, cru","c":"Frutas","e":30,"p":0.9,"l":0.3,"cb":6.8},{"id":277,"n":"Atum, conserva em óleo","c":"Pescados","e":166,"p":26.2,"l":6.0,"cb":0},{"id":315,"n":"Salmão, filé, grelhado","c":"Pescados","e":229,"p":23.9,"l":14.0,"cb":0},{"id":318,"n":"Sardinha, assada","c":"Pescados","e":164,"p":32.2,"l":3.0,"cb":0},{"id":326,"n":"Carne, bovina, acém, moído, cozido","c":"Carnes","e":212,"p":26.7,"l":10.9,"cb":0},{"id":381,"n":"Carne, bovina, picanha, grelhada","c":"Carnes","e":289,"p":26.4,"l":19.5,"cb":0},{"id":395,"n":"Frango, coração, grelhado","c":"Carnes","e":207,"p":22.4,"l":12.1,"cb":0.6},{"id":396,"n":"Frango, coxa, com pele, assada","c":"Carnes","e":215,"p":28.5,"l":10.4,"cb":0.1},{"id":408,"n":"Frango, peito, sem pele, cozido","c":"Carnes","e":163,"p":31.5,"l":3.2,"cb":0},{"id":410,"n":"Frango, peito, sem pele, grelhado","c":"Carnes","e":159,"p":32.0,"l":2.5,"cb":0},{"id":413,"n":"Frango, sobrecoxa, sem pele, assada","c":"Carnes","e":233,"p":29.2,"l":12.0,"cb":0},{"id":448,"n":"Iogurte, natural","c":"Laticínios","e":51,"p":4.1,"l":3.0,"cb":1.9},{"id":449,"n":"Iogurte, natural, desnatado","c":"Laticínios","e":41,"p":3.8,"l":0.3,"cb":5.8},{"id":461,"n":"Queijo, minas, frescal","c":"Laticínios","e":264,"p":17.4,"l":20.2,"cb":3.2},{"id":463,"n":"Queijo, mozarela","c":"Laticínios","e":330,"p":22.6,"l":25.2,"cb":3.0},{"id":469,"n":"Queijo, ricota","c":"Laticínios","e":140,"p":12.6,"l":8.1,"cb":3.8},{"id":486,"n":"Ovo, de galinha, clara, cozida","c":"Ovos","e":59,"p":13.4,"l":0.1,"cb":0},{"id":488,"n":"Ovo, de galinha, inteiro, cozido","c":"Ovos","e":146,"p":13.3,"l":9.5,"cb":0.6},{"id":489,"n":"Ovo, de galinha, inteiro, cru","c":"Ovos","e":143,"p":13.0,"l":8.9,"cb":1.6},{"id":557,"n":"Amendoim, grão, cru","c":"Leguminosas","e":544,"p":27.2,"l":43.9,"cb":20.3},{"id":561,"n":"Feijão, carioca, cozido","c":"Leguminosas","e":76,"p":4.8,"l":0.5,"cb":13.6},{"id":567,"n":"Feijão, preto, cozido","c":"Leguminosas","e":77,"p":4.5,"l":0.5,"cb":14.0},{"id":577,"n":"Lentilha, cozida","c":"Leguminosas","e":93,"p":6.3,"l":0.5,"cb":16.3},{"id":584,"n":"Soja, queijo (tofu)","c":"Leguminosas","e":64,"p":6.6,"l":4.0,"cb":2.1},{"id":589,"n":"Castanha-do-Brasil, crua","c":"Nozes","e":643,"p":14.5,"l":63.5,"cb":15.1},{"id":594,"n":"Linhaça, semente","c":"Nozes","e":495,"p":14.1,"l":32.3,"cb":43.3},{"id":507,"n":"Mel, de abelha","c":"Doces","e":309,"p":0,"l":0,"cb":84.0}];
const TACO_MAP = Object.fromEntries(TACO_DB.map(t => [t.id, t]));

// ── TIPOS DE TREINO disponíveis para troca ────────────────────────────────────
const WORKOUT_TYPES = [
  { type:'strength', label:'Musculação',  icon:'🏋️', color:'#22c55e',
    options:[
      { typeLabel:'Treino A – Leg Front',    detail:'Agachamento · Leg Press · Cadeira Extensora 🦵',        exercises:'Agachamento 4×8 · Leg Press 4×10 · Cadeira Extensora 4×12 · Panturrilha 5×12' },
      { typeLabel:'Treino B – Upper',        detail:'Supino · Remada · Desenvolvimento 🏋️',                  exercises:'Supino 4×8 · Pull-up 3×10 · Remada 3×8 · Desenvolvimento 3×8 · Crucifixo 3×12' },
      { typeLabel:'Treino C – Posterior',    detail:'RDL · Mesa Flexora · Hip Thrust 🍑',                    exercises:'RDL 4×8 · Mesa Flexora 3×10 · Hip Thrust 4×10 · Bulgarian Split 3×10' },
      { typeLabel:'Treino D – Braços',       detail:'Rosca · Tríceps · Elevação Lateral 💪',                 exercises:'Rosca Direta 4×10 · Rosca Alternada 3×10 · Tríceps Polia 4×10 · Tríceps Francês 3×10 · Elevação Lateral 3×12' },
      { typeLabel:'Full Body',               detail:'Treino completo do corpo 🔥',                           exercises:'Agachamento 3×8 · Supino 3×8 · Remada 3×8 · Desenvolvimento 3×8 · Rosca 3×10 · Tríceps 3×10' },
    ]
  },
  { type:'cardio',   label:'Cardio',      icon:'🚴', color:'#3b82f6',
    options:[
      { typeLabel:'Cardio – Bike',           detail:'Bicicleta ergométrica 40min 🚴',                        exercises:'Bicicleta ergométrica 40 min em intensidade moderada' },
      { typeLabel:'Cardio – Corrida',        detail:'Corrida 5-10km 🏃',                                     exercises:'Corrida leve a moderada 5–10km' },
      { typeLabel:'Cardio – HIIT',           detail:'Alta intensidade 30min ⚡',                             exercises:'HIIT: 8 rounds de 40s esforço / 20s descanso' },
      { typeLabel:'Cardio – Longo',          detail:'Bike + Corrida 1h30 🏃🚴',                              exercises:'Bicicleta 50min + Corrida 40min – sessão longa' },
      { typeLabel:'Cardio – Natação',        detail:'Natação 45min 🏊',                                      exercises:'Natação contínua 45 min ritmo moderado' },
    ]
  },
  { type:'rest',     label:'Descanso',    icon:'😴', color:'#64748b',
    options:[
      { typeLabel:'Descanso',                detail:'Recuperação ativa 😴',                                  exercises:'Nenhum treino – foco em sono e recuperação' },
      { typeLabel:'Mobilidade',              detail:'Alongamento e mobilidade 🧘',                           exercises:'Alongamento global 30min + foam roller' },
      { typeLabel:'Caminhada leve',          detail:'Caminhada leve 30min 🚶',                               exercises:'Caminhada leve 30 min ao ar livre' },
    ]
  },
];

const ALL_WORKOUT_OPTIONS = WORKOUT_TYPES.flatMap(wt =>
  wt.options.map(o => ({ ...o, type: wt.type, color: wt.color, icon: wt.icon }))
);

// ── CÁLCULO DE DIETA ──────────────────────────────────────────────────────────
const ACTIVITY_FACTORS = {
  sedentario:    { label:'Sedentário (sem exercício)',       factor:1.2   },
  leve:          { label:'Leve (1-3x/semana)',               factor:1.375 },
  moderado:      { label:'Moderado (3-5x/semana)',           factor:1.55  },
  intenso:       { label:'Intenso (6-7x/semana)',            factor:1.725 },
  muito_intenso: { label:'Muito intenso (2x/dia ou atleta)', factor:1.9   },
};
const GOAL_ADJUSTMENTS = {
  emagrecer_rapido:{ label:'Emagrecer rápido (-500 kcal)',    delta:-500, pf:2.2 },
  emagrecer:       { label:'Emagrecer (-250 kcal)',           delta:-250, pf:2.0 },
  manter:          { label:'Manter peso',                     delta:0,    pf:1.8 },
  ganhar_massa:    { label:'Ganhar massa (+250 kcal)',        delta:+250,  pf:2.2 },
  ganhar_rapido:   { label:'Ganhar massa rápido (+500 kcal)', delta:+500, pf:2.4 },
};

function calcTDEE({ weight, height, age, sex, activity }) {
  const bmr = sex==='M' ? 10*weight+6.25*height-5*age+5 : 10*weight+6.25*height-5*age-161;
  return Math.round(bmr*(ACTIVITY_FACTORS[activity]?.factor||1.55));
}
function calcTargets({ weight, tdee, goal }) {
  const adj=GOAL_ADJUSTMENTS[goal]||GOAL_ADJUSTMENTS.manter;
  const kcal=tdee+adj.delta, prot=Math.round(weight*adj.pf);
  const fat=Math.round((kcal*0.25)/9);
  return { kcal, prot, fat, carbs:Math.round((kcal-prot*4-fat*9)/4) };
}

// ── GERADOR DE PLANO ──────────────────────────────────────────────────────────
function generatePlan(profile) {
  const tdee=calcTDEE(profile), tgt=calcTargets({weight:+profile.weight,tdee,goal:profile.goal});
  const isLoss=tgt.kcal<tdee, isGain=tgt.kcal>tdee;
  const proteins=isLoss?[410,408,486,277,318]:isGain?[410,413,381,395,315]:[410,408,326,277,413];
  const carbSrcs=isLoss?[88,1,91]:[3,88,1,129];
  const veggies=[100,109,116,157], snacks=isLoss?[448,469,222,239]:[448,7,182,557], fatSrcs=[589,594,557];
  const DAYS=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
  const TYPES=['strength','strength','cardio','strength','strength','cardio','rest'];
  const DEFAULT_WORKOUTS=[
    {typeLabel:'Treino A – Leg Front',detail:'Agachamento · Leg Press 🦵',exercises:'Agachamento 4×8 · Leg Press 4×10 · Cadeira Extensora 4×12'},
    {typeLabel:'Treino B – Upper',detail:'Supino · Remada 🏋️',exercises:'Supino 4×8 · Pull-up 3×10 · Remada 3×8 · Desenvolvimento 3×8'},
    {typeLabel:'Cardio – Bike',detail:'Bicicleta ergométrica 40min 🚴',exercises:'Bicicleta ergométrica 40 min moderado'},
    {typeLabel:'Treino C – Posterior',detail:'RDL · Hip Thrust 🍑',exercises:'RDL 4×8 · Mesa Flexora 3×10 · Hip Thrust 4×10'},
    {typeLabel:'Treino D – Braços',detail:'Rosca · Tríceps 💪',exercises:'Rosca Direta 4×10 · Tríceps Polia 4×10 · Elevação Lateral 3×12'},
    {typeLabel:'Cardio – Longo',detail:'Bike + Corrida 1h30 🏃',exercises:'Bicicleta 50min + Corrida 40min'},
    {typeLabel:'Descanso',detail:'Recuperação ativa 😴',exercises:'Nenhum treino – foco em recuperação'},
  ];
  function mkFood(tacoId,qty){
    const t=TACO_MAP[tacoId]; if(!t) return null;
    const f=qty/100;
    return {id:'g'+Math.random().toString(36).slice(2),name:t.n,qty,tacoId,kcal:Math.round(t.e*f),p:+((t.p*f).toFixed(1)),l:+((t.l*f).toFixed(1)),cb:+((t.cb*f).toFixed(1))};
  }
  const protQty=Math.max(80,Math.round((tgt.prot/6)/(TACO_MAP[proteins[0]].p/100)));
  const carbQty=Math.max(80,Math.round((tgt.carbs/4)/(TACO_MAP[carbSrcs[0]].cb/100)));
  return DAYS.map((name,i)=>{
    const p1=proteins[i%proteins.length],p2=proteins[(i+2)%proteins.length];
    const c1=carbSrcs[i%carbSrcs.length],c2=carbSrcs[(i+1)%carbSrcs.length];
    const v1=veggies[i%veggies.length],ft=fatSrcs[i%fatSrcs.length];
    const isRest=TYPES[i]==='rest', burned=TYPES[i]==='cardio'?700:TYPES[i]==='strength'?400:0;
    const wk=DEFAULT_WORKOUTS[i];
    const meals=[
      {time:'07:00',name:'Café da Manhã',icon:'🌅',foods:[mkFood(7,Math.round(tgt.kcal*0.22*0.35/(TACO_MAP[7].e/100))),mkFood(488,Math.round(tgt.kcal*0.22*0.30/(TACO_MAP[488].e/100))),mkFood(182,120),mkFood(448,150)].filter(Boolean)},
      {time:'10:00',name:'Lanche 1',icon:'🥛',foods:[mkFood(snacks[0],200),mkFood(snacks[2]||222,150),mkFood(ft,15)].filter(Boolean)},
      {time:'13:00',name:'Almoço',icon:'🍽️',foods:[mkFood(p1,Math.round(protQty*1.1)),mkFood(c1,Math.round(carbQty*1.2)),mkFood(561,100),mkFood(v1,100)].filter(Boolean)},
      !isRest&&{time:'16:30',name:'Pré-Treino',icon:'⚡',foods:[mkFood(c2,Math.round(carbQty*0.8)),mkFood(p2,Math.round(protQty*0.7))].filter(Boolean)},
      {time:isRest?'19:00':'20:00',name:isRest?'Jantar':'Pós-Treino / Jantar',icon:'💪',foods:[mkFood(p2,Math.round(protQty)),mkFood(c1,Math.round(carbQty*0.9)),mkFood(v1,80)].filter(Boolean)},
      {time:'22:00',name:'Ceia',icon:'🌙',foods:[mkFood(488,100),mkFood(469,60)].filter(Boolean)},
    ].filter(Boolean);
    return {id:i,name,short:name.slice(0,3).toUpperCase(),fullName:name+(i<5?'-Feira':''),
      type:TYPES[i],typeLabel:wk.typeLabel,detail:wk.detail,exercises:wk.exercises,
      calories:meals.reduce((s,m)=>s+m.foods.reduce((a,f)=>a+f.kcal,0),0),burned,meals};
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function searchTACO(query,limit=9){
  if(!query||query.length<2) return [];
  const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ');
  const terms=norm(query).split(' ').filter(Boolean);
  return TACO_DB.map(t=>({...t,score:terms.reduce((s,w)=>norm(t.n).includes(w)?s+1:s-1,0)}))
    .filter(t=>t.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S={
  wrap:   {minHeight:'100vh',background:'#0a0f1e',color:'#f1f5f9',fontFamily:'system-ui,sans-serif',paddingBottom:80},
  header: {background:'linear-gradient(135deg,#1e293b,#0f172a)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100},
  card:   {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,margin:'0 16px 12px',padding:'16px'},
  input:  {width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#f1f5f9',fontSize:14,padding:'10px 12px',outline:'none',boxSizing:'border-box'},
  select: {width:'100%',background:'rgba(30,41,59,0.9)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,color:'#f1f5f9',fontSize:14,padding:'10px 12px',outline:'none',boxSizing:'border-box'},
  label:  {fontSize:11,fontWeight:700,color:'#475569',marginBottom:6,display:'block',letterSpacing:.8},
  badge:  c=>({background:c+'22',color:c,padding:'2px 7px',borderRadius:6,fontWeight:700,fontSize:10}),
  btn:    (c='#3b82f6')=>({background:c,border:'none',borderRadius:10,color:'#fff',padding:'10px 18px',fontSize:13,fontWeight:700,cursor:'pointer'}),
  // bottom nav
  nav:    {position:'fixed',bottom:0,left:0,right:0,background:'#0f172a',borderTop:'1px solid rgba(255,255,255,0.08)',display:'flex',zIndex:100},
  navBtn: active=>({flex:1,background:'none',border:'none',padding:'12px 0 10px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3,color:active?'#22c55e':'#475569'}),
};

// ── AUTH PAGES ────────────────────────────────────────────────────────────────
function AuthWrap({children}){
  return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a0f1e,#0f172a)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:'100%',maxWidth:400,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:24,padding:32}}>{children}</div>
    </div>
  );
}
function LoginPage({onSwitch,onLogin}){
  const [email,setEmail]=useState(''),[ password,setPassword]=useState(''),[ err,setErr]=useState(''),[ loading,setLoading]=useState(false);
  async function handle(){
    if(!email||!password){setErr('Preencha todos os campos');return;}
    setLoading(true);
    try{await signIn({email,password});onLogin();}catch(e){setErr(e.message||'Email ou senha incorretos');}finally{setLoading(false);}
  }
  return(
    <AuthWrap>
      <div style={{textAlign:'center',marginBottom:28}}><div style={{fontSize:48}}>💪</div><div style={{fontSize:24,fontWeight:900,color:'#f1f5f9'}}>NutriPlan</div><div style={{fontSize:12,color:'#475569',marginTop:4}}>Tabela TACO · NEPA/UNICAMP</div></div>
      <div style={{fontSize:20,fontWeight:800,color:'#f1f5f9',textAlign:'center',marginBottom:24}}>Bem-vindo de volta</div>
      <label style={S.label}>📧 E-MAIL</label>
      <input style={{...S.input,marginBottom:12}} type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}/>
      <label style={S.label}>🔒 SENHA</label>
      <input style={{...S.input,marginBottom:16}} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handle()}/>
      {err&&<div style={{color:'#ef4444',fontSize:12,marginBottom:12,textAlign:'center'}}>{err}</div>}
      <button style={{...S.btn('#22c55e'),width:'100%',padding:13,marginBottom:16,opacity:loading?.6:1}} onClick={handle} disabled={loading}>{loading?'⏳ Entrando...':'🚀 Entrar'}</button>
      <div style={{textAlign:'center',fontSize:13,color:'#475569'}}>Não tem conta?{' '}<button style={{background:'none',border:'none',color:'#60a5fa',cursor:'pointer',fontWeight:700}} onClick={onSwitch}>Cadastrar →</button></div>
    </AuthWrap>
  );
}
function RegisterPage({onSwitch,onLogin}){
  const [form,setForm]=useState({name:'',email:'',password:'',confirm:''}),[err,setErr]=useState(''),[loading,setLoading]=useState(false);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  async function handle(){
    if(!form.name||!form.email||!form.password){setErr('Preencha todos os campos');return;}
    if(form.password.length<6){setErr('Senha mínima: 6 caracteres');return;}
    if(form.password!==form.confirm){setErr('Senhas não conferem');return;}
    setLoading(true);
    try{await signUp({email:form.email,password:form.password,name:form.name});onLogin();}catch(e){setErr(e.message||'Erro ao criar conta');}finally{setLoading(false);}
  }
  return(
    <AuthWrap>
      <div style={{textAlign:'center',marginBottom:24}}><div style={{fontSize:48}}>🥗</div><div style={{fontSize:24,fontWeight:900,color:'#f1f5f9'}}>NutriPlan</div></div>
      <div style={{fontSize:20,fontWeight:800,color:'#f1f5f9',textAlign:'center',marginBottom:24}}>Criar conta</div>
      {[['name','👤','NOME','Seu nome'],['email','📧','E-MAIL','seu@email.com'],['password','🔒','SENHA','Mín. 6 caracteres'],['confirm','🔒','CONFIRMAR','Repita a senha']].map(([k,ic,lb,ph])=>(
        <div key={k} style={{marginBottom:12}}><label style={S.label}>{ic} {lb}</label><input style={S.input} type={k==='password'||k==='confirm'?'password':'text'} placeholder={ph} value={form[k]} onChange={set(k)}/></div>
      ))}
      {err&&<div style={{color:'#ef4444',fontSize:12,margin:'8px 0',textAlign:'center'}}>{err}</div>}
      <button style={{...S.btn('#22c55e'),width:'100%',padding:13,marginTop:8,marginBottom:16,opacity:loading?.6:1}} onClick={handle} disabled={loading}>{loading?'⏳ Criando...':'✅ Criar Conta'}</button>
      <div style={{textAlign:'center',fontSize:13,color:'#475569'}}>Já tem conta?{' '}<button style={{background:'none',border:'none',color:'#60a5fa',cursor:'pointer',fontWeight:700}} onClick={onSwitch}>Entrar →</button></div>
    </AuthWrap>
  );
}

// ── PERFIL ────────────────────────────────────────────────────────────────────
function ProfilePage({userId,initialProfile,onSave,onBack}){
  const [form,setForm]=useState(initialProfile||{weight:'',height:'',age:'',sex:'M',activity:'moderado',goal:'manter'});
  const [loading,setLoading]=useState(false),[done,setDone]=useState(false);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const tdee=form.weight&&form.height&&form.age?calcTDEE({weight:+form.weight,height:+form.height,age:+form.age,sex:form.sex,activity:form.activity}):null;
  const targets=tdee?calcTargets({weight:+form.weight,tdee,goal:form.goal}):null;
  async function handle(){
    if(!form.weight||!form.height||!form.age){alert('Preencha peso, altura e idade');return;}
    setLoading(true);
    try{
      await supabase.from('profiles').update({weight:+form.weight,height:+form.height,age:+form.age,sex:form.sex,activity:form.activity,goal:form.goal}).eq('id',userId);
      const newPlan=generatePlan({weight:+form.weight,height:+form.height,age:+form.age,sex:form.sex,activity:form.activity,goal:form.goal});
      await saveUserPlan(userId,newPlan);
      setDone(true);setTimeout(()=>onSave(newPlan,form),1200);
    }catch(e){alert('Erro: '+e.message);}finally{setLoading(false);}
  }
  return(
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>👤 Meu Perfil</div>
        {onBack&&<button style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#94a3b8',padding:'6px 12px',fontSize:12,cursor:'pointer'}} onClick={onBack}>← Voltar</button>}
      </div>
      <div style={{padding:'16px 16px 0'}}><div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:14,padding:14,marginBottom:4,fontSize:13,color:'#a5b4fc'}}>💡 Preencha seus dados para gerar um plano alimentar personalizado com alimentos da Tabela TACO.</div></div>
      <div style={S.card}>
        <div style={{fontSize:12,fontWeight:700,color:'#94a3b8',marginBottom:14,letterSpacing:.8}}>📏 DADOS FÍSICOS</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
          {[['weight','PESO (kg)','ex: 80'],['height','ALTURA (cm)','ex: 175'],['age','IDADE','ex: 25']].map(([k,lb,ph])=>(
            <div key={k}><label style={S.label}>{lb}</label><input style={S.input} type="number" placeholder={ph} value={form[k]} onChange={set(k)}/></div>
          ))}
          <div><label style={S.label}>SEXO</label><select style={S.select} value={form.sex} onChange={set('sex')}><option value="M">Masculino</option><option value="F">Feminino</option></select></div>
        </div>
        <div style={{marginBottom:12}}><label style={S.label}>🏃 NÍVEL DE ATIVIDADE</label><select style={S.select} value={form.activity} onChange={set('activity')}>{Object.entries(ACTIVITY_FACTORS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label style={S.label}>🎯 OBJETIVO</label><select style={S.select} value={form.goal} onChange={set('goal')}>{Object.entries(GOAL_ADJUSTMENTS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
      </div>
      {targets&&(
        <div style={{...S.card,background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#4ade80',marginBottom:12,letterSpacing:.8}}>📊 SEU PLANO CALCULADO</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10}}>
            {[['🔥','TDEE',tdee+' kcal'],['🍽️','Meta',targets.kcal+' kcal'],['🥩','Proteína',targets.prot+'g'],['🫒','Gordura',targets.fat+'g'],['🍚','Carbs',targets.carbs+'g'],['⚖️','IMC',(+form.weight/(((+form.height)/100)**2)).toFixed(1)]].map(([ic,lb,vl])=>(
              <div key={lb} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                <div style={{fontSize:20,marginBottom:4}}>{ic}</div>
                <div style={{fontSize:14,fontWeight:800,color:'#f1f5f9'}}>{vl}</div>
                <div style={{fontSize:9,color:'#475569',marginTop:2}}>{lb}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:'#475569',textAlign:'center'}}>Fórmula Mifflin-St Jeor · 30% proteína · 25% gordura · 45% carboidrato</div>
        </div>
      )}
      {done
        ?<div style={{...S.card,textAlign:'center',background:'rgba(34,197,94,0.1)'}}><div style={{fontSize:40,marginBottom:8}}>🎉</div><div style={{color:'#4ade80',fontWeight:700,fontSize:16}}>Plano gerado com sucesso!</div></div>
        :<div style={{padding:'0 16px 16px'}}><button style={{...S.btn('#22c55e'),width:'100%',padding:14,fontSize:15,opacity:loading?.6:1}} onClick={handle} disabled={loading}>{loading?'⏳ Gerando plano...':'✅ Salvar e Gerar Plano Semanal'}</button></div>
      }
    </div>
  );
}

// ── MODAL TROCA DE TREINO ─────────────────────────────────────────────────────
function WorkoutModal({day,onSelect,onClose}){
  const [tab,setTab]=useState(day.type);
  const [mode,setMode]=useState('list');
  const [customName,setCustomName]=useState(day.typeLabel||''  );
  const [customDetail,setCustomDetail]=useState(day.detail||''  );
  const [customExercises,setCustomExercises]=useState(day.exercises||''  );
  const group=WORKOUT_TYPES.find(w=>w.type===tab)||WORKOUT_TYPES[0];
  function handleCustomSave(){
    if(!customName.trim()) return;
    onSelect({type:tab,color:group.color,typeLabel:customName,detail:customDetail,exercises:customExercises});
  }
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:300,display:'flex',alignItems:'flex-end'}} onClick={onClose}>
      <div style={{background:'#1e293b',borderRadius:'20px 20px 0 0',width:'100%',padding:20,maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:800,color:'#f1f5f9'}}>🔄 Editar Treino — {day.fullName}</div>
          <button style={S.btn('#ef4444')} onClick={onClose}>✕</button>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {[['list','📋 Lista'],['custom','✏️ Personalizar']].map(([m,lb])=>(
            <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:'8px 0',borderRadius:10,border:'1px solid',cursor:'pointer',fontSize:13,fontWeight:700,
              ...(mode===m?{background:'#6366f122',borderColor:'#6366f1',color:'#818cf8'}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.08)',color:'#475569'})}}>
              {lb}
            </button>
          ))}
        </div>
        {mode==='list'?(
          <>
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {WORKOUT_TYPES.map(wt=>(
                <button key={wt.type} onClick={()=>setTab(wt.type)} style={{flex:1,padding:'8px 0',borderRadius:10,border:'1px solid',cursor:'pointer',fontSize:13,fontWeight:700,
                  ...(tab===wt.type?{background:wt.color+'22',borderColor:wt.color,color:wt.color}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.08)',color:'#475569'})}}>
                  {wt.icon} {wt.label}
                </button>
              ))}
            </div>
            <div style={{overflowY:'auto',flex:1,display:'flex',flexDirection:'column',gap:8}}>
              {group.options.map((opt,i)=>{
                const isActive=day.typeLabel===opt.typeLabel;
                return(
                  <div key={i} onClick={()=>onSelect({type:group.type,color:group.color,...opt})}
                    style={{padding:'12px 14px',borderRadius:12,cursor:'pointer',border:'1px solid',
                      ...(isActive?{background:group.color+'18',borderColor:group.color}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.06)'})}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                      <div style={{fontSize:13,fontWeight:700,color:isActive?group.color:'#f1f5f9'}}>{opt.typeLabel}</div>
                      {isActive&&<span style={S.badge(group.color)}>✓ Ativo</span>}
                    </div>
                    <div style={{fontSize:12,color:'#64748b',marginBottom:4}}>{opt.detail}</div>
                    <div style={{fontSize:11,color:'#475569',lineHeight:1.5}}>{opt.exercises}</div>
                  </div>
                );
              })}
            </div>
          </>
        ):(
          <div style={{overflowY:'auto',flex:1,display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={S.label}>🏷️ TIPO DE TREINO</label>
              <div style={{display:'flex',gap:8}}>
                {WORKOUT_TYPES.map(wt=>(
                  <button key={wt.type} onClick={()=>setTab(wt.type)} style={{flex:1,padding:'8px 0',borderRadius:10,border:'1px solid',cursor:'pointer',fontSize:18,
                    ...(tab===wt.type?{background:wt.color+'22',borderColor:wt.color}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.08)'})}}>
                    {wt.icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={S.label}>📝 NOME DO TREINO</label>
              <input style={S.input} value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Ex: Treino A – Peito e Tríceps"/>
            </div>
            <div>
              <label style={S.label}>📋 DESCRIÇÃO CURTA</label>
              <input style={S.input} value={customDetail} onChange={e=>setCustomDetail(e.target.value)} placeholder="Ex: Supino · Tríceps · Ombro 🏋️"/>
            </div>
            <div>
              <label style={S.label}>💪 EXERCÍCIOS E SÉRIES</label>
              <textarea style={{...S.input,minHeight:120,resize:'vertical',lineHeight:1.6}} value={customExercises} onChange={e=>setCustomExercises(e.target.value)}
                placeholder={"Ex:\nSupino reto 4×8\nSupino inclinado 3×10\nCrucifixo 3×12\nTríceps polia 4×10"}/>
              <div style={{fontSize:11,color:'#475569',marginTop:4}}>Um exercício por linha com séries e repetições</div>
            </div>
            <button style={{...S.btn('#22c55e'),padding:13,fontSize:14}} onClick={handleCustomSave}>✅ Salvar Treino Personalizado</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FOOD SEARCH MODAL ─────────────────────────────────────────────────────────
function FoodModal({onSelect,onClose}){
  const [q,setQ]=useState('');
  const results=useMemo(()=>searchTACO(q),[q]);
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'flex-end'}} onClick={onClose}>
      <div style={{background:'#1e293b',borderRadius:'20px 20px 0 0',width:'100%',padding:20,maxHeight:'80vh',overflow:'hidden',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',gap:10,marginBottom:16}}>
          <input autoFocus style={S.input} placeholder="🔍 Buscar alimento TACO..." value={q} onChange={e=>setQ(e.target.value)}/>
          <button style={S.btn('#ef4444')} onClick={onClose}>✕</button>
        </div>
        <div style={{overflowY:'auto',flex:1}}>
          {q.length<2&&<div style={{color:'#475569',textAlign:'center',padding:20,fontSize:13}}>Digite 2+ letras para buscar</div>}
          {results.map(t=>(
            <div key={t.id} style={{padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}} onClick={()=>onSelect(t)}>
              <div style={{fontSize:13,color:'#f1f5f9',fontWeight:600,marginBottom:4}}>{t.n}</div>
              <div style={{display:'flex',gap:6,fontSize:11}}>
                <span style={S.badge('#f59e0b')}>{t.e} kcal</span>
                <span style={S.badge('#3b82f6')}>P {t.p}g</span>
                <span style={S.badge('#f97316')}>G {t.l}g</span>
                <span style={S.badge('#a78bfa')}>C {t.cb}g</span>
                <span style={{color:'#475569'}}>por 100g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LISTA DE COMPRAS ──────────────────────────────────────────────────────────
function ShoppingList({items,onToggle,onRemove,onClear}){
  const pending=items.filter(i=>!i.checked), done=items.filter(i=>i.checked);
  return(
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>🛒 Lista de Compras</div>
        {done.length>0&&<button style={{...S.btn('#475569'),padding:'6px 12px',fontSize:12}} onClick={onClear}>Limpar comprados</button>}
      </div>

      {items.length===0?(
        <div style={{padding:48,textAlign:'center'}}>
          <div style={{fontSize:56,marginBottom:16}}>🛒</div>
          <div style={{fontSize:18,fontWeight:700,color:'#f1f5f9',marginBottom:8}}>Lista vazia</div>
          <div style={{color:'#475569',fontSize:14}}>Toque em 🛒 ao lado de qualquer alimento no plano para adicioná-lo aqui.</div>
        </div>
      ):(
        <>
          {pending.length>0&&(
            <div style={{...S.card,marginTop:16}}>
              <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:.8}}>A COMPRAR ({pending.length})</div>
              {pending.map(item=>(
                <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <button onClick={()=>onToggle(item.id)} style={{width:22,height:22,borderRadius:6,border:'2px solid #22c55e',background:'transparent',cursor:'pointer',flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,color:'#f1f5f9',fontWeight:600}}>{item.name}</div>
                    <div style={{fontSize:11,color:'#475569',marginTop:2}}>{item.qty}g · {item.kcal} kcal</div>
                  </div>
                  <button onClick={()=>onRemove(item.id)} style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:16,padding:'0 4px'}}>✕</button>
                </div>
              ))}
            </div>
          )}
          {done.length>0&&(
            <div style={{...S.card,opacity:.6}}>
              <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:.8}}>COMPRADO ({done.length})</div>
              {done.map(item=>(
                <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <button onClick={()=>onToggle(item.id)} style={{width:22,height:22,borderRadius:6,border:'2px solid #22c55e',background:'#22c55e22',cursor:'pointer',flexShrink:0,fontSize:13}}>✓</button>
                  <div style={{flex:1,textDecoration:'line-through',color:'#475569',fontSize:13}}>{item.name}</div>
                  <button onClick={()=>onRemove(item.id)} style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:16,padding:'0 4px'}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div style={{height:80}}/>
    </div>
  );
}


// ── WORKOUT PROFILES PAGE ─────────────────────────────────────────────────────
function WorkoutProfilesPage({profiles,plan,onSave,onDelete,onApplyToDay,onBack,tab,setTab,cartCount,onOpenProfile,onLogout}){
  const [editing,setEditing]=useState(null); // null | profile object
  const [showNew,setShowNew]=useState(false);

  function EditForm({initial,onDone}){
    const [form,setForm]=useState(initial||{id:'wp'+Date.now(),type:'strength',typeLabel:'',exercises:''});
    const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
    const group=WORKOUT_TYPES.find(w=>w.type===form.type)||WORKOUT_TYPES[0];
    return(
      <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:16,padding:16,marginBottom:12}}>
        <div style={{marginBottom:10}}>
          <label style={S.label}>🏷️ TIPO</label>
          <div style={{display:'flex',gap:8}}>
            {WORKOUT_TYPES.map(wt=>(
              <button key={wt.type} onClick={()=>setForm(f=>({...f,type:wt.type}))} style={{flex:1,padding:'8px 0',borderRadius:10,border:'1px solid',cursor:'pointer',fontSize:18,
                ...(form.type===wt.type?{background:wt.color+'22',borderColor:wt.color}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.08)'})}}>
                {wt.icon}
              </button>
            ))}
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <label style={S.label}>📝 NOME DO TREINO</label>
          <input style={S.input} value={form.typeLabel} onChange={set('typeLabel')} placeholder="Ex: Treino A – Peito e Tríceps"/>
        </div>
        <div style={{marginBottom:12}}>
          <label style={S.label}>💪 EXERCÍCIOS E SÉRIES</label>
          <textarea style={{...S.input,minHeight:130,resize:'vertical',lineHeight:1.8}} value={form.exercises} onChange={set('exercises')}
            placeholder={"Supino reto 4×8\nSupino inclinado 3×10\nCrucifixo 3×12\nTríceps polia 4×10\nTríceps francês 3×10"}/>
          <div style={{fontSize:11,color:'#475569',marginTop:4}}>Um exercício por linha</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button style={{...S.btn('#22c55e'),flex:1,padding:11}} onClick={()=>{if(!form.typeLabel.trim())return;onSave({...form,color:WORKOUT_TYPES.find(w=>w.type===form.type)?.color||'#22c55e'});onDone();}}>✅ Salvar</button>
          <button style={{...S.btn('#475569'),padding:11}} onClick={onDone}>Cancelar</button>
        </div>
      </div>
    );
  }

  const DAYS_SHORT=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];

  return(
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>💪 Meus Treinos</div>
        <button style={{...S.btn('#22c55e'),padding:'7px 14px',fontSize:13}} onClick={()=>setShowNew(true)}>+ Novo</button>
      </div>

      <div style={{padding:'16px 16px 100px'}}>
        {showNew&&<EditForm initial={null} onDone={()=>setShowNew(false)}/>}

        {profiles.length===0&&!showNew&&(
          <div style={{textAlign:'center',padding:'48px 0'}}>
            <div style={{fontSize:56,marginBottom:12}}>💪</div>
            <div style={{fontSize:16,fontWeight:700,color:'#f1f5f9',marginBottom:8}}>Nenhum perfil criado</div>
            <div style={{color:'#475569',fontSize:13,marginBottom:24}}>Crie perfis de treino e aplique a qualquer dia da semana.</div>
            <button style={{...S.btn('#22c55e'),padding:'12px 28px'}} onClick={()=>setShowNew(true)}>+ Criar primeiro treino</button>
          </div>
        )}

        {profiles.map(p=>{
          const color=WORKOUT_TYPES.find(w=>w.type===p.type)?.color||'#22c55e';
          const daysUsing=plan?plan.map((d,i)=>d.typeLabel===p.typeLabel?i:-1).filter(i=>i>=0):[];
          if(editing?.id===p.id) return <EditForm key={p.id} initial={p} onDone={()=>setEditing(null)}/>;
          return(
            <div key={p.id} style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${color}33`,borderRadius:16,padding:16,marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:color}}>{p.typeLabel}</div>
                  <div style={{fontSize:11,color:'#475569',marginTop:2}}>{WORKOUT_TYPES.find(w=>w.type===p.type)?.label}</div>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button style={{...S.btn('#1e3a5f'),padding:'5px 10px',fontSize:12}} onClick={()=>setEditing(p)}>✏️</button>
                  <button style={{...S.btn('#3f1515'),padding:'5px 10px',fontSize:12}} onClick={()=>onDelete(p.id)}>🗑️</button>
                </div>
              </div>
              {p.exercises&&(
                <div style={{fontSize:12,color:'#94a3b8',lineHeight:1.8,whiteSpace:'pre-line',marginBottom:10,padding:'8px 10px',background:'rgba(0,0,0,0.2)',borderRadius:8}}>
                  {p.exercises}
                </div>
              )}
              {daysUsing.length>0&&(
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
                  {daysUsing.map(i=><span key={i} style={{...S.badge(color),fontSize:11}}>{DAYS_SHORT[i]}</span>)}
                  <span style={{fontSize:11,color:'#475569'}}>usando este perfil</span>
                </div>
              )}
              <div>
                <div style={{fontSize:11,color:'#475569',marginBottom:6,fontWeight:700}}>APLICAR AO DIA:</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {DAYS_SHORT.map((d,i)=>{
                    const isUsing=plan?.[i]?.typeLabel===p.typeLabel;
                    return(
                      <button key={i} onClick={()=>onApplyToDay(p.id,i)}
                        style={{padding:'5px 10px',borderRadius:8,border:'1px solid',cursor:'pointer',fontSize:12,fontWeight:700,
                          ...(isUsing?{background:color+'22',borderColor:color,color:color}:{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.08)',color:'#475569'})}}>
                        {d}{isUsing?' ✓':''}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <nav style={S.nav}>
        {[['plan','📋','Plano'],['shop','🛒','Compras'],['workout','💪','Treinos']].map(([t,ic,lb])=>(
          <button key={t} style={S.navBtn(tab===t)} onClick={()=>setTab(t)}>
            <span style={{fontSize:20,position:'relative'}}>
              {ic}
              {t==='shop'&&cartCount>0&&<span style={{position:'absolute',top:-4,right:-6,background:'#ef4444',color:'#fff',borderRadius:99,fontSize:9,fontWeight:900,padding:'1px 4px',lineHeight:1.4}}>{cartCount}</span>}
            </span>
            <span style={{fontSize:10,fontWeight:700}}>{lb}</span>
          </button>
        ))}
        <button style={S.navBtn(false)} onClick={onOpenProfile}>
          <span style={{fontSize:20}}>👤</span>
          <span style={{fontSize:10,fontWeight:700}}>Perfil</span>
        </button>
        <button style={S.navBtn(false)} onClick={onLogout}>
          <span style={{fontSize:20}}>🚪</span>
          <span style={{fontSize:10,fontWeight:700}}>Sair</span>
        </button>
      </nav>
    </div>
  );
}

// ── MEAL PLAN APP ─────────────────────────────────────────────────────────────
function MealPlanApp({onLogout,userId,onOpenProfile}){
  const [plan,setPlan]           = useState(null);
  const [tab,setTab]             = useState('plan');   // 'plan' | 'shop' | 'workout'
  const [dayIdx,setDayIdx]       = useState(new Date().getDay()===0?6:new Date().getDay()-1);
  const [editFood,setEditFood]   = useState(null);
  const [editMeal,setEditMeal]   = useState(null); // {mi, field} field: 'name'|'time'
  const [showSearch,setShowSearch]   = useState(null);
  const [showWorkout,setShowWorkout] = useState(false);
  const [showMealCount,setShowMealCount] = useState(false);
  const [shopping,setShopping]   = useState([]);        // [{id,name,qty,kcal,checked}]
  const [saving,setSaving]       = useState(false);
  const [saveMsg,setSaveMsg]     = useState('');
  const [workoutProfiles,setWorkoutProfiles] = useState([]);
  const timer=useRef(null);
  const timerProfiles=useRef(null);

  // Carrega plano e lista do Supabase
  useEffect(()=>{
    loadUserPlan(userId).then(saved=>{
      if(saved&&saved.length) setPlan(saved); else setPlan([]);
    }).catch(()=>setPlan([]));
    // Carrega lista de compras e perfis de treino
    supabase.from('user_plans').select('plan_data').eq('user_id',userId).maybeSingle()
      .then(({data})=>{
        if(data?.plan_data?.shopping) setShopping(data.plan_data.shopping);
        if(data?.plan_data?.workoutProfiles) setWorkoutProfiles(data.plan_data.workoutProfiles);
      });
  },[userId]);

  // Auto-save plano
  useEffect(()=>{
    if(!plan||!plan.length||!userId) return;
    clearTimeout(timer.current);
    timer.current=setTimeout(async()=>{
      setSaving(true);
      try{await saveUserPlan(userId,plan);setSaveMsg('✅ Salvo');setTimeout(()=>setSaveMsg(''),2000);}
      catch{setSaveMsg('❌ Erro');}finally{setSaving(false);}
    },2000);
    return()=>clearTimeout(timer.current);
  },[plan,userId]);

  // Auto-save lista de compras separadamente
  useEffect(()=>{
    if(!userId) return;
    const t=setTimeout(()=>{
      supabase.from('user_plans').upsert({user_id:userId,plan_data:{...(plan||[]),shopping,workoutProfiles},updated_at:new Date().toISOString()},{onConflict:'user_id'});
    },1500);
    return()=>clearTimeout(t);
  },[shopping,userId]);

  // Auto-save workoutProfiles
  useEffect(()=>{
    if(!userId) return;
    clearTimeout(timerProfiles.current);
    timerProfiles.current=setTimeout(()=>{
      supabase.from('user_plans').upsert({user_id:userId,plan_data:{...(plan||[]),shopping,workoutProfiles},updated_at:new Date().toISOString()},{onConflict:'user_id'});
    },1500);
    return()=>clearTimeout(timerProfiles.current);
  },[workoutProfiles,userId]);

  // ── helpers de plano
  function updateQty(mi,fid,qty){
    setPlan(prev=>prev.map((d,di)=>{
      if(di!==dayIdx) return d;
      return {...d,meals:d.meals.map((m,mii)=>{
        if(mii!==mi) return m;
        return {...m,foods:m.foods.map(f=>{
          if(f.id!==fid) return f;
          const u={...f,qty};
          if(f.tacoId&&TACO_MAP[f.tacoId]){const t=TACO_MAP[f.tacoId],fc=qty/100;u.kcal=Math.round(t.e*fc);u.p=+((t.p*fc).toFixed(1));u.l=+((t.l*fc).toFixed(1));u.cb=+((t.cb*fc).toFixed(1));}
          return u;
        })};
      })};
    }));
  }
  function removeFood(mi,fid){
    setPlan(prev=>prev.map((d,di)=>di!==dayIdx?d:{...d,meals:d.meals.map((m,mii)=>mii!==mi?m:{...m,foods:m.foods.filter(f=>f.id!==fid)})}));
  }
  function addFood(mi,t){
    const nf={id:'a'+Math.random().toString(36).slice(2),name:t.n,qty:100,tacoId:t.id,kcal:Math.round(t.e),p:t.p,l:t.l,cb:t.cb};
    setPlan(prev=>prev.map((d,di)=>di!==dayIdx?d:{...d,meals:d.meals.map((m,mii)=>mii!==mi?m:{...m,foods:[...m.foods,nf]})}));
    setShowSearch(null);
  }

  function updateMeal(mi,field,value){
    setPlan(prev=>prev.map((d,di)=>di!==dayIdx?d:{...d,meals:d.meals.map((m,mii)=>mii!==mi?m:{...m,[field]:value})}));
  }

  // ── helpers carrinho
  function addToCart(food){
    if(shopping.find(i=>i.name===food.name)) return; // evita duplicata
    setShopping(prev=>[...prev,{id:food.id+'c'+Date.now(),name:food.name,qty:food.qty,kcal:food.kcal,checked:false}]);
  }
  function toggleCart(id){ setShopping(prev=>prev.map(i=>i.id===id?{...i,checked:!i.checked}:i)); }
  function removeCart(id){ setShopping(prev=>prev.filter(i=>i.id!==id)); }
  function clearDone(){    setShopping(prev=>prev.filter(i=>!i.checked)); }

  // ── troca treino — propaga para todos os dias com mesmo typeLabel
  function applyWorkout(opt){
    const prevLabel=plan[dayIdx]?.typeLabel;
    setPlan(prev=>prev.map(d=>{
      // Atualiza o dia atual sempre; atualiza outros dias se tinham o mesmo perfil
      if(d.typeLabel===prevLabel||plan.indexOf(d)===dayIdx){
        return {...d,type:opt.type,typeLabel:opt.typeLabel,exercises:opt.exercises||''};
      }
      return d;
    }));
    // Upsert perfil na lista de perfis salvos
    setWorkoutProfiles(prev=>{
      const idx=prev.findIndex(p=>p.typeLabel===opt.typeLabel);
      if(idx>=0){ const next=[...prev]; next[idx]={...opt}; return next; }
      return [...prev,{...opt,id:'wp'+Date.now()}];
    });
    setShowWorkout(false);
  }

  // ── criar/editar perfil de treino
  function saveProfile(profile){
    setWorkoutProfiles(prev=>{
      const idx=prev.findIndex(p=>p.id===profile.id);
      if(idx>=0){ const next=[...prev]; next[idx]=profile; return next; }
      return [...prev,profile];
    });
    // Propaga exercícios para dias que usam esse perfil
    if(profile.typeLabel){
      setPlan(prev=>prev.map(d=>d.typeLabel===profile.typeLabel?{...d,type:profile.type,exercises:profile.exercises||''}:d));
    }
  }

  function deleteProfile(id){
    setWorkoutProfiles(prev=>prev.filter(p=>p.id!==id));
  }

  // ── redistribuir refeições
  function redistributeMeals(count){
    const TEMPLATES={
      2:[
        {time:'12:00',name:'Almoço',icon:'🍽️'},
        {time:'19:00',name:'Jantar',icon:'🌙'},
      ],
      3:[
        {time:'07:00',name:'Café da Manhã',icon:'🌅'},
        {time:'13:00',name:'Almoço',icon:'🍽️'},
        {time:'19:00',name:'Jantar',icon:'🌙'},
      ],
      4:[
        {time:'07:00',name:'Café da Manhã',icon:'🌅'},
        {time:'12:00',name:'Almoço',icon:'🍽️'},
        {time:'16:00',name:'Lanche',icon:'🥛'},
        {time:'20:00',name:'Jantar',icon:'🌙'},
      ],
      5:[
        {time:'07:00',name:'Café da Manhã',icon:'🌅'},
        {time:'10:00',name:'Lanche 1',icon:'🥛'},
        {time:'13:00',name:'Almoço',icon:'🍽️'},
        {time:'16:30',name:'Pré-Treino',icon:'⚡'},
        {time:'20:00',name:'Pós-Treino / Jantar',icon:'💪'},
      ],
      6:[
        {time:'07:00',name:'Café da Manhã',icon:'🌅'},
        {time:'10:00',name:'Lanche 1',icon:'🥛'},
        {time:'13:00',name:'Almoço',icon:'🍽️'},
        {time:'16:30',name:'Pré-Treino',icon:'⚡'},
        {time:'20:00',name:'Pós-Treino / Jantar',icon:'💪'},
        {time:'22:00',name:'Ceia',icon:'🌙'},
      ],
    };
    setPlan(prev=>prev.map((d,di)=>{
      if(di!==dayIdx) return d;
      // Coleta todos os alimentos do dia atual
      const allFoods=d.meals.flatMap(m=>m.foods);
      const tmpl=TEMPLATES[count]||TEMPLATES[5];
      // Distribui alimentos igualmente entre as refeições
      const newMeals=tmpl.map((t,ti)=>({
        ...t,
        foods:allFoods.filter((_,fi)=>fi%tmpl.length===ti),
      }));
      return {...d,meals:newMeals};
    }));
    setShowMealCount(false);
  }

  const dayTotals=useMemo(()=>{
    const day=plan?.[dayIdx];
    if(!day) return {kcal:0,p:0,l:0,cb:0};
    const t={kcal:0,p:0,l:0,cb:0};
    day.meals.forEach(m=>m.foods.forEach(f=>{t.kcal+=f.kcal;t.p+=f.p;t.l+=f.l;t.cb+=f.cb;}));
    return {kcal:t.kcal,p:+t.p.toFixed(1),l:+t.l.toFixed(1),cb:+t.cb.toFixed(1)};
  },[plan,dayIdx]);

  const cartCount=shopping.filter(i=>!i.checked).length;

  // ── early returns (after all hooks)
  if(!plan) return(
    <div style={{minHeight:'100vh',background:'#0a0f1e',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}><div style={{fontSize:48,marginBottom:12}}>💪</div><div style={{color:'#475569'}}>Carregando...</div></div>
    </div>
  );
  if(!plan.length) return(
    <div style={S.wrap}>
      <div style={S.header}><div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>💪 NutriPlan</div><button style={{background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#94a3b8',padding:'6px 12px',fontSize:12,cursor:'pointer'}} onClick={onLogout}>Sair</button></div>
      <div style={{padding:32,textAlign:'center'}}><div style={{fontSize:64,marginBottom:16}}>👤</div><div style={{fontSize:20,fontWeight:800,color:'#f1f5f9',marginBottom:8}}>Configure seu perfil</div><div style={{color:'#475569',fontSize:14,marginBottom:28}}>Informe seus dados para gerar um plano alimentar personalizado</div><button style={{...S.btn('#22c55e'),padding:'14px 32px',fontSize:15}} onClick={onOpenProfile}>🎯 Configurar Perfil</button></div>
    </div>
  );

  const day=plan[dayIdx];
  const tc={strength:'#22c55e',cardio:'#3b82f6',rest:'#64748b'}[day?.type]||'#64748b';

  // ── render aba treinos
  if(tab==='workout') return(
    <WorkoutProfilesPage
      profiles={workoutProfiles}
      plan={plan}
      onSave={saveProfile}
      onDelete={deleteProfile}
      onApplyToDay={(profileId,dayI)=>{
        const p=workoutProfiles.find(wp=>wp.id===profileId);
        if(!p) return;
        const prevLabel=plan[dayI]?.typeLabel;
        setPlan(prev=>prev.map((d,di)=>{
          if(di===dayI||d.typeLabel===prevLabel) return {...d,type:p.type,typeLabel:p.typeLabel,exercises:p.exercises||''};
          return d;
        }));
      }}
      onBack={()=>setTab('plan')}
      tab={tab} setTab={setTab} cartCount={cartCount} onOpenProfile={onOpenProfile} onLogout={onLogout}
    />
  );

  // ── render lista de compras
  if(tab==='shop') return(
    <>
      <ShoppingList items={shopping} onToggle={toggleCart} onRemove={removeCart} onClear={clearDone}/>
      <nav style={S.nav}>
        {[['plan','📋','Plano'],['shop','🛒','Compras'],['workout','💪','Treinos']].map(([t,ic,lb])=>(
          <button key={t} style={S.navBtn(tab===t)} onClick={()=>setTab(t)}>
            <span style={{fontSize:20,position:'relative'}}>
              {ic}
              {t==='shop'&&cartCount>0&&<span style={{position:'absolute',top:-4,right:-6,background:'#ef4444',color:'#fff',borderRadius:99,fontSize:9,fontWeight:900,padding:'1px 4px',lineHeight:1.4}}>{cartCount}</span>}
            </span>
            <span style={{fontSize:10,fontWeight:700}}>{lb}</span>
          </button>
        ))}
        <button style={S.navBtn(false)} onClick={onOpenProfile}>
          <span style={{fontSize:20}}>👤</span>
          <span style={{fontSize:10,fontWeight:700}}>Perfil</span>
        </button>
        <button style={S.navBtn(false)} onClick={onLogout}>
          <span style={{fontSize:20}}>🚪</span>
          <span style={{fontSize:10,fontWeight:700}}>Sair</span>
        </button>
      </nav>
    </>
  );

  // ── render plano
  return(
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>💪 NutriPlan</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {saveMsg&&<span style={{fontSize:11,color:saveMsg.startsWith('✅')?'#4ade80':'#ef4444'}}>{saveMsg}</span>}
          {saving&&<span style={{fontSize:11,color:'#94a3b8'}}>💾</span>}
        </div>
      </div>

      {/* Day tabs */}
      <div style={{display:'flex',overflowX:'auto',gap:8,padding:'16px 20px',scrollbarWidth:'none'}}>
        {plan.map((d,i)=>(
          <button key={d.id} onClick={()=>setDayIdx(i)} style={{flexShrink:0,padding:'8px 14px',borderRadius:12,border:'1px solid',cursor:'pointer',fontSize:12,fontWeight:700,
            ...(i===dayIdx?{background:d.type==='rest'?'#33415533':d.type==='cardio'?'#1e3a5f':'#1a2e1a',borderColor:d.type==='rest'?'#64748b':d.type==='cardio'?'#3b82f6':'#22c55e',color:d.type==='rest'?'#94a3b8':d.type==='cardio'?'#60a5fa':'#4ade80'}:{background:'rgba(255,255,255,0.03)',borderColor:'rgba(255,255,255,0.08)',color:'#475569'})
          }}>
            <div>{d.short}</div>
            <div style={{fontSize:9,marginTop:2,opacity:.7}}>{d.typeLabel.split('–')[0].trim()}</div>
          </button>
        ))}
      </div>

      {/* Day header */}
      <div style={{...S.card,background:`linear-gradient(135deg,${tc}18,${tc}08)`,border:`1px solid ${tc}33`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:'#f1f5f9'}}>{day.fullName}</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
              <div style={{fontSize:13,color:tc,fontWeight:700}}>{day.typeLabel}</div>
              {/* Botão troca treino */}
              <button onClick={()=>setShowWorkout(true)} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,color:'#94a3b8',padding:'2px 8px',fontSize:11,cursor:'pointer',fontWeight:600}}>🔄 Treino</button>
              <button onClick={()=>setShowMealCount(true)} style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,color:'#94a3b8',padding:'2px 8px',fontSize:11,cursor:'pointer',fontWeight:600}}>🍽️ Refeições</button>
            </div>
            {day.exercises&&<div style={{fontSize:12,color:'#94a3b8',marginTop:6,lineHeight:1.7,whiteSpace:'pre-line'}}>{day.exercises.replace(/·/g,'\n')}</div>}
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:20,fontWeight:900,color:tc}}>{dayTotals.kcal}</div>
            <div style={{fontSize:10,color:'#475569',fontWeight:600}}>kcal totais</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {[['🥩',dayTotals.p+'g','proteína','#3b82f6'],['🫒',dayTotals.l+'g','gordura','#f97316'],['🍚',dayTotals.cb+'g','carbs','#a78bfa'],['🔥',day.burned+'kcal','queimado','#ef4444']].map(([ic,v,l,c])=>(
            <div key={l} style={{background:c+'18',border:`1px solid ${c}33`,borderRadius:10,padding:'8px 12px',flex:1,minWidth:60,textAlign:'center'}}>
              <div style={{fontSize:14}}>{ic}</div>
              <div style={{fontSize:13,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontSize:9,color:'#475569',fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      {day.meals.map((meal,mi)=>{
        const mt=meal.foods.reduce((t,f)=>({kcal:t.kcal+f.kcal,p:t.p+f.p,l:t.l+f.l,cb:t.cb+f.cb}),{kcal:0,p:0,l:0,cb:0});
        return(
          <div key={mi} style={S.card}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <span style={{fontSize:20}}>{meal.icon}</span>
              <div style={{flex:1}}>
                {editMeal?.mi===mi&&editMeal?.field==='name'
                  ?<input autoFocus style={{...S.input,padding:'4px 8px',fontSize:14,fontWeight:700,marginBottom:2}} value={meal.name}
                      onChange={e=>updateMeal(mi,'name',e.target.value)} onBlur={()=>setEditMeal(null)} onKeyDown={e=>e.key==='Enter'&&setEditMeal(null)}/>
                  :<div style={{fontSize:14,fontWeight:700,color:'#f1f5f9',cursor:'pointer'}} onClick={()=>setEditMeal({mi,field:'name'})} title="Clique para editar">{meal.name} <span style={{fontSize:10,color:'#475569'}}>✏️</span></div>
                }
                {editMeal?.mi===mi&&editMeal?.field==='time'
                  ?<input autoFocus style={{...S.input,padding:'2px 6px',fontSize:11,width:80,marginTop:2}} type="time" value={meal.time}
                      onChange={e=>updateMeal(mi,'time',e.target.value)} onBlur={()=>setEditMeal(null)}/>
                  :<div style={{fontSize:11,color:'#475569',fontWeight:600,cursor:'pointer',marginTop:2}} onClick={()=>setEditMeal({mi,field:'time'})} title="Clique para editar">{meal.time} <span style={{fontSize:9}}>✏️</span></div>
                }
              </div>
              <span style={S.badge('#f59e0b')}>{mt.kcal} kcal</span>
            </div>
            {meal.foods.map(food=>{
              const inCart=shopping.some(i=>i.name===food.name&&!i.checked);
              return(
                <div key={food.id} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  {editFood===food.id
                    ?<input style={{...S.input,width:70,padding:'4px 8px',fontSize:12}} type="number" value={food.qty} onChange={e=>updateQty(mi,food.id,+e.target.value)} onBlur={()=>setEditFood(null)} autoFocus/>
                    :<span style={{fontSize:11,color:'#3b82f6',fontWeight:700,cursor:'pointer',minWidth:40}} onClick={()=>setEditFood(food.id)}>{food.qty}g</span>
                  }
                  <span style={{flex:1,fontSize:13,color:'#cbd5e1'}}>{food.name}</span>
                  <div style={{display:'flex',gap:4,alignItems:'center'}}>
                    <div style={{display:'flex',gap:3,fontSize:10}}>
                      <span style={S.badge('#f59e0b')}>{food.kcal}</span>
                      <span style={S.badge('#3b82f6')}>P{food.p}</span>
                      <span style={S.badge('#f97316')}>G{food.l}</span>
                      <span style={S.badge('#a78bfa')}>C{food.cb}</span>
                    </div>
                    {/* Botão carrinho */}
                    <button onClick={()=>addToCart(food)} title="Adicionar à lista de compras"
                      style={{background:inCart?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.05)',border:`1px solid ${inCart?'#22c55e':'rgba(255,255,255,0.1)'}`,borderRadius:7,color:inCart?'#4ade80':'#64748b',cursor:'pointer',fontSize:14,padding:'3px 6px',lineHeight:1}}>
                      🛒
                    </button>
                    <button style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:14,padding:'0 2px'}} onClick={()=>removeFood(mi,food.id)}>✕</button>
                  </div>
                </div>
              );
            })}
            <button style={{...S.btn('#1e293b'),border:'1px dashed rgba(255,255,255,0.15)',width:'100%',marginTop:10,fontSize:12}} onClick={()=>setShowSearch(mi)}>
              + Adicionar alimento TACO
            </button>
          </div>
        );
      })}

      <div style={{height:80}}/>

      {/* Bottom nav */}
      <nav style={S.nav}>
        {[['plan','📋','Plano'],['shop','🛒','Compras'],['workout','💪','Treinos']].map(([t,ic,lb])=>(
          <button key={t} style={S.navBtn(tab===t)} onClick={()=>setTab(t)}>
            <span style={{fontSize:20,position:'relative'}}>
              {ic}
              {t==='shop'&&cartCount>0&&<span style={{position:'absolute',top:-4,right:-6,background:'#ef4444',color:'#fff',borderRadius:99,fontSize:9,fontWeight:900,padding:'1px 4px',lineHeight:1.4}}>{cartCount}</span>}
            </span>
            <span style={{fontSize:10,fontWeight:700}}>{lb}</span>
          </button>
        ))}
        <button style={S.navBtn(false)} onClick={onOpenProfile}>
          <span style={{fontSize:20}}>👤</span>
          <span style={{fontSize:10,fontWeight:700}}>Perfil</span>
        </button>
        <button style={S.navBtn(false)} onClick={onLogout}>
          <span style={{fontSize:20}}>🚪</span>
          <span style={{fontSize:10,fontWeight:700}}>Sair</span>
        </button>
      </nav>

      {showSearch!==null&&<FoodModal onSelect={t=>addFood(showSearch,t)} onClose={()=>setShowSearch(null)}/>}
      {showMealCount&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:300,display:'flex',alignItems:'flex-end'}} onClick={()=>setShowMealCount(false)}>
          <div style={{background:'#1e293b',borderRadius:'20px 20px 0 0',width:'100%',padding:24}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div style={{fontSize:16,fontWeight:800,color:'#f1f5f9'}}>🍽️ Dividir Refeições — {day.fullName}</div>
              <button style={S.btn('#ef4444')} onClick={()=>setShowMealCount(false)}>✕</button>
            </div>
            <div style={{fontSize:12,color:'#475569',marginBottom:16}}>Escolha em quantas refeições distribuir os macros do dia. Os alimentos serão redistribuídos automaticamente.</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
              {[2,3,4,5,6].map(n=>{
                const active=day.meals.length===n;
                return(
                  <button key={n} onClick={()=>redistributeMeals(n)}
                    style={{padding:'16px 0',borderRadius:12,border:'1px solid',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:6,
                      ...(active?{background:'#22c55e22',borderColor:'#22c55e',color:'#4ade80'}:{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.08)',color:'#94a3b8'})}}>
                    <span style={{fontSize:24,fontWeight:900}}>{n}</span>
                    <span style={{fontSize:10,fontWeight:700}}>{active?'✓ Atual':'refeições'}</span>
                  </button>
                );
              })}
            </div>
            <div style={{marginTop:16,fontSize:11,color:'#334155',textAlign:'center'}}>* Apenas o dia atual será alterado</div>
          </div>
        </div>
      )}
      {showWorkout&&<WorkoutModal day={day} onSelect={applyWorkout} onClose={()=>setShowWorkout(false)}/>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState('loading');
  const [userId,setUserId]=useState(null);
  const [profile,setProfile]=useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setUserId(session.user.id);setScreen('app');}else setScreen('login');
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setUserId(session.user.id);setScreen('app');}else{setUserId(null);setScreen('login');}
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(screen==='loading') return(
    <div style={{minHeight:'100vh',background:'#0a0f1e',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center'}}><div style={{fontSize:48,marginBottom:12}}>💪</div><div style={{color:'#475569'}}>Carregando...</div></div>
    </div>
  );
  if(screen==='profile') return(
    <ProfilePage userId={userId} initialProfile={profile}
      onSave={(newPlan,newProfile)=>{setProfile(newProfile);setScreen('app');}}
      onBack={()=>setScreen('app')}/>
  );
  if(screen==='app') return(
    <MealPlanApp userId={userId}
      onLogout={async()=>{await signOut();setScreen('login');}}
      onOpenProfile={()=>setScreen('profile')}/>
  );
  if(screen==='register') return <RegisterPage onSwitch={()=>setScreen('login')} onLogin={()=>setScreen('app')}/>;
  return <LoginPage onSwitch={()=>setScreen('register')} onLogin={()=>setScreen('app')}/>;
}

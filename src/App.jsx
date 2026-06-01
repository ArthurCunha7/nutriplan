// src/App.jsx
// NutriPlan — versão com Supabase Auth + persistência de plano
// ─────────────────────────────────────────────────────────────
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { supabase, signUp, signIn, signOut, loadUserPlan, saveUserPlan } from "./supabaseClient";

// ── TACO DATABASE (97 alimentos carregados localmente como fallback) ──────────
const TACO_DB = [{"id":1,"n":"Arroz, integral, cozido","c":"Cereais e derivados","e":124.0,"p":2.6,"l":1.0,"cb":25.8},{"id":2,"n":"Arroz, integral, cru","c":"Cereais e derivados","e":360.0,"p":7.3,"l":1.9,"cb":77.5},{"id":3,"n":"Arroz, tipo 1, cozido","c":"Cereais e derivados","e":128.0,"p":2.5,"l":0.2,"cb":28.1},{"id":4,"n":"Arroz, tipo 1, cru","c":"Cereais e derivados","e":358.0,"p":7.2,"l":0.3,"cb":78.8},{"id":5,"n":"Arroz, tipo 2, cozido","c":"Cereais e derivados","e":130.0,"p":2.6,"l":0.4,"cb":28.2},{"id":6,"n":"Arroz, tipo 2, cru","c":"Cereais e derivados","e":358.0,"p":7.2,"l":0.3,"cb":78.9},{"id":7,"n":"Aveia, flocos, crua","c":"Cereais e derivados","e":394.0,"p":13.9,"l":8.5,"cb":66.6},{"id":8,"n":"Biscoito, doce, maisena","c":"Cereais e derivados","e":443.0,"p":8.1,"l":12.0,"cb":75.2},{"id":9,"n":"Biscoito, doce, recheado com chocolate","c":"Cereais e derivados","e":472.0,"p":6.4,"l":19.6,"cb":70.5},{"id":10,"n":"Biscoito, doce, recheado com morango","c":"Cereais e derivados","e":471.0,"p":5.7,"l":19.6,"cb":71.0},{"id":39,"n":"Macarrão, instantâneo","c":"Cereais e derivados","e":436.0,"p":8.8,"l":17.2,"cb":62.4},{"id":40,"n":"Macarrão, trigo, cru","c":"Cereais e derivados","e":371.0,"p":10.0,"l":1.3,"cb":77.9},{"id":42,"n":"Milho, amido, cru","c":"Cereais e derivados","e":361.0,"p":0.6,"l":0,"cb":87.1},{"id":43,"n":"Milho, fubá, cru","c":"Cereais e derivados","e":353.0,"p":7.2,"l":1.9,"cb":78.9},{"id":52,"n":"Pão, trigo, forma, integral","c":"Cereais e derivados","e":253.0,"p":9.4,"l":3.7,"cb":49.9},{"id":53,"n":"Pão, trigo, francês","c":"Cereais e derivados","e":300.0,"p":8.0,"l":3.1,"cb":58.6},{"id":62,"n":"Polenta, pré-cozida","c":"Cereais e derivados","e":103.0,"p":2.3,"l":0.3,"cb":23.3},{"id":63,"n":"Torrada, pão francês","c":"Cereais e derivados","e":377.0,"p":10.5,"l":3.3,"cb":74.6},{"id":88,"n":"Batata, doce, cozida","c":"Verduras, hortaliças e derivados","e":77.0,"p":0.6,"l":0.1,"cb":18.4},{"id":89,"n":"Batata, doce, crua","c":"Verduras, hortaliças e derivados","e":118.0,"p":1.3,"l":0.1,"cb":28.2},{"id":91,"n":"Batata, inglesa, cozida","c":"Verduras, hortaliças e derivados","e":52.0,"p":1.2,"l":0,"cb":11.9},{"id":100,"n":"Brócolis, cozido","c":"Verduras, hortaliças e derivados","e":25.0,"p":2.1,"l":0.5,"cb":4.4},{"id":101,"n":"Brócolis, cru","c":"Verduras, hortaliças e derivados","e":25.0,"p":3.6,"l":0.3,"cb":4.0},{"id":107,"n":"Cebola, crua","c":"Verduras, hortaliças e derivados","e":39.0,"p":1.7,"l":0.1,"cb":8.9},{"id":109,"n":"Cenoura, cozida","c":"Verduras, hortaliças e derivados","e":30.0,"p":0.8,"l":0.2,"cb":6.7},{"id":110,"n":"Cenoura, crua","c":"Verduras, hortaliças e derivados","e":34.0,"p":1.3,"l":0.2,"cb":7.7},{"id":115,"n":"Couve, manteiga, crua","c":"Verduras, hortaliças e derivados","e":27.0,"p":2.9,"l":0.5,"cb":4.3},{"id":116,"n":"Couve, manteiga, refogada","c":"Verduras, hortaliças e derivados","e":90.0,"p":1.7,"l":6.6,"cb":8.7},{"id":120,"n":"Espinafre, Nova Zelândia, refogado","c":"Verduras, hortaliças e derivados","e":67.0,"p":2.7,"l":5.4,"cb":4.2},{"id":129,"n":"Mandioca, cozida","c":"Verduras, hortaliças e derivados","e":125.0,"p":0.6,"l":0.3,"cb":30.1},{"id":157,"n":"Tomate, com semente, cru","c":"Verduras, hortaliças e derivados","e":15.0,"p":1.1,"l":0.2,"cb":3.1},{"id":159,"n":"Tomate, molho industrializado","c":"Verduras, hortaliças e derivados","e":38.0,"p":1.4,"l":0.9,"cb":7.7},{"id":163,"n":"Abacate, cru","c":"Frutas e derivados","e":96.0,"p":1.2,"l":8.4,"cb":6.0},{"id":164,"n":"Abacaxi, cru","c":"Frutas e derivados","e":48.0,"p":0.9,"l":0.1,"cb":12.3},{"id":179,"n":"Banana, nanica, crua","c":"Frutas e derivados","e":92.0,"p":1.4,"l":0.1,"cb":23.8},{"id":182,"n":"Banana, prata, crua","c":"Frutas e derivados","e":98.0,"p":1.3,"l":0.1,"cb":26.0},{"id":207,"n":"Kiwi, cru","c":"Frutas e derivados","e":51.0,"p":1.3,"l":0.6,"cb":11.5},{"id":221,"n":"Maçã, Argentina, com casca, crua","c":"Frutas e derivados","e":63.0,"p":0.2,"l":0.2,"cb":16.6},{"id":222,"n":"Maçã, Fuji, com casca, crua","c":"Frutas e derivados","e":56.0,"p":0.3,"l":0,"cb":15.2},{"id":225,"n":"Mamão, Formosa, cru","c":"Frutas e derivados","e":45.0,"p":0.8,"l":0.1,"cb":11.6},{"id":226,"n":"Mamão, Papaia, cru","c":"Frutas e derivados","e":40.0,"p":0.5,"l":0.1,"cb":10.4},{"id":228,"n":"Manga, Haden, crua","c":"Frutas e derivados","e":64.0,"p":0.4,"l":0.3,"cb":16.7},{"id":231,"n":"Manga, Tommy Atkins, crua","c":"Frutas e derivados","e":51.0,"p":0.9,"l":0.2,"cb":12.8},{"id":235,"n":"Melancia, crua","c":"Frutas e derivados","e":33.0,"p":0.9,"l":0,"cb":8.1},{"id":239,"n":"Morango, cru","c":"Frutas e derivados","e":30.0,"p":0.9,"l":0.3,"cb":6.8},{"id":243,"n":"Pêra, Williams, crua","c":"Frutas e derivados","e":53.0,"p":0.6,"l":0.1,"cb":14.0},{"id":277,"n":"Atum, conserva em óleo","c":"Pescados e frutos do mar","e":166.0,"p":26.2,"l":6.0,"cb":0},{"id":278,"n":"Atum, fresco, cru","c":"Pescados e frutos do mar","e":118.0,"p":25.7,"l":0.9,"cb":0},{"id":315,"n":"Salmão, filé, com pele, fresco, grelhado","c":"Pescados e frutos do mar","e":229.0,"p":23.9,"l":14.0,"cb":0},{"id":316,"n":"Salmão, sem pele, fresco, cru","c":"Pescados e frutos do mar","e":170.0,"p":19.3,"l":9.7,"cb":0},{"id":318,"n":"Sardinha, assada","c":"Pescados e frutos do mar","e":164.0,"p":32.2,"l":3.0,"cb":0},{"id":326,"n":"Carne, bovina, acém, moído, cozido","c":"Carnes e derivados","e":212.0,"p":26.7,"l":10.9,"cb":0},{"id":327,"n":"Carne, bovina, acém, moído, cru","c":"Carnes e derivados","e":137.0,"p":19.4,"l":5.9,"cb":0},{"id":347,"n":"Carne, bovina, costela, assada","c":"Carnes e derivados","e":373.0,"p":28.8,"l":27.7,"cb":0},{"id":355,"n":"Carne, bovina, fígado, cru","c":"Carnes e derivados","e":141.0,"p":20.7,"l":5.4,"cb":1.1},{"id":380,"n":"Carne, bovina, picanha, com gordura, crua","c":"Carnes e derivados","e":213.0,"p":18.8,"l":14.7,"cb":0},{"id":381,"n":"Carne, bovina, picanha, com gordura, grelhada","c":"Carnes e derivados","e":289.0,"p":26.4,"l":19.5,"cb":0},{"id":394,"n":"Frango, coração, cru","c":"Carnes e derivados","e":222.0,"p":12.6,"l":18.6,"cb":0},{"id":395,"n":"Frango, coração, grelhado","c":"Carnes e derivados","e":207.0,"p":22.4,"l":12.1,"cb":0.6},{"id":396,"n":"Frango, coxa, com pele, assada","c":"Carnes e derivados","e":215.0,"p":28.5,"l":10.4,"cb":0.1},{"id":398,"n":"Frango, coxa, sem pele, cozida","c":"Carnes e derivados","e":167.0,"p":26.9,"l":5.8,"cb":0},{"id":399,"n":"Frango, coxa, sem pele, crua","c":"Carnes e derivados","e":120.0,"p":17.8,"l":4.9,"cb":0},{"id":403,"n":"Frango, inteiro, sem pele, assado","c":"Carnes e derivados","e":187.0,"p":28.0,"l":7.5,"cb":0},{"id":405,"n":"Frango, inteiro, sem pele, cru","c":"Carnes e derivados","e":129.0,"p":20.6,"l":4.6,"cb":0},{"id":406,"n":"Frango, peito, com pele, assado","c":"Carnes e derivados","e":212.0,"p":33.4,"l":7.6,"cb":0},{"id":407,"n":"Frango, peito, com pele, cru","c":"Carnes e derivados","e":149.0,"p":20.8,"l":6.7,"cb":0},{"id":408,"n":"Frango, peito, sem pele, cozido","c":"Carnes e derivados","e":163.0,"p":31.5,"l":3.2,"cb":0},{"id":409,"n":"Frango, peito, sem pele, cru","c":"Carnes e derivados","e":119.0,"p":21.5,"l":3.0,"cb":0},{"id":410,"n":"Frango, peito, sem pele, grelhado","c":"Carnes e derivados","e":159.0,"p":32.0,"l":2.5,"cb":0},{"id":411,"n":"Frango, sobrecoxa, com pele, assada","c":"Carnes e derivados","e":260.0,"p":28.7,"l":15.2,"cb":0},{"id":413,"n":"Frango, sobrecoxa, sem pele, assada","c":"Carnes e derivados","e":233.0,"p":29.2,"l":12.0,"cb":0},{"id":424,"n":"Mortadela","c":"Carnes e derivados","e":269.0,"p":12.0,"l":21.6,"cb":5.8},{"id":448,"n":"Iogurte, natural","c":"Laticínios","e":51.0,"p":4.1,"l":3.0,"cb":1.9},{"id":449,"n":"Iogurte, natural, desnatado","c":"Laticínios","e":41.0,"p":3.8,"l":0.3,"cb":5.8},{"id":461,"n":"Queijo, minas, frescal","c":"Laticínios","e":264.0,"p":17.4,"l":20.2,"cb":3.2},{"id":463,"n":"Queijo, mozarela","c":"Laticínios","e":330.0,"p":22.6,"l":25.2,"cb":3.0},{"id":464,"n":"Queijo, parmesão","c":"Laticínios","e":453.0,"p":35.6,"l":33.5,"cb":1.7},{"id":467,"n":"Queijo, prato","c":"Laticínios","e":360.0,"p":22.7,"l":29.1,"cb":1.9},{"id":468,"n":"Queijo, requeijão, cremoso","c":"Laticínios","e":257.0,"p":9.6,"l":23.4,"cb":2.4},{"id":469,"n":"Queijo, ricota","c":"Laticínios","e":140.0,"p":12.6,"l":8.1,"cb":3.8},{"id":484,"n":"Omelete, de queijo","c":"Ovos e derivados","e":268.0,"p":15.6,"l":22.0,"cb":0.4},{"id":485,"n":"Ovo, de codorna, inteiro, cru","c":"Ovos e derivados","e":177.0,"p":13.7,"l":12.7,"cb":0.8},{"id":486,"n":"Ovo, de galinha, clara, cozida","c":"Ovos e derivados","e":59.0,"p":13.4,"l":0.1,"cb":0},{"id":488,"n":"Ovo, de galinha, inteiro, cozido","c":"Ovos e derivados","e":146.0,"p":13.3,"l":9.5,"cb":0.6},{"id":489,"n":"Ovo, de galinha, inteiro, cru","c":"Ovos e derivados","e":143.0,"p":13.0,"l":8.9,"cb":1.6},{"id":490,"n":"Ovo, de galinha, inteiro, frito","c":"Ovos e derivados","e":240.0,"p":15.6,"l":18.6,"cb":1.2},{"id":492,"n":"Açúcar, cristal","c":"Açúcares e doces","e":387.0,"p":0.3,"l":0,"cb":99.6},{"id":495,"n":"Chocolate, ao leite","c":"Açúcares e doces","e":540.0,"p":7.2,"l":30.3,"cb":59.6},{"id":501,"n":"Doce, de leite, cremoso","c":"Açúcares e doces","e":306.0,"p":5.5,"l":6.0,"cb":59.5},{"id":507,"n":"Mel, de abelha","c":"Açúcares e doces","e":309.0,"p":0,"l":0,"cb":84.0},{"id":557,"n":"Amendoim, grão, cru","c":"Leguminosas e derivados","e":544.0,"p":27.2,"l":43.9,"cb":20.3},{"id":558,"n":"Amendoim, torrado, salgado","c":"Leguminosas e derivados","e":606.0,"p":22.5,"l":54.0,"cb":18.7},{"id":561,"n":"Feijão, carioca, cozido","c":"Leguminosas e derivados","e":76.0,"p":4.8,"l":0.5,"cb":13.6},{"id":562,"n":"Feijão, carioca, cru","c":"Leguminosas e derivados","e":329.0,"p":20.0,"l":1.3,"cb":61.2},{"id":567,"n":"Feijão, preto, cozido","c":"Leguminosas e derivados","e":77.0,"p":4.5,"l":0.5,"cb":14.0},{"id":568,"n":"Feijão, preto, cru","c":"Leguminosas e derivados","e":324.0,"p":21.3,"l":1.2,"cb":58.8},{"id":577,"n":"Lentilha, cozida","c":"Leguminosas e derivados","e":93.0,"p":6.3,"l":0.5,"cb":16.3},{"id":578,"n":"Lentilha, crua","c":"Leguminosas e derivados","e":339.0,"p":23.2,"l":0.8,"cb":62.0},{"id":584,"n":"Soja, queijo (tofu)","c":"Leguminosas e derivados","e":64.0,"p":6.6,"l":4.0,"cb":2.1},{"id":587,"n":"Amêndoa, torrada, salgada","c":"Nozes e sementes","e":581.0,"p":18.6,"l":47.3,"cb":29.5},{"id":588,"n":"Castanha-de-caju, torrada, salgada","c":"Nozes e sementes","e":570.0,"p":18.5,"l":46.3,"cb":29.1},{"id":589,"n":"Castanha-do-Brasil, crua","c":"Nozes e sementes","e":643.0,"p":14.5,"l":63.5,"cb":15.1},{"id":590,"n":"Coco, cru","c":"Nozes e sementes","e":406.0,"p":3.7,"l":42.0,"cb":10.4},{"id":593,"n":"Gergelim, semente","c":"Nozes e sementes","e":584.0,"p":21.2,"l":50.4,"cb":21.6},{"id":594,"n":"Linhaça, semente","c":"Nozes e sementes","e":495.0,"p":14.1,"l":32.3,"cb":43.3},{"id":597,"n":"Noz, crua","c":"Nozes e sementes","e":620.0,"p":14.0,"l":59.4,"cb":18.4}];
const TACO_MAP = Object.fromEntries(TACO_DB.map(t => [t.id, t]));

// ── PLAN DATA ─────────────────────────────────────────────────────────────────
const PLAN_RAW = [{"id":0,"name":"Segunda","short":"SEG","fullName":"Segunda-Feira","type":"strength","typeLabel":"Treino A","detail":"Leg Front 🦵","exercises":"Agachamento 4×8 · Leg Press 4×10 · Cadeira Extensora 4×12 · Panturrilha Sentado 5×12","calories":3300,"burned":450,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,80,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,150,"Ovos mexidos (3 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[null,30,"Granola s/ açúcar",125,3,5,20],[226,150,"Mamão papaia",null,null,null,null]]},{"time":"13:00","name":"Almoço","icon":"🍽️","foods":[[410,200,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,200,"Arroz, tipo 1, cozido",null,null,null,null],[561,120,"Feijão, carioca, cozido",null,null,null,null],[100,100,"Brócolis, cozido",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"16:00","name":"Pré-Treino","icon":"⚡","foods":[[88,200,"Batata, doce, cozida",null,null,null,null],[277,120,"Atum, conserva em óleo",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null]]},{"time":"19:30","name":"Pós-Treino / Jantar","icon":"💪","foods":[[413,200,"Frango, sobrecoxa, sem pele, assada",null,null,null,null],[null,180,"Macarrão integral, cozido",245,9,2,49],[159,80,"Tomate, molho industrializado",null,null,null,null],[null,100,"Salada verde",20,1,0,3]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,60,"Queijo, ricota",null,null,null,null]]}]},{"id":1,"name":"Terça","short":"TER","fullName":"Terça-Feira","type":"strength","typeLabel":"Treino B","detail":"Upper Body 🏋️","exercises":"Supino Reto 4×6-8 · Supino Inclinado 3×8-10 · Pull-up/Lat 3×8-10 · Remada Curvada 3×6-8 · Desenvolvimento 3×6-8","calories":3200,"burned":400,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,80,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,100,"Ovos cozidos (2 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[7,30,"Aveia em flocos",null,null,null,null],[222,150,"Maçã, Fuji, com casca",null,null,null,null]]},{"time":"13:00","name":"Almoço","icon":"🍽️","foods":[[410,200,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[577,120,"Lentilha, cozida",null,null,null,null],[120,100,"Espinafre, Nova Zelândia, refogado",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"16:00","name":"Pré-Treino","icon":"⚡","foods":[[88,180,"Batata, doce, cozida",null,null,null,null],[277,120,"Atum, conserva em óleo",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null]]},{"time":"20:00","name":"Pós-Treino / Jantar","icon":"💪","foods":[[408,200,"Frango, peito, sem pele, cozido",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[567,80,"Feijão, preto, cozido",null,null,null,null],[null,100,"Legumes variados",40,2,0,8]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,60,"Queijo, ricota",null,null,null,null]]}]},{"id":2,"name":"Quarta","short":"QUA","fullName":"Quarta-Feira","type":"cardio","typeLabel":"Cardio A + B","detail":"Bike 40min + Corrida 10km 🚴🏃","exercises":"Bicicleta ergométrica 40 min (moderado) + Corrida 10km — maior gasto da semana","calories":3700,"burned":950,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,100,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,150,"Ovos mexidos (3 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[null,40,"Granola integral",165,4,6,27],[164,150,"Abacaxi, cru",null,null,null,null]]},{"time":"12:30","name":"Almoço","icon":"🍽️","foods":[[410,200,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,250,"Arroz, tipo 1, cozido",null,null,null,null],[561,100,"Feijão, carioca, cozido",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"15:30","name":"Pré-Cardio","icon":"🚴","foods":[[179,200,"Banana, nanica, crua",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[507,10,"Mel, de abelha",null,null,null,null]]},{"time":"19:30","name":"Pós-Cardio / Jantar","icon":"💪","foods":[[410,250,"Frango, peito, sem pele, grelhado",null,null,null,null],[null,200,"Macarrão integral, cozido",270,10,2,54],[3,150,"Arroz, tipo 1, cozido",null,null,null,null],[159,100,"Tomate, molho industrializado",null,null,null,null]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,70,"Queijo, ricota",null,null,null,null]]}]},{"id":3,"name":"Quinta","short":"QUI","fullName":"Quinta-Feira","type":"strength","typeLabel":"Treino C","detail":"Posterior Chain 🍑","exercises":"Panturrilha Sentado 4×12-15 · RDL 4×6-8 · Mesa Flexora 3×10-12 · Hip Thrust 4×8-10 · Bulgarian Split 3×8-10","calories":3300,"burned":500,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,80,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,150,"Ovos mexidos (3 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[7,30,"Aveia em flocos",null,null,null,null],[243,150,"Pêra, Williams, crua",null,null,null,null]]},{"time":"13:00","name":"Almoço","icon":"🍽️","foods":[[326,150,"Carne, bovina, acém, moído, cozido",null,null,null,null],[3,200,"Arroz, tipo 1, cozido",null,null,null,null],[561,120,"Feijão, carioca, cozido",null,null,null,null],[116,100,"Couve, manteiga, refogada",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"16:00","name":"Pré-Treino","icon":"⚡","foods":[[88,200,"Batata, doce, cozida",null,null,null,null],[277,120,"Atum, conserva em óleo",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null]]},{"time":"20:00","name":"Pós-Treino / Jantar","icon":"💪","foods":[[410,250,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[null,120,"Legumes variados",50,3,0,9],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,60,"Queijo, ricota",null,null,null,null]]}]},{"id":4,"name":"Sexta","short":"SEX","fullName":"Sexta-Feira","type":"strength","typeLabel":"Treino D","detail":"Upper + Braços 💪","exercises":"Remada Curvada 3×10 · Pull-up 3×10 · Supino Reto 4×12 · Tríceps Polia 4×10 · Tríceps Francês 3×10 · Rosca Direta 4×10 · Rosca Alternada 3×10 · Elevação Lateral 3×10","calories":3200,"burned":450,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,80,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,100,"Ovos cozidos (2 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[222,150,"Maçã, Fuji, com casca",null,null,null,null],[589,20,"Castanha-do-Brasil, crua",null,null,null,null]]},{"time":"13:00","name":"Almoço","icon":"🍽️","foods":[[410,200,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[561,120,"Feijão, carioca, cozido",null,null,null,null],[100,100,"Brócolis, cozido",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"16:00","name":"Pré-Treino","icon":"⚡","foods":[[88,180,"Batata, doce, cozida",null,null,null,null],[277,120,"Atum, conserva em óleo",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null]]},{"time":"20:00","name":"Pós-Treino / Jantar","icon":"💪","foods":[[398,200,"Frango, coxa, sem pele, cozida",null,null,null,null],[3,150,"Arroz, tipo 1, cozido",null,null,null,null],[561,100,"Feijão, carioca, cozido",null,null,null,null],[null,100,"Salada verde",20,1,0,3]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,60,"Queijo, ricota",null,null,null,null]]}]},{"id":5,"name":"Sábado","short":"SÁB","fullName":"Sábado","type":"cardio","typeLabel":"Cardio C","detail":"Bike + Corrida 1h30 🏃","exercises":"Bicicleta + Corrida combinados — 1h30min total (sessão longa de cardio)","calories":3500,"burned":750,"meals":[{"time":"07:00","name":"Café da Manhã","icon":"🌅","foods":[[7,90,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,150,"Ovos mexidos (3 und.)",null,null,null,null],[null,200,"Leite semidesnatado",90,7,3,10]]},{"time":"10:00","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[null,40,"Granola integral",165,4,6,27],[228,150,"Manga, Haden, crua",null,null,null,null]]},{"time":"12:30","name":"Almoço","icon":"🍽️","foods":[[410,200,"Frango, peito, sem pele, grelhado",null,null,null,null],[3,230,"Arroz, tipo 1, cozido",null,null,null,null],[561,100,"Feijão, carioca, cozido",null,null,null,null],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"15:30","name":"Pré-Cardio","icon":"🚴","foods":[[179,200,"Banana, nanica, crua",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[507,10,"Mel, de abelha",null,null,null,null]]},{"time":"19:00","name":"Pós-Cardio / Jantar","icon":"💪","foods":[[410,250,"Frango, peito, sem pele, grelhado",null,null,null,null],[null,200,"Macarrão integral, cozido",270,10,2,54],[3,100,"Arroz, tipo 1, cozido",null,null,null,null],[159,100,"Tomate, molho industrializado",null,null,null,null]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,50,"Pão, trigo, forma, integral",null,null,null,null],[469,70,"Queijo, ricota",null,null,null,null]]}]},{"id":6,"name":"Domingo","short":"DOM","fullName":"Domingo","type":"rest","typeLabel":"Descanso","detail":"Recuperação ativa 😴","exercises":"Nenhum treino programado — foco em sono de qualidade e recuperação muscular","calories":2900,"burned":0,"meals":[{"time":"08:00","name":"Café da Manhã","icon":"🌅","foods":[[7,80,"Aveia em flocos",null,null,null,null],[557,20,"Pasta de amendoim ⭐",null,null,null,null],[182,120,"Banana prata",null,null,null,null],[488,100,"Ovos cozidos (2 und.)",null,null,null,null],[null,150,"Leite semidesnatado",68,5,2,8]]},{"time":"10:30","name":"Lanche 1","icon":"🥛","foods":[[448,200,"Iogurte natural integral",null,null,null,null],[222,150,"Maçã, Fuji, com casca",null,null,null,null],[589,15,"Castanha-do-Brasil, crua",null,null,null,null]]},{"time":"13:00","name":"Almoço","icon":"🍽️","foods":[[326,150,"Carne, bovina, acém, moído, cozido",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[561,100,"Feijão, carioca, cozido",null,null,null,null],[null,100,"Salada variada",30,2,0,5],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"16:00","name":"Lanche 2","icon":"🍎","foods":[[88,150,"Batata, doce, cozida",null,null,null,null],[277,100,"Atum, conserva em óleo",null,null,null,null],[null,100,"Tomate + pepino",20,1,0,4]]},{"time":"19:30","name":"Jantar","icon":"🍽️","foods":[[408,180,"Frango, peito, sem pele, cozido",null,null,null,null],[3,180,"Arroz, tipo 1, cozido",null,null,null,null],[null,120,"Legumes variados",50,3,0,9],[null,5,"Azeite extra virgem",45,0,5,0]]},{"time":"22:00","name":"Ceia","icon":"🌙","foods":[[488,100,"Ovo, de galinha, inteiro, cozido",null,null,null,null],[52,25,"Pão, trigo, forma, integral",null,null,null,null],[469,70,"Queijo, ricota",null,null,null,null]]}]}];

// ── HELPERS ───────────────────────────────────────────────────────────────────
let _uid = 1;
function uid() { return 'f' + (_uid++); }

function calcMacros(tacoId, qty, fb) {
  if (tacoId && TACO_MAP[tacoId]) {
    const t = TACO_MAP[tacoId], f = qty / 100;
    return { kcal: Math.round(t.e * f), p: +((t.p * f).toFixed(1)), l: +((t.l * f).toFixed(1)), cb: +((t.cb * f).toFixed(1)) };
  }
  return { kcal: fb[0]||0, p: fb[1]||0, l: fb[2]||0, cb: fb[3]||0 };
}

function buildPlan(raw) {
  return raw.map(day => ({
    ...day,
    meals: day.meals.map(meal => ({
      ...meal,
      foods: meal.foods.map(([tid, qty, name, ...fb]) => {
        const m = calcMacros(tid, qty, fb);
        return { id: uid(), name, qty, tacoId: tid, ...m };
      })
    }))
  }));
}

function normalizeText(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}

function searchTACO(query, limit = 9) {
  if (!query || query.length < 2) return [];
  const terms = normalizeText(query).split(' ').filter(Boolean);
  return TACO_DB
    .map(t => {
      const norm = normalizeText(t.n);
      const score = terms.reduce((s, term) => {
        if (norm.startsWith(term)) return s + 3;
        if (norm.includes(' ' + term)) return s + 2;
        if (norm.includes(term)) return s + 1;
        return s - 1;
      }, 0);
      return { ...t, score };
    })
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  wrap: { minHeight:'100vh', background:'#0a0f1e', color:'#f1f5f9', fontFamily:'system-ui,sans-serif', padding:'0 0 80px' },
  header: { background:'linear-gradient(135deg,#1e293b,#0f172a)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, backdropFilter:'blur(12px)' },
  logo: { fontSize:20, fontWeight:800, color:'#f1f5f9', display:'flex', alignItems:'center', gap:8 },
  dayTabs: { display:'flex', overflowX:'auto', gap:8, padding:'16px 20px', scrollbarWidth:'none' },
  dayTab: (active, type) => ({ flexShrink:0, padding:'8px 14px', borderRadius:12, border:'1px solid', cursor:'pointer', fontSize:12, fontWeight:700, transition:'all .2s', ...(active ? { background: type==='rest'?'#334155':type==='cardio'?'#1e3a5f':'#1a2e1a', borderColor: type==='rest'?'#64748b':type==='cardio'?'#3b82f6':'#22c55e', color: type==='rest'?'#94a3b8':type==='cardio'?'#60a5fa':'#4ade80' } : { background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.08)', color:'#475569' }) }),
  card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, margin:'0 16px 12px', padding:'16px' },
  mealHeader: { display:'flex', alignItems:'center', gap:10, marginBottom:12 },
  mealTitle: { fontSize:14, fontWeight:700, color:'#f1f5f9', flex:1 },
  mealTime: { fontSize:11, color:'#475569', fontWeight:600 },
  foodRow: { display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' },
  foodName: { flex:1, fontSize:13, color:'#cbd5e1' },
  foodMacros: { display:'flex', gap:6, fontSize:11 },
  badge: (color) => ({ background:color+'22', color, padding:'2px 7px', borderRadius:6, fontWeight:700, fontSize:10 }),
  btn: (color='#3b82f6') => ({ background:color, border:'none', borderRadius:10, color:'#fff', padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer' }),
  input: { width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#f1f5f9', fontSize:14, padding:'10px 12px', outline:'none', boxSizing:'border-box' },
};

// ── AUTH WRAPPER ──────────────────────────────────────────────────────────────
function AuthWrapper({ children }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a0f1e,#0f172a,#0a0f1e)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:400, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:32 }}>
        {children}
      </div>
    </div>
  );
}

function Logo({ icon = '💪' }) {
  return (
    <div style={{ textAlign:'center', marginBottom:28 }}>
      <div style={{ fontSize:48, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:900, color:'#f1f5f9', letterSpacing:-0.5 }}>NutriPlan</div>
      <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>Tabela TACO · NEPA/UNICAMP</div>
    </div>
  );
}

function Input({ label, type='text', placeholder, value, onChange, error, icon }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontSize:11, fontWeight:700, color:'#475569', marginBottom:6, letterSpacing:0.8 }}>{icon} {label}</div>}
      <input style={{ ...S.input, borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)' }} type={type} placeholder={placeholder} value={value} onChange={onChange} />
      {error && <div style={{ color:'#ef4444', fontSize:11, marginTop:4 }}>{error}</div>}
    </div>
  );
}

// ── LOGIN PAGE (com Supabase) ─────────────────────────────────────────────────
function LoginPage({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleLogin() {
    const e = {};
    if (!email) e.email = 'Informe o e-mail';
    if (!password) e.password = 'Informe a senha';
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await signIn({ email, password });
      setSuccess(true);
      setTimeout(onLogin, 1200);
    } catch (err) {
      setErrors({ password: err.message || 'Email ou senha incorretos' });
    } finally {
      setLoading(false);
    }
  }

  const statsRow = [["🔥","3.200+","kcal/dia"],["🥩","178g","proteína"],["📅","7","dias/plano"]];

  return (
    <AuthWrapper>
      <Logo icon="💪" />
      {success ? (
        <>
          <div style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:14,padding:16,textAlign:'center',marginBottom:20}}>
            <span style={{fontSize:36,marginBottom:8,display:'block'}}>✅</span>
            <div style={{color:'#4ade80',fontSize:14,fontWeight:700,marginBottom:4}}>Login realizado!</div>
            <div style={{color:'#86efac',fontSize:12}}>Redirecionando para seu plano semanal...</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
            {statsRow.map(([ic,v,l])=>(
              <div key={l} style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'10px 6px',textAlign:'center',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                <div style={{color:'#f1f5f9',fontSize:15,fontWeight:800}}>{v}</div>
                <div style={{color:'#475569',fontSize:9,fontWeight:600,letterSpacing:0.5,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{color:'#f8fafc',fontSize:22,fontWeight:800,marginBottom:6,textAlign:'center'}}>Bem-vindo de volta</div>
          <div style={{color:'#64748b',fontSize:13,textAlign:'center',marginBottom:28}}>Acesse seu plano alimentar personalizado</div>
          <Input icon="📧" label="E-MAIL" type="email" placeholder="seu@email.com" value={email} onChange={e=>{setEmail(e.target.value);setErrors(v=>({...v,email:""}));}} error={errors.email}/>
          <Input icon="🔒" label="SENHA" type="password" placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setErrors(v=>({...v,password:""}));}} error={errors.password}/>
          <button style={{...S.btn('#22c55e'),width:'100%',padding:'13px',fontSize:14,marginBottom:16,opacity:loading?.6:1}} onClick={handleLogin} disabled={loading}>
            {loading ? '⏳ Entrando...' : '🚀 Entrar no Plano'}
          </button>
          <div style={{textAlign:'center',fontSize:13,color:'#475569'}}>
            Não tem conta?{' '}
            <button style={{background:'none',border:'none',color:'#60a5fa',cursor:'pointer',fontWeight:700,fontSize:13}} onClick={onSwitch}>
              Cadastrar →
            </button>
          </div>
        </>
      )}
    </AuthWrapper>
  );
}

// ── REGISTER PAGE (com Supabase) ──────────────────────────────────────────────
function RegisterPage({ onSwitch, onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
    const e = {};
    if (!name.trim()) e.name = 'Informe seu nome';
    if (!email) e.email = 'Informe o e-mail';
    if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (password !== confirm) e.confirm = 'Senhas não conferem';
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await signUp({ email, password, name });
      setSuccess(true);
      setTimeout(onLogin, 1500);
    } catch (err) {
      setErrors({ email: err.message || 'Erro ao criar conta' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthWrapper>
      <Logo icon="🥗" />
      {success ? (
        <div style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:14,padding:20,textAlign:'center'}}>
          <span style={{fontSize:48,display:'block',marginBottom:12}}>🎉</span>
          <div style={{color:'#4ade80',fontSize:16,fontWeight:700,marginBottom:8}}>Conta criada!</div>
          <div style={{color:'#86efac',fontSize:13}}>Entrando no seu plano...</div>
        </div>
      ) : (
        <>
          <div style={{color:'#f8fafc',fontSize:22,fontWeight:800,marginBottom:6,textAlign:'center'}}>Criar conta</div>
          <div style={{color:'#64748b',fontSize:13,textAlign:'center',marginBottom:24}}>Monte seu plano alimentar personalizado</div>
          <Input icon="👤" label="NOME" placeholder="Seu nome completo" value={name} onChange={e=>{setName(e.target.value);setErrors(v=>({...v,name:""}));}} error={errors.name}/>
          <Input icon="📧" label="E-MAIL" type="email" placeholder="seu@email.com" value={email} onChange={e=>{setEmail(e.target.value);setErrors(v=>({...v,email:""}));}} error={errors.email}/>
          <Input icon="🔒" label="SENHA" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e=>{setPassword(e.target.value);setErrors(v=>({...v,password:""}));}} error={errors.password}/>
          <Input icon="🔒" label="CONFIRMAR SENHA" type="password" placeholder="Repita a senha" value={confirm} onChange={e=>{setConfirm(e.target.value);setErrors(v=>({...v,confirm:""}));}} error={errors.confirm}/>
          <button style={{...S.btn('#22c55e'),width:'100%',padding:'13px',fontSize:14,marginBottom:16,opacity:loading?.6:1}} onClick={handleRegister} disabled={loading}>
            {loading ? '⏳ Criando conta...' : '✅ Criar Conta Grátis'}
          </button>
          <div style={{textAlign:'center',fontSize:13,color:'#475569'}}>
            Já tem conta?{' '}
            <button style={{background:'none',border:'none',color:'#60a5fa',cursor:'pointer',fontWeight:700,fontSize:13}} onClick={onSwitch}>
              Entrar →
            </button>
          </div>
        </>
      )}
    </AuthWrapper>
  );
}

// ── FOOD SEARCH MODAL ─────────────────────────────────────────────────────────
function FoodSearchModal({ onSelect, onClose }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchTACO(q), [q]);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#1e293b',borderRadius:'20px 20px 0 0',width:'100%',maxWidth:480,padding:20,maxHeight:'80vh',overflow:'hidden',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <input autoFocus style={S.input} placeholder="🔍 Buscar alimento TACO..." value={q} onChange={e=>setQ(e.target.value)} />
          <button style={S.btn('#ef4444')} onClick={onClose}>✕</button>
        </div>
        <div style={{overflowY:'auto',flex:1}}>
          {q.length < 2 && <div style={{color:'#475569',textAlign:'center',padding:20,fontSize:13}}>Digite pelo menos 2 letras para buscar</div>}
          {results.map(t=>(
            <div key={t.id} style={{padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:6,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.06)'}} onClick={()=>onSelect(t)}>
              <div style={{fontSize:13,color:'#f1f5f9',fontWeight:600,marginBottom:4}}>{t.n}</div>
              <div style={{display:'flex',gap:8,fontSize:11}}>
                <span style={S.badge('#f59e0b')}>{t.e} kcal</span>
                <span style={S.badge('#3b82f6')}>P {t.p}g</span>
                <span style={S.badge('#f97316')}>G {t.l}g</span>
                <span style={S.badge('#a78bfa')}>C {t.cb}g</span>
                <span style={{color:'#475569'}}>por 100g</span>
              </div>
            </div>
          ))}
          {q.length >= 2 && results.length === 0 && (
            <div style={{color:'#475569',textAlign:'center',padding:20,fontSize:13}}>Nenhum alimento encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function MealPlanApp({ onLogout, userId }) {
  const [plan, setPlan] = useState(() => buildPlan(PLAN_RAW));
  const [dayIdx, setDayIdx] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [editFood, setEditFood] = useState(null);
  const [showSearch, setShowSearch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const saveTimer = useRef(null);

  // Carrega plano salvo ao montar
  useEffect(() => {
    if (!userId) return;
    loadUserPlan(userId).then(saved => {
      if (saved && saved.length) setPlan(saved);
    }).catch(console.error);
  }, [userId]);

  // Auto-salva plano no Supabase após mudanças (debounce 2s)
  useEffect(() => {
    if (!userId) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await saveUserPlan(userId, plan);
        setSaveMsg('✅ Salvo');
        setTimeout(() => setSaveMsg(''), 2000);
      } catch { setSaveMsg('❌ Erro ao salvar'); }
      finally { setSaving(false); }
    }, 2000);
    return () => clearTimeout(saveTimer.current);
  }, [plan, userId]);

  const day = plan[dayIdx];

  const dayTotals = useMemo(() => {
    const t = { kcal:0, p:0, l:0, cb:0 };
    day.meals.forEach(m => m.foods.forEach(f => { t.kcal+=f.kcal; t.p+=f.p; t.l+=f.l; t.cb+=f.cb; }));
    return { kcal:t.kcal, p:+t.p.toFixed(1), l:+t.l.toFixed(1), cb:+t.cb.toFixed(1) };
  }, [day]);

  function updateFood(mealIdx, foodId, field, value) {
    setPlan(prev => prev.map((d, di) => {
      if (di !== dayIdx) return d;
      return { ...d, meals: d.meals.map((m, mi) => {
        if (mi !== mealIdx) return m;
        return { ...m, foods: m.foods.map(f => {
          if (f.id !== foodId) return f;
          const updated = { ...f, [field]: value };
          if (field === 'qty' && f.tacoId && TACO_MAP[f.tacoId]) {
            const t = TACO_MAP[f.tacoId], fac = value / 100;
            updated.kcal = Math.round(t.e * fac);
            updated.p = +((t.p * fac).toFixed(1));
            updated.l = +((t.l * fac).toFixed(1));
            updated.cb = +((t.cb * fac).toFixed(1));
          }
          return updated;
        })};
      })};
    }));
  }

  function removeFood(mealIdx, foodId) {
    setPlan(prev => prev.map((d, di) => {
      if (di !== dayIdx) return d;
      return { ...d, meals: d.meals.map((m, mi) => {
        if (mi !== mealIdx) return m;
        return { ...m, foods: m.foods.filter(f => f.id !== foodId) };
      })};
    }));
  }

  function addFoodFromTACO(mealIdx, tacoItem) {
    const qty = 100;
    const m = calcMacros(tacoItem.id, qty, []);
    const newFood = { id: uid(), name: tacoItem.n, qty, tacoId: tacoItem.id, ...m };
    setPlan(prev => prev.map((d, di) => {
      if (di !== dayIdx) return d;
      return { ...d, meals: d.meals.map((m2, mi) => {
        if (mi !== mealIdx) return m2;
        return { ...m2, foods: [...m2.foods, newFood] };
      })};
    }));
    setShowSearch(null);
  }

  const typeColor = { strength:'#22c55e', cardio:'#3b82f6', rest:'#64748b' };
  const tc = typeColor[day.type] || '#64748b';

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>💪 NutriPlan</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {saveMsg && <span style={{ fontSize:11, color: saveMsg.startsWith('✅') ? '#4ade80' : '#ef4444' }}>{saveMsg}</span>}
          {saving && <span style={{ fontSize:11, color:'#94a3b8' }}>💾 Salvando...</span>}
          <button style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'#94a3b8', padding:'6px 12px', fontSize:12, cursor:'pointer' }} onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div style={S.dayTabs}>
        {plan.map((d, i) => (
          <button key={d.id} style={S.dayTab(i === dayIdx, d.type)} onClick={() => setDayIdx(i)}>
            <div>{d.short}</div>
            <div style={{ fontSize:9, marginTop:2, opacity:.7 }}>{d.typeLabel}</div>
          </button>
        ))}
      </div>

      {/* Day Header */}
      <div style={{ ...S.card, background:`linear-gradient(135deg,${tc}18,${tc}08)`, border:`1px solid ${tc}33` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#f1f5f9' }}>{day.fullName}</div>
            <div style={{ fontSize:13, color:tc, fontWeight:700, marginTop:2 }}>{day.typeLabel} · {day.detail}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:20, fontWeight:900, color:tc }}>{dayTotals.kcal}</div>
            <div style={{ fontSize:10, color:'#475569', fontWeight:600 }}>kcal totais</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[['🥩',dayTotals.p+'g','proteína','#3b82f6'],['🫒',dayTotals.l+'g','gordura','#f97316'],['🍚',dayTotals.cb+'g','carbs','#a78bfa'],['🔥',day.burned+'kcal','queimado','#ef4444']].map(([ic,v,l,c])=>(
            <div key={l} style={{ background:c+'18', border:`1px solid ${c}33`, borderRadius:10, padding:'8px 12px', flex:1, minWidth:60, textAlign:'center' }}>
              <div style={{ fontSize:14 }}>{ic}</div>
              <div style={{ fontSize:13, fontWeight:800, color:c }}>{v}</div>
              <div style={{ fontSize:9, color:'#475569', fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      {day.meals.map((meal, mi) => {
        const mealTot = meal.foods.reduce((t,f)=>({kcal:t.kcal+f.kcal,p:t.p+f.p,l:t.l+f.l,cb:t.cb+f.cb}),{kcal:0,p:0,l:0,cb:0});
        return (
          <div key={mi} style={S.card}>
            <div style={S.mealHeader}>
              <span style={{ fontSize:20 }}>{meal.icon}</span>
              <div style={{ flex:1 }}>
                <div style={S.mealTitle}>{meal.name}</div>
                <div style={S.mealTime}>{meal.time}</div>
              </div>
              <span style={S.badge('#f59e0b')}>{mealTot.kcal} kcal</span>
            </div>

            {meal.foods.map(food => (
              <div key={food.id} style={S.foodRow}>
                {editFood === food.id ? (
                  <input
                    style={{ ...S.input, width:70, padding:'4px 8px', fontSize:12 }}
                    type="number" value={food.qty}
                    onChange={e => updateFood(mi, food.id, 'qty', +e.target.value)}
                    onBlur={() => setEditFood(null)} autoFocus
                  />
                ) : (
                  <span style={{ fontSize:11, color:'#3b82f6', fontWeight:700, cursor:'pointer', minWidth:40 }} onClick={() => setEditFood(food.id)}>
                    {food.qty}g
                  </span>
                )}
                <span style={S.foodName}>{food.name}</span>
                <div style={S.foodMacros}>
                  <span style={S.badge('#f59e0b')}>{food.kcal}</span>
                  <span style={S.badge('#3b82f6')}>P{food.p}</span>
                  <span style={S.badge('#f97316')}>G{food.l}</span>
                  <span style={S.badge('#a78bfa')}>C{food.cb}</span>
                </div>
                <button style={{ background:'none', border:'none', color:'#475569', cursor:'pointer', fontSize:14, padding:'0 4px' }} onClick={() => removeFood(mi, food.id)}>✕</button>
              </div>
            ))}

            <button
              style={{ ...S.btn('#1e293b'), border:'1px dashed rgba(255,255,255,0.15)', width:'100%', marginTop:10, fontSize:12 }}
              onClick={() => setShowSearch(mi)}
            >
              + Adicionar alimento TACO
            </button>
          </div>
        );
      })}

      {showSearch !== null && (
        <FoodSearchModal
          onSelect={t => addFoodFromTACO(showSearch, t)}
          onClose={() => setShowSearch(null)}
        />
      )}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('loading');
  const [userId, setUserId] = useState(null);

  // Verifica sessão existente ao carregar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setScreen('app');
      } else {
        setScreen('login');
      }
    });

    // Escuta mudanças de autenticação (login/logout em outra aba)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setScreen('app');
      } else {
        setUserId(null);
        setScreen('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut();
    setScreen('login');
  }

  if (screen === 'loading') {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>💪</div>
          <div style={{ color:'#475569', fontSize:14 }}>Carregando...</div>
        </div>
      </div>
    );
  }

  if (screen === 'app') return <MealPlanApp onLogout={handleLogout} userId={userId} />;
  if (screen === 'register') return <RegisterPage onSwitch={() => setScreen('login')} onLogin={() => setScreen('app')} />;
  return <LoginPage onSwitch={() => setScreen('register')} onLogin={() => { supabase.auth.getUser().then(({data:{user}})=>{ if(user) setUserId(user.id); }); setScreen('app'); }} />;
}

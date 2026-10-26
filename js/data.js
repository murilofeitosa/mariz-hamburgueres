/* ============================================================
   CARDÁPIO — fiel ao cardápio impresso da Mariz Hambúrgueres
   precos: [Pão bola, Pão árabe]
   ing:    ingredientes usados para desenhar a ilustração
   ============================================================ */
window.MARIZ_MENU = {
  tradicionais: [
    { id: "t1",  nome: "Americano",         desc: "Hambúrguer artesanal, ovo, presunto, queijo e bacon",          precos: [13, 16], ing: ["burger","ovo","presunto","queijo","bacon"] },
    { id: "t2",  nome: "X-Burguer",         desc: "Hambúrguer artesanal e queijo",                                 precos: [10, 13], ing: ["burger","queijo"] },
    { id: "t3",  nome: "X-Bacon",           desc: "Bacon, hambúrguer artesanal, queijo e salada",                  precos: [15, 18], ing: ["burger","bacon","queijo","salada"] },
    { id: "t4",  nome: "Bauru",             desc: "Presunto, tomate, hambúrguer artesanal, queijo e orégano",      precos: [15, 18], ing: ["burger","presunto","tomate","queijo","oregano"] },
    { id: "t5",  nome: "X-Calabresa",       desc: "Calabresa, cebola, queijo e salada",                            precos: [13, 16], ing: ["calabresa","cebola","queijo","salada"] },
    { id: "t6",  nome: "X-Egg",             desc: "Hambúrguer artesanal, ovo, queijo e salada",                    precos: [15, 18], ing: ["burger","ovo","queijo","salada"] },
    { id: "t7",  nome: "Misto",             desc: "Hambúrguer artesanal, presunto e queijo",                       precos: [10, 13], ing: ["burger","presunto","queijo"] },
    { id: "t8",  nome: "X-Salada",          desc: "Hambúrguer artesanal, queijo e salada",                         precos: [12, 15], ing: ["burger","queijo","salada"] },
    { id: "t9",  nome: "X-Tudo",            desc: "Hambúrguer artesanal, presunto, queijo, ovo, bacon e salada",   precos: [20, 23], ing: ["burger","presunto","queijo","ovo","bacon","salada","tomate"], destaque: true },
    { id: "t10", nome: "X-Frango",          desc: "Filé de frango, queijo e salada",                               precos: [15, 18], ing: ["frango","queijo","salada"] },
    { id: "t11", nome: "X-Frango Bacon",    desc: "Filé de frango, bacon, queijo e salada",                        precos: [17, 20], ing: ["frango","bacon","queijo","salada"] },
    { id: "t12", nome: "X-Frango Egg",      desc: "Filé de frango, ovo, queijo e salada",                          precos: [17, 20], ing: ["frango","ovo","queijo","salada"] }
  ],
  premium: [
    { id: "p1", nome: "X-Churrasco Especial",           desc: "Contra filé, queijo e salada",                          precos: [22, 25], ing: ["contra","queijo","salada"] },
    { id: "p2", nome: "X-Churrasco Vinagrete Especial", desc: "Contra filé, vinagrete e queijo",                       precos: [22, 25], ing: ["contra","vinagrete","queijo"] },
    { id: "p3", nome: "X-Filé Mignon",                  desc: "Filé mignon, vinagrete, queijo cheddar e queijo",       precos: [28, 31], ing: ["mignon","vinagrete","cheddar","queijo"], destaque: true },
    { id: "p4", nome: "X-Toscana Especial",             desc: "Calabresa fresca, vinagrete, ovo e queijo",             precos: [22, 25], ing: ["calabresa","vinagrete","ovo","queijo"] },
    { id: "p5", nome: "X-Picanha",                      desc: "Picanha nacional, queijo e salada",                     precos: [25, 28], ing: ["picanha","queijo","salada"], destaque: true }
  ],
  adicionais: [
    { id: "a1", nome: "Hambúrguer artesanal", preco: 8 },
    { id: "a2", nome: "Bacon",                preco: 3 },
    { id: "a3", nome: "Calabresa",            preco: 4 },
    { id: "a4", nome: "Presunto",             preco: 4 },
    { id: "a5", nome: "Queijo",               preco: 5 },
    { id: "a6", nome: "Ovo",                  preco: 3 }
  ],
  paes: ["Pão bola", "Pão árabe"]
};

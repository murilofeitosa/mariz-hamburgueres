/* ============================================================
   CONFIGURAÇÕES DO SITE — edite aqui os dados do estabelecimento
   ============================================================ */
window.MARIZ_CONFIG = {
  nome: "Mariz Hambúrgueres",

  // WhatsApp no formato internacional, só números: 55 + DDD + número
  // ⚠️ TROQUE pelo número real da hamburgueria
  whatsapp: "5585999133145",
  whatsappExibicao: "(85) 99913-3145",

  // ⚠️ Preencha com os dados reais (deixe "" para ocultar)
  endereco: "Rua Coronel Vicente Alexandrino de Sousa, 123 — Tauazinho",
  cidade: "Tauá — CE",
  mapsLink: "", // link do Google Maps (opcional)
  instagram: "", // ex.: "marizhamburgueres" (sem @)

  // Horários exibidos no site (dia 0 = domingo ... 6 = sábado)
  // fechado: true  -> não abre nesse dia
  horarios: [
    { dia: "Domingo",       abre: "18:00", fecha: "23:00", fechado: false },
    { dia: "Segunda-feira", abre: "18:00", fecha: "23:00", fechado: true  },
    { dia: "Terça-feira",   abre: "18:00", fecha: "23:00", fechado: false },
    { dia: "Quarta-feira",  abre: "18:00", fecha: "23:00", fechado: false },
    { dia: "Quinta-feira",  abre: "18:00", fecha: "23:00", fechado: false },
    { dia: "Sexta-feira",   abre: "18:00", fecha: "23:30", fechado: false },
    { dia: "Sábado",        abre: "18:00", fecha: "23:30", fechado: false }
  ],

  taxaEntrega: 0, // 0 = "a combinar pelo WhatsApp"
  formasPagamento: ["Pix", "Cartão", "Dinheiro"]
};


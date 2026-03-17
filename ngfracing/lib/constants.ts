export const AUTH_COOKIE_NAME = "ngf_admin_session";
export const AUTH_COOKIE_CANDIDATES = [AUTH_COOKIE_NAME] as const;

export const CAR_FEATURE_CATEGORIES = [
  {
    name: "Conforto & Conveniência",
    options: [
      "Ar-condicionado",
      "Ar-condicionado Digital",
      "Direção Hidráulica",
      "Direção Elétrica",
      "Vidros Elétricos",
      "Travas Elétricas",
      "Retrovisores Elétricos",
      "Bancos em Couro",
      "Ajuste Elétrico dos Bancos",
      "Piloto Automático",
      "Chave Presencial",
      "Partida no Botão",
      "Teto Solar",
      "Teto Panorâmico"
    ]
  },
  {
    name: "Segurança & Tecnologia",
    options: [
      "Freios ABS",
      "Airbags Frontais",
      "Airbags Laterais/Cortina",
      "Controle de Estabilidade (ESP)",
      "Controle de Tração",
      "Assistente de Partida em Rampa",
      "Alarme",
      "Sensor de Estacionamento",
      "Câmera de Ré",
      "Câmera 360°",
      "Monitoramento de Ponto Cego",
      "Alerta de Colisão"
    ]
  },
  {
    name: "Infotenimento & Visual",
    options: [
      "Central Multimídia",
      "Apple CarPlay / Android Auto",
      "Sistema de Som Premium",
      "Computador de Bordo",
      "Painel Digital (TFT)",
      "Volante Multifuncional",
      "Rodas de Liga Leve",
      "Faróis de LED",
      "Faróis de Xenon",
      "Farol de Milha"
    ]
  }
] as const;

export const CAR_FEATURE_OPTIONS = CAR_FEATURE_CATEGORIES.flatMap(cat => cat.options);

export type NexaSegmentId =
  | 'lojas-varejo'
  | 'mercados-padarias'
  | 'bares-restaurantes'
  | 'saloes-barbearias';

export interface ProductModule {
  id: NexaSegmentId;
  code: string;
  name: string;
  shortTag: string;
  summary: string;
  cardHighlights: string[];
  workflow: string;
  capabilities: string[];
  impactMetric: string;
  previewTitle: string;
  previewSubtitle: string;
  previewRows: {
    label: string;
    detail: string;
    value: string;
    state: 'Concluído' | 'Ativo' | 'Em análise';
  }[];
  previewKpis: {
    label: string;
    value: string;
  }[];
}

export interface ProductCaseStudy {
  quote: string;
  before: string;
  outcome: string;
  author: string;
  role: string;
  company: string;
  sector: string;
}

export interface ProductPlan {
  name: string;
  audience: string;
  billingNote: string;
  priceLabel: string;
  highlights: string[];
  recommended?: boolean;
}

export interface BasesysProduct {
  id: string;
  slug: string;
  indexNumber: string;
  name: string;
  shortName: string;
  category: string;
  audience: string;
  headline: string;
  tagline: string;
  description: string;
  heroMetric: string;
  heroMetricContext: string;
  secondaryMetric: string;
  secondaryMetricContext: string;
  landingUrlLabel: string;
  integrations: string[];
  securityHighlights: string[];
  corePillars: {
    title: string;
    description: string;
  }[];
  modules: ProductModule[];
  caseStudy: ProductCaseStudy;
  plans: ProductPlan[];
}

export const NEXA_SEGMENTS: ProductModule[] = [
  {
    id: 'lojas-varejo',
    code: '01',
    name: 'Lojas e Varejo',
    shortTag: 'Roupas, calçados, eletrônicos e bazar',
    summary: 'Ideal para roupas, calçados, eletrônicos e bazar.',
    cardHighlights: [
      'Grade de cores e tamanhos',
      'Controle de Crediário',
      'Etiquetas Personalizadas',
    ],
    workflow:
      'Cadastre produtos por grade completa de cor e tamanho, imprima etiquetas com código de barras personalizadas, faça trocas no balcão em segundos e acompanhe parcelas do crediário próprio com cobrança organizada.',
    capabilities: [
      'Controle de estoque por grade (cor, tamanho, marca e coleção)',
      'Crediário próprio com carnê, limite por cliente e controle de inadimplência',
      'Impressão de etiquetas personalizadas com código de barras e preço',
      'Emissão ágil de NFC-e, NF-e, trocas, devoluções e vale-presente',
    ],
    impactMetric: 'Redução de até 70% no tempo de inventário e precificação',
    previewTitle: 'NexaERP — Painel Lojas e Varejo',
    previewSubtitle: 'Grade de Produtos · Crediário · PDV',
    previewKpis: [
      { label: 'Vendas hoje', value: 'R$ 14.890' },
      { label: 'SKUs com grade', value: '2.480' },
      { label: 'Crediário em dia', value: '96,4%' },
    ],
    previewRows: [
      {
        label: 'Tênis Runner Pro · Grade 38 ao 43 (Preto/Grafite)',
        detail: '18 pares em estoque · Etiquetas térmicas impressas',
        value: 'R$ 329,90',
        state: 'Ativo',
      },
      {
        label: 'Venda #4821 — Crediário Próprio (4x sem juros)',
        detail: 'Parcela 1 quitada no caixa · Carnê emitido',
        value: 'R$ 680,00',
        state: 'Concluído',
      },
      {
        label: 'Troca Balcão #109 — Camisa Linho M → G',
        detail: 'Ajuste automático de estoque entre tamanhos',
        value: 'Conferido',
        state: 'Concluído',
      },
    ],
  },
  {
    id: 'mercados-padarias',
    code: '02',
    name: 'Mercados e Padarias',
    shortTag: 'Minimercados, empórios e panificadoras',
    summary: 'Agilidade no caixa para alto fluxo de clientes.',
    cardHighlights: [
      'PDV super rápido',
      'Integração com balança',
      'Controle de validade',
    ],
    workflow:
      'Opere frente de caixa de alta velocidade com leitor de código de barras, leitura direta do peso e etiqueta da balança, alerta preventivo de lotes próximos do vencimento e fechamento cego de caixa por turno.',
    capabilities: [
      'PDV super rápido com atalhos de teclado, PIX no caixa e TEF integrado',
      'Integração com balanças de checkout e geração de carga para balanças de setor',
      'Controle de lote e validade com alertas para evitar perdas na gôndola',
      'Gestão de ficha técnica para produção própria de padaria e rotisseria',
    ],
    impactMetric: 'Atendimento até 2x mais rápido em horários de pico no caixa',
    previewTitle: 'NexaERP — Frente de Caixa & Balança',
    previewSubtitle: 'PDV Rápido · Lotes & Validade',
    previewKpis: [
      { label: 'Cupons emitidos', value: '612' },
      { label: 'Tempo médio caixa', value: '24s' },
      { label: 'Lotes em alerta', value: '4' },
    ],
    previewRows: [
      {
        label: 'Checkout 01 — Venda Balança (Pão Francês + Frios)',
        detail: 'Peso lido automaticamente · NFC-e autorizada',
        value: 'R$ 48,70',
        state: 'Concluído',
      },
      {
        label: 'Lote L26-44 · Iogurte Integral 170g (Vence em 5 dias)',
        detail: 'Sugestão de ação promocional na gôndola',
        value: '36 un',
        state: 'Em análise',
      },
      {
        label: 'Fechamento Turno Manhã — Operador Caixa 02',
        detail: 'Dinheiro, PIX e Cartões conferidos sem divergência',
        value: 'R$ 6.420,50',
        state: 'Concluído',
      },
    ],
  },
  {
    id: 'bares-restaurantes',
    code: '03',
    name: 'Bares e Restaurantes',
    shortTag: 'Bares, lanchonetes, cafés e pizzarias',
    summary: 'Gestão completa da cozinha ao delivery.',
    cardHighlights: [
      'Comanda Eletrônica',
      'Sistema KDS (Cozinha)',
      'Gestão de mesas',
    ],
    workflow:
      'O garçom lança o pedido na comanda eletrônica pelo celular ou tablet, a cozinha visualiza a ordem em tempo real na tela KDS com tempo de preparo e o caixa fecha a conta da mesa com divisão simples entre clientes.',
    capabilities: [
      'Comanda eletrônica móvel com envio direto para bar e cozinha',
      'Sistema KDS (Kitchen Display System) com fila de preparo e alertas de atraso',
      'Mapa de mesas em tempo real com transferência, junção e divisão de conta',
      'Controle de pedidos de balcão, entrega própria e baixa automática de insumos',
    ],
    impactMetric: 'Eliminação de pedidos perdidos e redução no tempo de entrega à mesa',
    previewTitle: 'NexaERP — Salão, Comandas & Cozinha KDS',
    previewSubtitle: 'Mesas Ativas · Produção em Tempo Real',
    previewKpis: [
      { label: 'Mesas ocupadas', value: '18 / 24' },
      { label: 'Comandas na cozinha', value: '11' },
      { label: 'Tempo médio preparo', value: '14 min' },
    ],
    previewRows: [
      {
        label: 'Mesa 07 · Comanda #304 (2x Prato Executivo + Sucos)',
        detail: 'Em preparo no KDS Cozinha Quente há 8 min',
        value: 'R$ 138,00',
        state: 'Ativo',
      },
      {
        label: 'Mesa 12 · Fechamento Parcial (Divisão 3 pessoas)',
        detail: 'Taxa de serviço aplicada · PIX confirmado',
        value: 'R$ 264,00',
        state: 'Concluído',
      },
      {
        label: 'Delivery #892 — Bairro Centro (Motoqueiro Carlos)',
        detail: 'Saiu para entrega · Previsão 12 min',
        value: 'R$ 94,50',
        state: 'Ativo',
      },
    ],
  },
  {
    id: 'saloes-barbearias',
    code: '04',
    name: 'Salões e Barbearias',
    shortTag: 'Estética, barbearias e clínicas de beleza',
    summary: 'Organize sua agenda e fidelize clientes.',
    cardHighlights: [
      'Agendamento online',
      'Cálculo de comissões',
      'Pacotes de serviços',
    ],
    workflow:
      'Clientes agendam horários pelo link online com lembrete automático; ao finalizar o atendimento, o caixa registra produtos consumidos, abate sessões do pacote e calcula a comissão exata de cada profissional.',
    capabilities: [
      'Agendamento online por profissional, serviço e duração sem choque de horários',
      'Cálculo automático de comissões diferenciadas por serviço e venda de produtos',
      'Controle de pacotes de sessões, assinaturas mensais e saldo por cliente',
      'Histórico de atendimentos e lembretes automáticos para aumentar retorno',
    ],
    impactMetric: 'Fechamento de comissões em minutos e menos faltas na agenda',
    previewTitle: 'NexaERP — Agenda & Comissões',
    previewSubtitle: 'Agendamentos do Dia · Profissionais',
    previewKpis: [
      { label: 'Atendimentos hoje', value: '34' },
      { label: 'Ocupação agenda', value: '91%' },
      { label: 'Comissões apuradas', value: 'R$ 2.180' },
    ],
    previewRows: [
      {
        label: '14:30 · Corte + Barba Terapia (Prof. Rafael)',
        detail: 'Agendamento online confirmado · Pacote Clube Mensal',
        value: '1/4 usado',
        state: 'Ativo',
      },
      {
        label: '15:00 · Mechas + Hidratação (Prof. Juliana)',
        detail: 'Atendimento encerrado · Comissão 45% calculada',
        value: 'R$ 420,00',
        state: 'Concluído',
      },
      {
        label: 'Venda Produto — Pomada Modeladora + Óleo Barba',
        detail: 'Baixa automática no estoque · Comissão 10%',
        value: 'R$ 118,00',
        state: 'Concluído',
      },
    ],
  },
];

export const NEXA_PRODUCT: BasesysProduct = {
  id: 'nexa-erp',
  slug: 'nexa-erp',
  indexNumber: '01',
  name: 'NexaERP',
  shortName: 'NexaERP',
  category: 'Sistema de Vendas e Gestão · 4 Segmentos',
  audience: 'Pequenos e Médios Negócios',
  headline: 'Gerencie seu negócio com inteligência em uma única plataforma.',
  tagline: 'PDV, CRM, Estoque, Financeiro e Fiscal em Nuvem',
  description:
    'O sistema completo de vendas e gestão da Basesys para pequenos e médios negócios. Escolha seu segmento no cadastro e opere PDV, estoque, financeiro, CRM e emissão fiscal em uma única plataforma.',
  heroMetric: '4 segmentos',
  heroMetricContext: 'Lojas, Mercados, Bares/Restaurantes e Salões em um único sistema',
  secondaryMetric: '5 módulos',
  secondaryMetricContext: 'PDV, CRM, Estoque, Financeiro e Fiscal integrados nativamente',
  landingUrlLabel: 'basesys.com.br/solucoes/nexa-erp',
  integrations: [
    'Emissão SEFAZ (NFC-e, NF-e e NFS-e)',
    'Balanças de Checkout e Etiquetas',
    'PIX Dinâmico e Maquininhas TEF',
    'Agendamento Online & Comandas Mobile',
    'Exportação XML Contábil em 1 Clique',
  ],
  securityHighlights: [
    'Operação 100% em nuvem com backup automático diário',
    'Permissões granulares por perfil (caixa, garçom, vendedor e gerente)',
    'Histórico completo de movimentações, sangrias e cancelamentos',
  ],
  corePillars: [
    {
      title: 'PDV Frente de Caixa',
      description: 'Vendas rápidas no balcão, leitura de código de barras, PIX e emissão fiscal instantânea.',
    },
    {
      title: 'Estoque Inteligente',
      description: 'Controle por grade, validade, insumos de receita e giro de mercadorias sem planilhas.',
    },
    {
      title: 'Financeiro & Crediário',
      description: 'Fluxo de caixa diário, contas a pagar e receber, comissões e controle de crediário.',
    },
    {
      title: 'CRM & Fidelização',
      description: 'Cadastro de clientes, histórico de compras, pacotes de serviços e retorno recorrente.',
    },
    {
      title: 'Fiscal Simplificado',
      description: 'Emissão automática de NFC-e e NF-e e envio organizado dos XMLs para o seu contador.',
    },
  ],
  modules: NEXA_SEGMENTS,
  caseStudy: {
    quote:
      'Operávamos caixa em um programa, estoque em planilha e ainda perdíamos vendas por não saber a grade disponível na hora do atendimento. Com o NexaERP, caixa, estoque e crediário passaram a conversar em tempo real.',
    before: 'Controle manual em planilhas, etiquetas sem padrão e demora no fechamento de caixa',
    outcome: 'Atendimento no caixa 2x mais ágil, inventário organizado por grade e fechamento diário em minutos.',
    author: 'Camila Ferreira',
    role: 'Proprietária',
    company: 'Boutique & Calçados Horizonte',
    sector: 'Varejo de Moda · Segmento Lojas e Varejo',
  },
  plans: [
    {
      name: 'NexaERP Essencial',
      audience: 'Para negócios iniciando a gestão digital em 1 loja',
      billingNote: 'Escolha seu segmento na ativação',
      priceLabel: 'Sob consulta · PDV + Estoque + Financeiro',
      highlights: [
        'Módulo dedicado para 1 dos 4 segmentos disponíveis',
        'PDV ágil, controle de estoque e fluxo de caixa',
        'Cadastro completo de clientes e histórico de vendas',
        'Suporte técnico nacional via chat e WhatsApp',
      ],
    },
    {
      name: 'NexaERP Completo',
      audience: 'Operações em crescimento com foco fiscal e equipe',
      billingNote: 'Implantação assistida e treinamento da equipe',
      priceLabel: 'Sob consulta · Recursos completos do segmento',
      recommended: true,
      highlights: [
        'Emissão ilimitada de NFC-e e NF-e integrada ao PDV',
        'Recursos avançados: Grade/Crediário, Balança/Validade, KDS/Comanda ou Comissões/Agenda',
        'Controle de permissões por usuário e auditoria de caixa',
        'Painéis gerenciais de margem, lucro e metas de venda',
      ],
    },
    {
      name: 'NexaERP + Sob Medida',
      audience: 'Empresas com múltiplas unidades ou demandas específicas',
      billingNote: 'Escopo personalizado com engenharia Basesys',
      priceLabel: 'Projeto customizado',
      highlights: [
        'Customizações de fluxo, relatórios e integrações exclusivas',
        'Conexão com e-commerce, ERP externo ou aplicativos próprios',
        'Migração assistida de cadastros a partir do sistema anterior',
        'Acompanhamento técnico dedicado na entrada em produção',
      ],
    },
  ],
};

export const PRODUCTS: BasesysProduct[] = [NEXA_PRODUCT];

export const CUSTOM_SOFTWARE_OFFERING = {
  indexNumber: '02',
  category: 'Engenharia Dedicada · Qualquer Negócio',
  badgeLabel: 'Projeto Exclusivo',
  name: 'Sistemas Sob Medida',
  tagline: 'Software exclusivo projetado para as regras da sua operação',
  description:
    'Quando um sistema pronto não acompanha as particularidades da sua empresa, nossa equipe desenvolve plataformas web, portais internos e integrações 100% personalizadas para qualquer segmento.',
  metrics: [
    {
      value: '100% Web',
      context: 'Arquitetura moderna em nuvem preparada para crescer com sua empresa',
    },
    {
      value: 'API Aberta',
      context: 'Integrações nativas com ERPs, bancos, e-commerces e sistemas legados',
    },
  ],
  deliverables: [
    'Mapeamento de regras de negócio e prototipação',
    'Desenvolvimento web sob medida e painéis gerenciais',
    'Integrações via APIs REST, Webhooks e bancos',
    'Implantação assistida e evolução contínua',
  ],
};

export interface LeadInterestOption {
  value: string;
  label: string;
}

export const LEAD_INTEREST_OPTIONS: LeadInterestOption[] = [
  { value: 'nexa-erp', label: 'NexaERP — Visão Geral do Sistema' },
  { value: 'lojas-varejo', label: 'NexaERP — Lojas e Varejo' },
  { value: 'mercados-padarias', label: 'NexaERP — Mercados e Padarias' },
  { value: 'bares-restaurantes', label: 'NexaERP — Bares e Restaurantes' },
  { value: 'saloes-barbearias', label: 'NexaERP — Salões e Barbearias' },
  { value: 'sob-medida', label: 'Sistema Sob Medida (Projeto Exclusivo)' },
];

export const CORPORATE_METRICS = [
  { value: '140+', label: 'Empresas operando em produção com soluções Basesys' },
  { value: '99,94%', label: 'Disponibilidade média em nuvem nos últimos 12 meses' },
  { value: 'Sob medida', label: 'Projetos exclusivos e NexaERP pronto para 4 segmentos' },
  { value: '100%', label: 'Suporte técnico nacional com equipe própria de engenharia' },
];

export const ENGINEERING_PILLARS = [
  {
    number: '01',
    title: 'NexaERP Pronto & Sistemas Sob Medida',
    description:
      'Entregamos o NexaERP pronto para Lojas, Mercados, Restaurantes e Salões — e também desenvolvemos sistemas exclusivos para qualquer tipo de negócio.',
  },
  {
    number: '02',
    title: 'Operação em Nuvem e Integração Real',
    description:
      'Plataformas acessíveis de qualquer lugar com emissão fiscal, integração com balanças, comandas, meios de pagamento e APIs abertas.',
  },
  {
    number: '03',
    title: 'Implantação Assistida por Especialistas',
    description:
      'Não entregamos apenas login e senha. Nossa equipe apoia a configuração do segmento, importação de cadastros e treinamento prático da sua equipe.',
  },
];

export const HUB_RESULTS_HIGHLIGHTS = [
  {
    badge: 'Produto Pronto · NexaERP',
    sector: 'Varejo, Alimentação e Beleza',
    title: 'Operação unificada do balcão ao fechamento fiscal sem retrabalho.',
    quote:
      'Operávamos caixa em um sistema, estoque em planilha e comissões no papel. Com o NexaERP, cada venda já atualiza o estoque, o financeiro e os indicadores na hora.',
    outcome:
      'Mais agilidade no atendimento de balcão, controle real de margem e redução de perdas operacionais.',
    author: 'Camila Ferreira',
    role: 'Varejo & Atendimento ao Cliente',
    ctaLabel: 'Conhecer o NexaERP',
    actionType: 'product' as const,
  },
  {
    badge: 'Engenharia Sob Medida · Basesys',
    sector: 'Projetos Exclusivos para Qualquer Negócio',
    title: 'Quando sua empresa precisa de regras únicas que sistemas prontos não atendem.',
    quote:
      'Precisávamos automatizar aprovações internas, tabelas específicas e integração com nosso legado. A Basesys desenhou e entregou o sistema exatamente como a operação funciona.',
    outcome:
      'Fluxo operacional centralizado em plataforma própria, eliminando controles paralelos em planilhas.',
    author: 'Eduardo Nogueira',
    role: 'Gestão Operacional · Projeto Sob Medida',
    ctaLabel: 'Solicitar Diagnóstico Sob Medida',
    actionType: 'custom' as const,
  },
];

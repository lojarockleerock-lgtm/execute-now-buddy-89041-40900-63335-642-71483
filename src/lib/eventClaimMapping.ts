// Mapeamento completo entre tipos de eventos e pedidos automáticos

export interface EventType {
  value: string;
  label: string;
  description: string;
  suggestedDescription: string;
  suggestedClaims: string[];
}

export const eventTypes: EventType[] = [
  {
    value: "admissao",
    label: "Admissão",
    description: "Contratação irregular ou sem registro",
    suggestedDescription: "O reclamante foi admitido em [data] para exercer a função de [cargo], com salário de [valor], sem o devido registro em CTPS.",
    suggestedClaims: ["reconhecimentoVinculo", "faltaRegistroCTPS", "fgts"]
  },
  {
    value: "alteracao_contratual",
    label: "Alteração Contratual",
    description: "Mudança de salário, função ou local sem concordância",
    suggestedDescription: "Em [data], o reclamante teve seu salário/função/local de trabalho alterado sem sua concordância.",
    suggestedClaims: ["desvioFuncao"]
  },
  {
    value: "terceirizacao_pj",
    label: "Terceirização / PJ",
    description: "Prestação de serviços como PJ mas com subordinação",
    suggestedDescription: "O reclamante prestava serviços como [PJ/terceirizado], mas com subordinação e habitualidade.",
    suggestedClaims: ["pejotizacao", "reconhecimentoVinculo", "fgts"]
  },
  {
    value: "horas_extras",
    label: "Horas Extras",
    description: "Trabalho além da jornada sem pagamento",
    suggestedDescription: "O reclamante realizou horas extras entre [datas], sem o devido pagamento ou compensação.",
    suggestedClaims: ["horasExtras", "multa467"]
  },
  {
    value: "intervalo_nao_concedido",
    label: "Intervalo Não Concedido",
    description: "Intervalo intrajornada não usufruído",
    suggestedDescription: "Durante a jornada, o reclamante não usufruía integralmente do intervalo intrajornada previsto em lei.",
    suggestedClaims: ["horasExtras"]
  },
  {
    value: "plantao_sobreaviso",
    label: "Plantão / Sobreaviso",
    description: "Disponibilidade fora do horário de trabalho",
    suggestedDescription: "O reclamante permanecia de sobreaviso, aguardando chamadas fora do horário normal de trabalho.",
    suggestedClaims: ["horasExtras"]
  },
  {
    value: "salario_atrasado",
    label: "Salário Atrasado / Não Pago",
    description: "Atraso ou falta de pagamento de salário",
    suggestedDescription: "O empregador deixou de pagar o salário referente ao mês de [mês/ano].",
    suggestedClaims: ["multa467", "multa477", "rescisaoIndireta"]
  },
  {
    value: "diferencas_salariais",
    label: "Diferenças Salariais",
    description: "Mesma função com salário inferior",
    suggestedDescription: "O reclamante exercia a mesma função que outros empregados, recebendo salário inferior.",
    suggestedClaims: ["desvioFuncao"]
  },
  {
    value: "fgts_nao_recolhido",
    label: "FGTS Não Recolhido",
    description: "Depósitos de FGTS não realizados",
    suggestedDescription: "O empregador não efetuou os depósitos de FGTS no período de [datas].",
    suggestedClaims: ["fgts"]
  },
  {
    value: "decimo_ferias_nao_pagos",
    label: "13º Salário / Férias Não Pagas",
    description: "Verbas não quitadas",
    suggestedDescription: "O reclamante não recebeu o 13º salário e/ou férias referentes ao período de [ano].",
    suggestedClaims: ["decimoTerceiro", "feriasNaoPagas", "multa467"]
  },
  {
    value: "rescisao_sem_justa_causa",
    label: "Rescisão Sem Justa Causa",
    description: "Dispensa sem justa causa com verbas não pagas",
    suggestedDescription: "O reclamante foi dispensado sem justa causa em [data], sem receber as verbas rescisórias.",
    suggestedClaims: ["fgts", "decimoTerceiro", "feriasNaoPagas", "multa467", "multa477"]
  },
  {
    value: "justa_causa_indevida",
    label: "Justa Causa Indevida",
    description: "Dispensa por justa causa sem motivo real",
    suggestedDescription: "O reclamante foi dispensado por justa causa em [data], sem motivo real.",
    suggestedClaims: ["assedioMoral"]
  },
  {
    value: "rescisao_indireta",
    label: "Rescisão Indireta",
    description: "Faltas graves do empregador",
    suggestedDescription: "O empregador cometeu faltas graves, tornando impossível a continuidade do contrato.",
    suggestedClaims: ["rescisaoIndireta", "assedioMoral"]
  },
  {
    value: "aviso_previo_nao_concedido",
    label: "Aviso Prévio Não Concedido",
    description: "Dispensa sem aviso prévio ou seu cumprimento",
    suggestedDescription: "O reclamante não recebeu aviso prévio ou foi dispensado sem seu cumprimento.",
    suggestedClaims: ["multa477"]
  },
  {
    value: "atestado_doenca",
    label: "Atestado / Doença",
    description: "Atestado médico não aceito",
    suggestedDescription: "O reclamante apresentou atestado médico em [data], que não foi aceito pela empresa.",
    suggestedClaims: ["estabilidadeAcidentaria"]
  },
  {
    value: "acidente_trabalho",
    label: "Acidente de Trabalho",
    description: "Acidente ocorrido no ambiente de trabalho",
    suggestedDescription: "O reclamante sofreu acidente de trabalho em [data], resultando em [descrição da lesão].",
    suggestedClaims: ["estabilidadeAcidentaria", "assedioMoral"]
  },
  {
    value: "doenca_ocupacional",
    label: "Doença Ocupacional",
    description: "Doença desenvolvida pelas condições de trabalho",
    suggestedDescription: "O reclamante desenvolveu [doença] em razão das condições de trabalho.",
    suggestedClaims: ["estabilidadeAcidentaria", "insalubridade"]
  },
  {
    value: "retorno_negado",
    label: "Retorno Negado",
    description: "Recusa de retorno após afastamento médico",
    suggestedDescription: "Após o afastamento médico, a empresa recusou o retorno do reclamante ao trabalho.",
    suggestedClaims: ["estabilidadeAcidentaria", "rescisaoIndireta"]
  },
  {
    value: "assedio_moral",
    label: "Assédio Moral",
    description: "Humilhações e constrangimentos no trabalho",
    suggestedDescription: "O reclamante foi vítima de assédio moral no ambiente de trabalho, em [data], por parte de [superior/colega].",
    suggestedClaims: ["assedioMoral", "rescisaoIndireta"]
  },
  {
    value: "assedio_sexual",
    label: "Assédio Sexual",
    description: "Condutas inapropriadas de natureza sexual",
    suggestedDescription: "O reclamante sofreu condutas inapropriadas de natureza sexual no trabalho.",
    suggestedClaims: ["assedioMoral", "rescisaoIndireta"]
  },
  {
    value: "discriminacao",
    label: "Discriminação",
    description: "Discriminação por raça, gênero, orientação ou idade",
    suggestedDescription: "O reclamante foi discriminado por motivo de [raça/gênero/orientação/idade].",
    suggestedClaims: ["assedioMoral", "rescisaoIndireta"]
  },
  {
    value: "advertencia_suspensao_injusta",
    label: "Advertência / Suspensão Injusta",
    description: "Penalidade sem justificativa formal",
    suggestedDescription: "O reclamante recebeu advertência/suspensão em [data], sem justificativa formal.",
    suggestedClaims: ["assedioMoral"]
  },
  {
    value: "descontos_indevidos",
    label: "Descontos Indevidos",
    description: "Descontos sem justificativa",
    suggestedDescription: "O empregador efetuou descontos no salário do reclamante sem justificativa.",
    suggestedClaims: ["multa467"]
  },
  {
    value: "ferias_nao_concedidas",
    label: "Férias Não Concedidas",
    description: "Férias não usufruídas",
    suggestedDescription: "O reclamante não usufruiu de férias relativas ao período aquisitivo de [ano].",
    suggestedClaims: ["feriasNaoPagas"]
  },
  {
    value: "feriados_domingos_trabalhados",
    label: "Feriados / Domingos Trabalhados",
    description: "Trabalho em dias de descanso sem compensação",
    suggestedDescription: "O reclamante trabalhou em domingos e feriados sem compensação.",
    suggestedClaims: ["horasExtras"]
  },
  {
    value: "trabalho_sem_registro",
    label: "Trabalho Sem Registro",
    description: "Período trabalhado sem registro em CTPS",
    suggestedDescription: "O reclamante trabalhou sem registro em CTPS de [data inicial] a [data final].",
    suggestedClaims: ["faltaRegistroCTPS", "reconhecimentoVinculo", "fgts"]
  },
  {
    value: "estagio_cooperativa_fraudulenta",
    label: "Estágio / Cooperativa Fraudulenta",
    description: "Relação de emprego mascarada",
    suggestedDescription: "O reclamante atuava como estagiário/cooperado, mas em condições típicas de emprego.",
    suggestedClaims: ["reconhecimentoVinculo", "fgts"]
  },
  {
    value: "insalubridade_periculosidade",
    label: "Insalubridade / Periculosidade",
    description: "Trabalho em ambiente insalubre ou perigoso",
    suggestedDescription: "O reclamante laborava em ambiente [insalubre/perigoso] sem o pagamento do adicional.",
    suggestedClaims: ["insalubridade", "periculosidade"]
  },
  {
    value: "falta_epi",
    label: "Falta de EPI / Condições Inadequadas",
    description: "EPIs não fornecidos adequadamente",
    suggestedDescription: "A empresa não fornecia os EPIs adequados à função desempenhada.",
    suggestedClaims: ["insalubridade", "assedioMoral"]
  },
  {
    value: "transferencia_mudanca_local",
    label: "Transferência / Mudança de Local",
    description: "Transferência sem concordância",
    suggestedDescription: "O reclamante foi transferido para local distante sem concordância.",
    suggestedClaims: ["desvioFuncao"]
  },
  {
    value: "promocao_negada",
    label: "Promoção Negada",
    description: "Promoção devida não concedida",
    suggestedDescription: "O reclamante preencheu os requisitos para promoção em [data], mas não foi promovido.",
    suggestedClaims: ["desvioFuncao"]
  },
  {
    value: "treinamento_deslocamento_nao_pago",
    label: "Treinamento / Deslocamento Não Pago",
    description: "Atividades fora da jornada sem pagamento",
    suggestedDescription: "O reclamante participou de treinamentos e deslocamentos fora da jornada, sem pagamento.",
    suggestedClaims: ["horasExtras"]
  },
  {
    value: "nao_cumprimento_acordo_coletivo",
    label: "Não Cumprimento de Acordo Coletivo",
    description: "Descumprimento de convenção/acordo coletivo",
    suggestedDescription: "A empresa descumpriu cláusulas da convenção/acordo coletivo de [ano].",
    suggestedClaims: ["desvioFuncao", "multa467"]
  }
];

export const dismissalTypes = {
  regular: [
    {
      value: "sem_justa_causa",
      label: "Demissão sem justa causa (iniciativa do empregador)",
      description: "O empregador deve pagar todas as verbas rescisórias e dar aviso prévio."
    },
    {
      value: "com_justa_causa",
      label: "Demissão por justa causa (falta grave do funcionário)",
      description: "Demissão por falta grave (improbidade, insubordinação, abandono). Direitos reduzidos."
    },
    {
      value: "pedido_demissao",
      label: "Pedido de demissão (iniciativa do funcionário)",
      description: "Empregado decide sair. Empregador não paga verbas rescisórias ou aviso prévio."
    },
    {
      value: "rescisao_indireta",
      label: "Rescisão indireta (falta grave do empregador)",
      description: "Empregado 'demite' o patrão por falta grave. Direito a todas as verbas como demissão sem justa causa."
    },
    {
      value: "acordo",
      label: "Acordo entre as partes (consensual)",
      description: "Partes concordam mutuamente com o fim do contrato, estabelecendo condições."
    },
    {
      value: "incentivada",
      label: "Demissão voluntária incentivada",
      description: "Empregador oferece plano de benefícios para saída voluntária."
    }
  ],
  probation: [
    {
      value: "experiencia_sem_justa_causa",
      label: "Dispensa antecipada sem justa causa (período de experiência)",
      description: "Verbas: Saldo de salário, 13º proporcional, férias proporcionais com 1/3, saque do FGTS, multa de 40% sobre FGTS, indenização de 50% dos dias restantes do contrato, seguro-desemprego (se aplicável)."
    },
    {
      value: "experiencia_com_justa_causa",
      label: "Dispensa com justa causa (período de experiência)",
      description: "Verbas: Apenas saldo de salário. Direitos perdidos: FGTS, multa 40%, 13º e férias proporcionais, indenização de 50%, seguro-desemprego."
    },
    {
      value: "experiencia_iniciativa_empregado",
      label: "Rescisão por iniciativa do empregado (período de experiência)",
      description: "Verbas: Saldo de salário, 13º proporcional, férias proporcionais com 1/3, saque do FGTS. Pode ter que pagar indenização ao empregador se houver cláusula contratual."
    },
    {
      value: "experiencia_termino_natural",
      label: "Término natural do contrato de experiência",
      description: "Verbas: Saldo de salário, 13º proporcional, férias proporcionais com 1/3, saque do FGTS. Direitos perdidos: Multa 40% do FGTS, indenização de 50%, seguro-desemprego."
    }
  ]
};

export function getEventTypeByValue(value: string): EventType | undefined {
  return eventTypes.find(et => et.value === value);
}

export function getSuggestedClaimsForEvent(eventValue: string): string[] {
  const eventType = getEventTypeByValue(eventValue);
  return eventType?.suggestedClaims || [];
}

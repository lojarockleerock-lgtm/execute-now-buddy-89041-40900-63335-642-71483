// Mapeamento de provas sugeridas por tipo de pedido

export interface SuggestedEvidence {
  type: string;
  label: string;
  description: string;
  icon: string;
}

export const evidenceSuggestionsByClaimType: Record<string, SuggestedEvidence[]> = {
  horasExtras: [
    { type: "cartao_ponto", label: "Cartões de ponto", description: "Registros de entrada/saída", icon: "Clock" },
    { type: "escalas", label: "Escalas de trabalho", description: "Planilhas ou comunicados de horários", icon: "Calendar" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que presenciaram", icon: "Users" },
    { type: "mensagens", label: "Conversas (WhatsApp/E-mail)", description: "Prints de conversas sobre horários", icon: "MessageSquare" },
    { type: "holerite", label: "Comprovantes de pagamento", description: "Holerites do período", icon: "FileText" },
  ],
  
  adicionalNoturno: [
    { type: "cartao_ponto", label: "Cartões de ponto", description: "Registros de entrada/saída noturna", icon: "Clock" },
    { type: "escalas", label: "Escalas de trabalho", description: "Comprovação de horário noturno", icon: "Calendar" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas do turno noturno", icon: "Users" },
    { type: "holerite", label: "Holerites", description: "Sem adicional noturno pago", icon: "FileText" },
  ],

  assedioMoral: [
    { type: "mensagens", label: "Mensagens", description: "Prints de WhatsApp, e-mails ofensivos", icon: "MessageSquare" },
    { type: "gravacoes", label: "Gravações de áudio", description: "Conversas ofensivas", icon: "Mic" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que presenciaram", icon: "Users" },
    { type: "rh_registros", label: "Registros internos de RH", description: "Reclamações ou denúncias", icon: "FileText" },
    { type: "atestados", label: "Atestados médicos", description: "Problemas psicológicos relacionados", icon: "Heart" },
  ],

  acidenteTrabalho: [
    { type: "cat", label: "CAT", description: "Comunicação de Acidente de Trabalho", icon: "AlertTriangle" },
    { type: "atestados", label: "Atestados médicos", description: "Laudos e exames", icon: "Heart" },
    { type: "fotos", label: "Fotos do local", description: "Registro do ambiente/equipamentos", icon: "Camera" },
    { type: "boletim", label: "Boletim de ocorrência", description: "Registro policial (se aplicável)", icon: "FileText" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas presentes no acidente", icon: "Users" },
  ],

  feriasNaoPagas: [
    { type: "escalas", label: "Escalas anuais", description: "Comprovação de trabalho nos períodos", icon: "Calendar" },
    { type: "holerite", label: "Comprovantes de férias pagas", description: "Holerites sem pagamento de férias", icon: "FileText" },
    { type: "mensagens", label: "Mensagens", description: "Negativa de concessão de férias", icon: "MessageSquare" },
  ],

  fgts: [
    { type: "extrato_caixa", label: "Extrato da Caixa", description: "Consulta FGTS digital", icon: "FileText" },
    { type: "holerite", label: "Contracheques", description: "Período sem depósito", icon: "FileText" },
    { type: "ctps", label: "CTPS", description: "Carteira de trabalho", icon: "BookOpen" },
  ],

  faltaRegistroCTPS: [
    { type: "mensagens", label: "Prints de conversas", description: "Combinações sobre trabalho", icon: "MessageSquare" },
    { type: "comprovantes_pagamento", label: "Comprovantes de pagamento", description: "Transferências, depósitos", icon: "Receipt" },
    { type: "crachas", label: "Crachás", description: "Fotos de identificação da empresa", icon: "IdCard" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que confirmam trabalho", icon: "Users" },
    { type: "fotos", label: "Fotos", description: "No local de trabalho", icon: "Camera" },
  ],

  reconhecimentoVinculo: [
    { type: "mensagens", label: "Prints de conversas", description: "Subordinação e ordens", icon: "MessageSquare" },
    { type: "comprovantes_pagamento", label: "Comprovantes de pagamento", description: "Histórico de recebimentos", icon: "Receipt" },
    { type: "crachas", label: "Crachás", description: "Identificação da empresa", icon: "IdCard" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que confirmam subordinação", icon: "Users" },
    { type: "contrato", label: "Contrato PJ ou recibo", description: "Documentos da relação", icon: "FileText" },
  ],

  pejotizacao: [
    { type: "contrato_pj", label: "Contrato PJ", description: "Documento de abertura do CNPJ", icon: "FileText" },
    { type: "mensagens", label: "Mensagens", description: "Ordens e subordinação", icon: "MessageSquare" },
    { type: "testemunhas", label: "Testemunhas", description: "Confirmação de subordinação", icon: "Users" },
    { type: "cartao_ponto", label: "Registros de ponto", description: "Comprovação de horário fixo", icon: "Clock" },
  ],

  rescisaoIndireta: [
    { type: "holerite", label: "Holerites", description: "Salários atrasados", icon: "FileText" },
    { type: "mensagens", label: "Mensagens", description: "Faltas graves do empregador", icon: "MessageSquare" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que presenciaram", icon: "Users" },
    { type: "atestados", label: "Atestados médicos", description: "Problemas de saúde causados", icon: "Heart" },
  ],

  insalubridade: [
    { type: "fotos", label: "Fotos do ambiente", description: "Registro das condições", icon: "Camera" },
    { type: "laudos", label: "Laudos periciais", description: "PPP, PPRA, LTCAT", icon: "FileText" },
    { type: "atestados", label: "Exames ocupacionais", description: "ASO e exames complementares", icon: "Heart" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que trabalharam no local", icon: "Users" },
  ],

  periculosidade: [
    { type: "fotos", label: "Fotos do ambiente", description: "Registro das condições perigosas", icon: "Camera" },
    { type: "laudos", label: "Laudos periciais", description: "PPP, PPRA", icon: "FileText" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas expostos ao perigo", icon: "Users" },
  ],

  estabilidadeAcidentaria: [
    { type: "cat", label: "CAT", description: "Comunicação de Acidente de Trabalho", icon: "AlertTriangle" },
    { type: "atestados", label: "Atestados médicos", description: "Laudos e exames", icon: "Heart" },
    { type: "rescisao", label: "Termo de rescisão", description: "Comprovação da demissão", icon: "FileText" },
    { type: "inss", label: "Documentos do INSS", description: "Afastamento previdenciário", icon: "FileText" },
  ],

  desvioFuncao: [
    { type: "ctps", label: "CTPS", description: "Função registrada", icon: "BookOpen" },
    { type: "testemunhas", label: "Testemunhas", description: "Colegas que confirmam desvio", icon: "Users" },
    { type: "mensagens", label: "Mensagens", description: "Ordens para executar outras funções", icon: "MessageSquare" },
    { type: "fotos", label: "Fotos", description: "Executando outras atividades", icon: "Camera" },
  ],

  decimoTerceiro: [
    { type: "holerite", label: "Holerites", description: "Ausência de pagamento", icon: "FileText" },
    { type: "extrato", label: "Extratos bancários", description: "Período sem depósito", icon: "Receipt" },
    { type: "ctps", label: "CTPS", description: "Comprovação de vínculo", icon: "BookOpen" },
  ],

  multa467: [
    { type: "notificacao", label: "Notificação judicial", description: "Ata de audiência", icon: "FileText" },
    { type: "holerite", label: "Holerites", description: "Verbas não pagas", icon: "FileText" },
  ],

  multa477: [
    { type: "rescisao", label: "Termo de rescisão", description: "Data da demissão", icon: "FileText" },
    { type: "holerite", label: "Holerites", description: "Verbas rescisórias não pagas", icon: "FileText" },
    { type: "notificacao", label: "Notificação", description: "Cobrança das verbas", icon: "FileText" },
  ],
};

export function getSuggestedEvidencesForClaim(claimType: string): SuggestedEvidence[] {
  return evidenceSuggestionsByClaimType[claimType] || [];
}

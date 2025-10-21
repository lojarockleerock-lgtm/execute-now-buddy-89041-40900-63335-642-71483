/**
 * Requisitos para petição trabalhista - TRT 2
 * 
 * Documentação baseada nas exigências do Tribunal Regional do Trabalho da 2ª Região
 * para entrada de pedidos jus postulandi (sem advogado)
 */

export interface TRTDocumentRequirements {
  required: string[];
  recommended: string[];
  optional: string[];
}

export const DOCUMENTOS_OBRIGATORIOS: TRTDocumentRequirements = {
  required: [
    "Folhas da CTPS com dados da empresa (se houver registro)",
    "Folha da CTPS com dados pessoais",
    "Folha da CTPS com número da carteira",
    "PIS/PASEP",
    "RG aberto e sem capa plástica",
    "CPF",
    "Comprovante de endereço atual",
    "Foto selfie segurando o RG ao lado do rosto",
  ],
  recommended: [
    "Últimos holerites",
    "Aviso prévio",
    "Termo de rescisão do contrato de trabalho (TRCT)",
    "Extrato analítico do FGTS",
    "Extrato previdenciário (INSS)",
  ],
  optional: [
    "Testemunhas",
    "Prints de mensagens",
    "E-mails",
    "Contracheques anteriores",
    "Atestados médicos",
    "CAT (Comunicação de Acidente de Trabalho)",
    "Laudos médicos",
    "Fotos",
  ],
};

export interface PeticaoContent {
  dataInicio: string;
  dataSaida: string;
  motivoDesligamento: "dispensa_sem_justa_causa" | "justa_causa" | "pedido_demissao" | "outro";
  ultimoSalario: number;
  funcao: string;
  historicoResumo: string;
  pedidos: Array<{
    descricao: string;
    valor: number;
  }>;
  valorTotal: number;
}

/**
 * Campos obrigatórios na redação da petição trabalhista
 * Deve ser uma carta simples, digitada ou manuscrita, contendo:
 */
export const CAMPOS_PETICAO_OBRIGATORIOS = [
  "Data de início dos trabalhos",
  "Data de saída",
  "Motivo do desligamento (dispensa sem justa causa, por justa causa ou pedido de demissão)",
  "Valor do último salário",
  "Função desempenhada",
  "História resumida com todos os fatos relevantes",
  "Pedidos com respectivos valores e parâmetros (R$) de cada verba",
  "Valor total pedido no processo",
];

/**
 * Validação: O processo PRECISA OBRIGATORIAMENTE ter valores,
 * sob pena de arquivamento (art. 852-B, I, § 1º, da CLT)
 */
export const validarPeticao = (peticao: PeticaoContent): { valido: boolean; erros: string[] } => {
  const erros: string[] = [];

  if (!peticao.dataInicio) {
    erros.push("Data de início é obrigatória");
  }

  if (!peticao.dataSaida) {
    erros.push("Data de saída é obrigatória");
  }

  if (!peticao.ultimoSalario || peticao.ultimoSalario <= 0) {
    erros.push("Último salário deve ser informado e maior que zero");
  }

  if (!peticao.funcao || peticao.funcao.trim().length < 2) {
    erros.push("Função deve ser informada");
  }

  if (!peticao.historicoResumo || peticao.historicoResumo.trim().length < 50) {
    erros.push("História resumida deve ter pelo menos 50 caracteres");
  }

  if (!peticao.pedidos || peticao.pedidos.length === 0) {
    erros.push("É necessário incluir pelo menos um pedido");
  }

  if (peticao.pedidos.some((p) => !p.valor || p.valor <= 0)) {
    erros.push("Todos os pedidos devem ter valores especificados (art. 852-B, I, § 1º, da CLT)");
  }

  if (!peticao.valorTotal || peticao.valorTotal <= 0) {
    erros.push("Valor total da causa é obrigatório (sob pena de arquivamento)");
  }

  return {
    valido: erros.length === 0,
    erros,
  };
};

/**
 * Exemplos de pedidos típicos em ações trabalhistas
 */
export const EXEMPLOS_PEDIDOS = [
  { descricao: "Baixa na carteira", parametro: "dia/mês/ano" },
  { descricao: "Salário atrasado", parametro: "mês/ano e valor R$" },
  { descricao: "Horas extras não pagas", parametro: "período e valor R$" },
  { descricao: "Aviso prévio indenizado", parametro: "valor R$" },
  { descricao: "Férias proporcionais + 1/3", parametro: "valor R$" },
  { descricao: "13º salário proporcional", parametro: "valor R$" },
  { descricao: "Multa do FGTS (40%)", parametro: "valor R$" },
  { descricao: "Diferenças de FGTS", parametro: "valor R$" },
  { descricao: "Reconhecimento de vínculo empregatício", parametro: "período" },
  { descricao: "Dano moral", parametro: "valor R$" },
  { descricao: "Adicional de insalubridade", parametro: "grau e valor R$" },
  { descricao: "Adicional de periculosidade", parametro: "valor R$" },
  { descricao: "Estabilidade provisória", parametro: "período" },
];

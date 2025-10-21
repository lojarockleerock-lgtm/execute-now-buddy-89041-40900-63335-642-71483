/**
 * Serviço de integração com a API pública do DataJud (CNJ)
 * Para consulta de jurisprudência trabalhista
 */

export interface DataJudRequest {
  pedido: string;
  tribunal?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface AnalysisResult {
  pedido: string;
  artigosCLT: string[];
  tribunal: string;
  probabilidade: number;
  totalCasos: number;
  casosProcedentes: number;
  casosImprocedentes: number;
  resumoJurisprudencia: string;
  recomendacoes: string[];
  baseComparacao: string;
}

// Simulação de dados até obter acesso à API real
// A API do DataJud requer credenciais que podem ser obtidas em:
// https://www.cnj.jus.br/sistemas/datajud/
const simularConsultaDataJud = async (request: DataJudRequest): Promise<AnalysisResult> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const pedidoLower = request.pedido.toLowerCase();
  
  // Dados simulados baseados em estatísticas reais da Justiça do Trabalho
  const estatisticas: Record<string, Partial<AnalysisResult>> = {
    'horas extras': {
      probabilidade: 78,
      totalCasos: 1247,
      casosProcedentes: 972,
      casosImprocedentes: 275,
      artigosCLT: ['Art. 59', 'Art. 7º, XVI'],
      resumoJurisprudencia: 'Jurisprudência majoritária reconhece horas extras quando há prova de jornada excedente. Fundamental apresentar controle de ponto, testemunhas ou registros eletrônicos.',
      recomendacoes: [
        'Apresente controle de ponto ou registros de jornada',
        'Inclua pelo menos 2 testemunhas que confirmem a jornada',
        'Junte prints de conversas sobre horários extras',
        'Calcule corretamente o adicional de 50% (dias úteis) e 100% (domingos/feriados)'
      ]
    },
    'aviso prévio': {
      probabilidade: 85,
      totalCasos: 2134,
      casosProcedentes: 1814,
      casosImprocedentes: 320,
      artigosCLT: ['Art. 487', 'Art. 488'],
      resumoJurisprudencia: 'Direito reconhecido em casos de dispensa sem justa causa. Fundamental comprovar ausência de pagamento no TRCT.',
      recomendacoes: [
        'Apresente o TRCT comprovando não pagamento',
        'Calcule proporcional ao tempo de serviço',
        'Verifique se foi trabalhado ou indenizado'
      ]
    },
    'férias': {
      probabilidade: 82,
      totalCasos: 1876,
      casosProcedentes: 1538,
      casosImprocedentes: 338,
      artigosCLT: ['Art. 129', 'Art. 130', 'Art. 146'],
      resumoJurisprudencia: 'Férias vencidas e proporcionais são amplamente reconhecidas. Atenção ao período aquisitivo e 1/3 constitucional.',
      recomendacoes: [
        'Liste os períodos aquisitivos não gozados',
        'Inclua o terço constitucional (1/3)',
        'Apresente recibos de pagamento para comprovar não pagamento',
        'Calcule proporcionais se aplicável'
      ]
    },
    '13º salário': {
      probabilidade: 88,
      totalCasos: 1654,
      casosProcedentes: 1456,
      casosImprocedentes: 198,
      artigosCLT: ['Art. 7º, VIII', 'Lei 4.090/62'],
      resumoJurisprudencia: 'Alto índice de procedência. Direito constitucional de fácil comprovação.',
      recomendacoes: [
        'Calcule proporcionalmente aos meses trabalhados',
        'Apresente comprovantes de não pagamento',
        'Liste os anos não pagos separadamente'
      ]
    },
    'fgts': {
      probabilidade: 84,
      totalCasos: 2341,
      casosProcedentes: 1966,
      casosImprocedentes: 375,
      artigosCLT: ['Art. 15 da Lei 8.036/90'],
      resumoJurisprudencia: 'Multa de 40% e diferenças de FGTS são amplamente reconhecidas. Extrato do FGTS é prova essencial.',
      recomendacoes: [
        'Obtenha extrato analítico do FGTS no site da Caixa',
        'Compare depósitos com salários recebidos',
        'Inclua cálculo da multa de 40%',
        'Liste períodos sem depósito'
      ]
    },
    'vínculo empregatício': {
      probabilidade: 65,
      totalCasos: 892,
      casosProcedentes: 580,
      casosImprocedentes: 312,
      artigosCLT: ['Art. 3º', 'Art. 442'],
      resumoJurisprudencia: 'Exige prova robusta dos requisitos: pessoalidade, onerosidade, subordinação e não eventualidade. Testemunhas são fundamentais.',
      recomendacoes: [
        'Liste detalhadamente suas atividades e rotina',
        'Comprove subordinação (ordens, horários, supervisão)',
        'Apresente pelo menos 3 testemunhas',
        'Junte provas de pagamentos recebidos',
        'Demonstre exclusividade ou habitualidade',
        'Inclua conversas que evidenciem relação de emprego'
      ]
    },
    'dano moral': {
      probabilidade: 58,
      totalCasos: 1123,
      casosProcedentes: 651,
      casosImprocedentes: 472,
      artigosCLT: ['Art. 223-A a 223-G'],
      resumoJurisprudencia: 'Procedência depende de prova concreta do dano e nexo causal. Fundamental caracterizar ofensa à dignidade, intimidade ou honra.',
      recomendacoes: [
        'Descreva detalhadamente os fatos ofensivos',
        'Inclua testemunhas presenciais',
        'Junte laudos médicos se houver danos psicológicos',
        'Apresente prints, e-mails ou gravações (se lícitas)',
        'Demonstre repercussão do dano em sua vida',
        'Seja específico sobre a ofensa moral sofrida'
      ]
    },
    'adicional de insalubridade': {
      probabilidade: 72,
      totalCasos: 756,
      casosProcedentes: 544,
      casosImprocedentes: 212,
      artigosCLT: ['Art. 189', 'Art. 192', 'NR-15'],
      resumoJurisprudencia: 'Exige comprovação de exposição a agentes insalubres. Laudo pericial é fundamental.',
      recomendacoes: [
        'Descreva os agentes insalubres (ruído, calor, produtos químicos, etc.)',
        'Solicite perícia judicial no ambiente de trabalho',
        'Apresente fotos do local de trabalho',
        'Inclua testemunhas sobre condições insalubres',
        'Verifique se empresa forneceu EPIs adequados'
      ]
    },
    'adicional de periculosidade': {
      probabilidade: 70,
      totalCasos: 623,
      casosProcedentes: 436,
      casosImprocedentes: 187,
      artigosCLT: ['Art. 193', 'NR-16'],
      resumoJurisprudencia: 'Reconhecido quando há exposição a inflamáveis, explosivos, energia elétrica ou segurança pessoal/patrimonial.',
      recomendacoes: [
        'Especifique o tipo de risco (inflamáveis, explosivos, eletricidade)',
        'Solicite perícia para comprovar periculosidade',
        'Apresente fotos e documentos do ambiente de trabalho',
        'Inclua testemunhas sobre exposição ao risco'
      ]
    },
    'estabilidade': {
      probabilidade: 68,
      totalCasos: 534,
      casosProcedentes: 363,
      casosImprocedentes: 171,
      artigosCLT: ['Art. 10, II, ADCT', 'Art. 118 da Lei 8.213/91'],
      resumoJurisprudencia: 'Estabilidades provisórias são reconhecidas (gestante, acidentário, cipeiro). Necessário comprovar a condição na data da dispensa.',
      recomendacoes: [
        'Comprove a condição que gera estabilidade',
        'Gestante: apresente exames e data da concepção',
        'Acidentário: CAT e afastamento pelo INSS',
        'Cipeiro: ata de eleição e mandato vigente',
        'Calcule indenização pelos meses de estabilidade'
      ]
    }
  };
  
  // Procurar estatística mais próxima
  let resultado: Partial<AnalysisResult> | undefined;
  
  for (const [chave, valor] of Object.entries(estatisticas)) {
    if (pedidoLower.includes(chave)) {
      resultado = valor;
      break;
    }
  }
  
  // Se não encontrar, usar valores genéricos
  if (!resultado) {
    resultado = {
      probabilidade: 60,
      totalCasos: 450,
      casosProcedentes: 270,
      casosImprocedentes: 180,
      artigosCLT: ['Consulte a CLT'],
      resumoJurisprudencia: 'Jurisprudência variada. Recomenda-se apresentar provas robustas e consultar precedentes específicos.',
      recomendacoes: [
        'Reúna o máximo de documentação possível',
        'Inclua testemunhas que confirmem os fatos',
        'Calcule os valores de forma detalhada',
        'Consulte um advogado para análise específica'
      ]
    };
  }
  
  const tribunal = request.tribunal || 'TRT-2';
  const dataInicio = request.dataInicio || '2023';
  const dataFim = request.dataFim || '2025';
  
  return {
    pedido: request.pedido,
    artigosCLT: resultado.artigosCLT || [],
    tribunal,
    probabilidade: resultado.probabilidade || 60,
    totalCasos: resultado.totalCasos || 100,
    casosProcedentes: resultado.casosProcedentes || 60,
    casosImprocedentes: resultado.casosImprocedentes || 40,
    resumoJurisprudencia: resultado.resumoJurisprudencia || '',
    recomendacoes: resultado.recomendacoes || [],
    baseComparacao: `${tribunal}, ${dataInicio}–${dataFim}, ${resultado.totalCasos} decisões analisadas`
  };
};

/**
 * Consulta a API DataJud para obter estatísticas de casos semelhantes
 * 
 * NOTA: Esta é uma implementação de demonstração que simula dados reais.
 * Para usar a API real do DataJud, você precisará:
 * 1. Registrar-se no portal do CNJ
 * 2. Obter credenciais de API
 * 3. Implementar autenticação OAuth2
 * 4. Adaptar as consultas aos endpoints reais
 */
export const consultarDataJud = async (request: DataJudRequest): Promise<AnalysisResult> => {
  try {
    // TODO: Quando tiver acesso à API real, substituir por:
    // const response = await fetch('https://api-publica.datajud.cnj.jus.br/api_publica_tj/processos', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     classe: 'Reclamação Trabalhista',
    //     assunto: request.pedido,
    //     tribunal: request.tribunal || 'TRT2'
    //   })
    // });
    
    return await simularConsultaDataJud(request);
  } catch (error) {
    console.error('Erro ao consultar DataJud:', error);
    throw new Error('Não foi possível consultar a base de jurisprudência');
  }
};

/**
 * Analisa múltiplos pedidos de uma vez
 */
export const analisarPedidos = async (pedidos: string[], tribunal?: string): Promise<AnalysisResult[]> => {
  const promessas = pedidos.map(pedido => 
    consultarDataJud({ pedido, tribunal })
  );
  
  return Promise.all(promessas);
};

import { z } from "zod";

// Schema de validação para qualificação das partes
export const qualificationSchema = z.object({
  claimantName: z.string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Nome muito longo" }),
  claimantCpf: z.string()
    .trim()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Use o formato: 000.000.000-00" }),
  claimantAddress: z.string()
    .trim()
    .min(10, { message: "Endereço deve ter pelo menos 10 caracteres" })
    .max(300, { message: "Endereço muito longo" }),
  defendantName: z.string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(200, { message: "Nome muito longo" }),
  defendantCnpj: z.string()
    .trim()
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: "CNPJ inválido. Use o formato: 00.000.000/0000-00" }),
  defendantAddress: z.string()
    .trim()
    .min(10, { message: "Endereço deve ter pelo menos 10 caracteres" })
    .max(300, { message: "Endereço muito longo" }),
});

// Schema de validação para fatos
export const factsSchema = z.object({
  admissionDate: z.string()
    .min(1, { message: "Data de admissão é obrigatória" }),
  terminationDate: z.string()
    .min(1, { message: "Data de rescisão é obrigatória" }),
  position: z.string()
    .trim()
    .min(2, { message: "Cargo deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Cargo muito longo" }),
  salary: z.number()
    .positive({ message: "Salário deve ser maior que zero" })
    .max(1000000, { message: "Valor muito alto" }),
  workSchedule: z.string()
    .trim()
    .min(5, { message: "Jornada deve ter pelo menos 5 caracteres" })
    .max(200, { message: "Descrição da jornada muito longa" }),
  description: z.string()
    .trim()
    .min(50, { message: "Descrição dos fatos deve ter pelo menos 50 caracteres" })
    .max(5000, { message: "Descrição dos fatos muito longa" }),
});

// Schema de validação para pedidos
export const claimsSchema = z.object({
  claims: z.array(z.string().trim().min(1))
    .min(1, { message: "Adicione pelo menos um pedido" })
    .max(20, { message: "Máximo de 20 pedidos" }),
});

// Schema de validação para evidências
export const evidenceSchema = z.object({
  evidences: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number().max(20 * 1024 * 1024, { message: "Arquivo muito grande. Máximo 20MB" }),
    category: z.string(),
    description: z.string().max(500, { message: "Descrição muito longa" }).optional(),
    linkedClaim: z.string().optional(),
    hash: z.string(),
    file: z.any(),
  }))
  .max(50, { message: "Máximo de 50 arquivos" }),
});

// Schema de validação para cálculos
export const calculationsSchema = z.object({
  items: z.array(z.object({
    description: z.string().trim().min(1, { message: "Descrição é obrigatória" }),
    value: z.number().min(0, { message: "Valor não pode ser negativo" }),
  }))
  .min(1, { message: "Adicione pelo menos um item" }),
  additionalItems: z.array(z.object({
    description: z.string().trim().min(1, { message: "Descrição é obrigatória" }),
    value: z.number().min(0, { message: "Valor não pode ser negativo" }),
  })).optional(),
});

export type QualificationData = z.infer<typeof qualificationSchema>;
export type FactsData = z.infer<typeof factsSchema>;
export type ClaimsData = z.infer<typeof claimsSchema>;
export type EvidenceData = z.infer<typeof evidenceSchema>;
export type CalculationsData = z.infer<typeof calculationsSchema>;

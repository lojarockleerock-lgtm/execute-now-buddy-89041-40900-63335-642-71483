// Funções para gerenciar o armazenamento de casos no localStorage

export interface SavedCase {
  id: string;
  title: string;
  status: "draft" | "generated" | "filed";
  createdAt: string;
  updatedAt: string;
  value: number;
  data: {
    qualification?: any;
    facts?: any;
    claims?: string[];
    evidence?: any[];
    calculations?: any;
    review?: any;
  };
}

const STORAGE_KEY = "trt_cases";

export const saveCaseToStorage = (caseData: Omit<SavedCase, "id" | "createdAt" | "updatedAt">): SavedCase => {
  const cases = getAllCases();
  
  const newCase: SavedCase = {
    ...caseData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cases.push(newCase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  
  return newCase;
};

export const updateCase = (id: string, updates: Partial<SavedCase>): SavedCase | null => {
  const cases = getAllCases();
  const index = cases.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  cases[index] = {
    ...cases[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return cases[index];
};

export const deleteCase = (id: string): boolean => {
  const cases = getAllCases();
  const filtered = cases.filter(c => c.id !== id);
  
  if (filtered.length === cases.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const getCaseById = (id: string): SavedCase | null => {
  const cases = getAllCases();
  return cases.find(c => c.id === id) || null;
};

export const getAllCases = (): SavedCase[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading cases from storage:", error);
    return [];
  }
};

const generateId = (): string => {
  return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateCaseValue = (caseData: SavedCase["data"]): number => {
  if (!caseData.calculations?.items) return 0;
  
  const itemsTotal = caseData.calculations.items.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
  const additionalTotal = caseData.calculations.additionalItems?.reduce((sum: number, item: any) => sum + (item.value || 0), 0) || 0;
  
  return itemsTotal + additionalTotal;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

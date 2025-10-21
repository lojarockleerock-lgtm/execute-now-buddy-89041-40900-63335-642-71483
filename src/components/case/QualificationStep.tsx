import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  formatCPF, 
  formatCNPJ, 
  formatCEP, 
  formatPhone, 
  formatRG,
  formatCurrency,
  parseCurrency,
  validateCPF,
  validateCNPJ,
  validateCEP,
  validatePhone
} from "@/lib/inputMasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAddressByCEP, ESTADOS_BRASILEIROS } from "@/lib/addressService";
import { Loader2, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QualificationStepProps {
  data: any;
  onChange: (data: any) => void;
}

export const QualificationStep = ({ data, onChange }: QualificationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCEP, setLoadingCEP] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
    // Limpar erro quando usuário começar a digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    handleChange("cpf", formatted);
    
    if (formatted.length === 14) {
      if (!validateCPF(formatted)) {
        setErrors({ ...errors, cpf: "CPF inválido" });
      } else {
        setErrors({ ...errors, cpf: "" });
      }
    }
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleChange("empresa_cnpj", formatted);
    
    if (formatted.length === 18) {
      if (!validateCNPJ(formatted)) {
        setErrors({ ...errors, empresa_cnpj: "CNPJ inválido" });
      } else {
        setErrors({ ...errors, empresa_cnpj: "" });
      }
    }
  };

  const handleCEPChange = async (field: string, value: string) => {
    const formatted = formatCEP(value);
    handleChange(field, formatted);
    
    if (formatted.length === 9) {
      if (!validateCEP(formatted)) {
        setErrors({ ...errors, [field]: "CEP inválido" });
      } else {
        setErrors({ ...errors, [field]: "" });
        
        // Buscar endereço automaticamente
        setLoadingCEP({ ...loadingCEP, [field]: true });
        const addressData = await fetchAddressByCEP(formatted);
        setLoadingCEP({ ...loadingCEP, [field]: false });
        
        if (addressData) {
          // Determinar o prefixo do campo (vazio para reclamante, empresa_ ou local_trabalho_)
          let prefix = "";
          if (field.startsWith("empresa_")) {
            prefix = "empresa_";
          } else if (field.startsWith("local_trabalho_")) {
            prefix = "local_trabalho_";
          }
          
          // Atualizar os campos de endereço
          onChange({
            ...data,
            [field]: formatted,
            [`${prefix}endereco`]: addressData.logradouro || data[`${prefix}endereco`],
            [`${prefix}bairro`]: addressData.bairro || data[`${prefix}bairro`],
            [`${prefix}cidade`]: addressData.localidade || data[`${prefix}cidade`],
            [`${prefix}estado`]: addressData.uf || data[`${prefix}estado`],
          });
          
          toast({
            title: "Endereço encontrado!",
            description: "Os campos foram preenchidos automaticamente.",
          });
        } else {
          toast({
            title: "CEP não encontrado",
            description: "Preencha o endereço manualmente.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formatted = formatPhone(value);
    handleChange(field, formatted);
    
    const numbers = formatted.replace(/\D/g, "");
    if (numbers.length >= 10) {
      if (!validatePhone(formatted)) {
        setErrors({ ...errors, [field]: "Telefone inválido" });
      } else {
        setErrors({ ...errors, [field]: "" });
      }
    }
  };

  const handleRGChange = (value: string) => {
    const formatted = formatRG(value);
    handleChange("rg", formatted);
  };

  const handleCurrencyChange = (field: string, value: string) => {
    // Formata o valor para exibição
    const formatted = formatCurrency(value);
    // Extrai o valor numérico puro
    const numericValue = parseCurrency(formatted);
    
    // Salva ambos: formatado para exibição e numérico para cálculos
    onChange({ 
      ...data, 
      [field]: formatted,
      [`${field}_numeric`]: parseFloat(numericValue) || 0
    });
    
    // Limpa erro se houver
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Qualificação das Partes</h3>
          <p className="text-sm text-muted-foreground">
            Preencha os dados do trabalhador, da empresa e da relação de trabalho.
          </p>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0">
          <Video className="h-4 w-4 mr-2" />
          Veja como preencher
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dados do Reclamante (Você)</h3>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Dica:</strong> Preencha seus dados conforme aparecem nos documentos oficiais (RG, CPF, CTPS). Os campos com * são obrigatórios.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              placeholder="Seu nome completo"
              value={data.nome || ""}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={data.cpf || ""}
              onChange={(e) => handleCPFChange(e.target.value)}
              className={errors.cpf ? "border-destructive" : ""}
            />
            {errors.cpf && (
              <p className="text-xs text-destructive">{errors.cpf}</p>
            )}
            <p className="text-xs text-muted-foreground">Digite apenas números, a formatação é automática</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              placeholder="00.000.000-0"
              value={data.rg || ""}
              onChange={(e) => handleRGChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Informe o RG sem a capa plástica</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input
              id="nacionalidade"
              placeholder="Ex: brasileiro(a)"
              value={data.nacionalidade || ""}
              onChange={(e) => handleChange("nacionalidade", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estadoCivil">Estado Civil</Label>
            <Input
              id="estadoCivil"
              placeholder="Ex: solteiro(a), casado(a)"
              value={data.estadoCivil || ""}
              onChange={(e) => handleChange("estadoCivil", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profissao">Profissão</Label>
            <Input
              id="profissao"
              placeholder="Ex: auxiliar administrativo"
              value={data.profissao || ""}
              onChange={(e) => handleChange("profissao", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctps">CTPS</Label>
            <Input
              id="ctps"
              placeholder="Número da Carteira de Trabalho"
              value={data.ctps || ""}
              onChange={(e) => handleChange("ctps", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pis">PIS/PASEP</Label>
            <Input
              id="pis"
              placeholder="000.00000.00-0"
              value={data.pis || ""}
              onChange={(e) => handleChange("pis", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={data.telefone || ""}
              onChange={(e) => handlePhoneChange("telefone", e.target.value)}
              className={errors.telefone ? "border-destructive" : ""}
            />
            {errors.telefone && (
              <p className="text-xs text-destructive">{errors.telefone}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Endereço Completo</h4>
        <p className="text-xs text-muted-foreground mb-3">
          📍 Digite o CEP para preencher automaticamente rua, bairro, cidade e estado
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="endereco">Rua/Avenida *</Label>
            <Input
              id="endereco"
              placeholder="Nome da rua ou avenida"
              value={data.endereco || ""}
              onChange={(e) => handleChange("endereco", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              placeholder="Nº"
              value={data.numero || ""}
              onChange={(e) => handleChange("numero", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              placeholder="Apto, bloco, casa..."
              value={data.complemento || ""}
              onChange={(e) => handleChange("complemento", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              placeholder="Bairro"
              value={data.bairro || ""}
              onChange={(e) => handleChange("bairro", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade *</Label>
            <Input
              id="cidade"
              placeholder="Cidade"
              value={data.cidade || ""}
              onChange={(e) => handleChange("cidade", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado *</Label>
            <Select value={data.estado || ""} onValueChange={(value) => handleChange("estado", value)}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cep">CEP *</Label>
            <div className="relative">
              <Input
                id="cep"
                placeholder="00000-000"
                value={data.cep || ""}
                onChange={(e) => handleCEPChange("cep", e.target.value)}
                className={errors.cep ? "border-destructive" : ""}
                disabled={loadingCEP.cep}
              />
              {loadingCEP.cep && (
                <Loader2 className="h-4 w-4 absolute right-3 top-3 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.cep && (
              <p className="text-xs text-destructive">{errors.cep}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dados da Reclamada (Empregador)</h3>
        <div className="bg-secondary/50 border rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground">
            🏢 <strong>Dica:</strong> Informe os dados completos da empresa (conforme CTPS, holerite ou contrato). Se não tiver CNPJ, pode usar CPF do responsável.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="empresa_nome">Nome/Razão Social da Empresa *</Label>
            <Input
              id="empresa_nome"
              placeholder="Nome completo da empresa"
              value={data.empresa_nome || ""}
              onChange={(e) => handleChange("empresa_nome", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_cnpj">CNPJ</Label>
            <Input
              id="empresa_cnpj"
              placeholder="00.000.000/0000-00"
              value={data.empresa_cnpj || ""}
              onChange={(e) => handleCNPJChange(e.target.value)}
              className={errors.empresa_cnpj ? "border-destructive" : ""}
            />
            {errors.empresa_cnpj && (
              <p className="text-xs text-destructive">{errors.empresa_cnpj}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_telefone">Telefone</Label>
            <Input
              id="empresa_telefone"
              placeholder="(00) 0000-0000"
              value={data.empresa_telefone || ""}
              onChange={(e) => handlePhoneChange("empresa_telefone", e.target.value)}
              className={errors.empresa_telefone ? "border-destructive" : ""}
            />
            {errors.empresa_telefone && (
              <p className="text-xs text-destructive">{errors.empresa_telefone}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Informações do Vínculo Empregatício</h3>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground">
            💼 <strong>Importante:</strong> Estas informações são essenciais para calcular seus direitos. Informe o último salário e as datas de admissão/demissão com precisão.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo/Função Exercida *</Label>
            <Input
              id="cargo"
              placeholder="Ex: Auxiliar Administrativo"
              value={data.cargo || ""}
              onChange={(e) => handleChange("cargo", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salarioBruto">Último Salário Bruto *</Label>
            <Input
              id="salarioBruto"
              placeholder="R$ 0,00"
              value={data.salarioBruto || ""}
              onChange={(e) => handleCurrencyChange("salarioBruto", e.target.value)}
              className={errors.salarioBruto ? "border-destructive" : ""}
            />
            {errors.salarioBruto && (
              <p className="text-xs text-destructive">{errors.salarioBruto}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Digite apenas números. A formatação será aplicada automaticamente.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
            <Input
              id="dataAdmissao"
              type="date"
              value={data.dataAdmissao || ""}
              onChange={(e) => handleChange("dataAdmissao", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataDemissao">Data de Demissão</Label>
            <Input
              id="dataDemissao"
              type="date"
              value={data.dataDemissao || ""}
              onChange={(e) => handleChange("dataDemissao", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Deixe em branco se ainda está trabalhando</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vara">Vara do Trabalho (opcional)</Label>
            <Input
              id="vara"
              placeholder="Ex: 1ª Vara do Trabalho"
              value={data.vara || ""}
              onChange={(e) => handleChange("vara", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Endereço do Local de Trabalho</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Este endereço será usado para enviar a intimação. Informe onde você prestava seus serviços.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_cep">CEP *</Label>
            <div className="relative">
              <Input
                id="local_trabalho_cep"
                placeholder="00000-000"
                value={data.local_trabalho_cep || ""}
                onChange={(e) => handleCEPChange("local_trabalho_cep", e.target.value)}
                className={errors.local_trabalho_cep ? "border-destructive" : ""}
                disabled={loadingCEP.local_trabalho_cep}
              />
              {loadingCEP.local_trabalho_cep && (
                <Loader2 className="h-4 w-4 absolute right-3 top-3 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.local_trabalho_cep && (
              <p className="text-xs text-destructive">{errors.local_trabalho_cep}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="local_trabalho_endereco">Rua/Avenida *</Label>
            <Input
              id="local_trabalho_endereco"
              placeholder="Nome da rua ou avenida"
              value={data.local_trabalho_endereco || ""}
              onChange={(e) => handleChange("local_trabalho_endereco", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_numero">Número *</Label>
            <Input
              id="local_trabalho_numero"
              placeholder="Nº"
              value={data.local_trabalho_numero || ""}
              onChange={(e) => handleChange("local_trabalho_numero", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_complemento">Complemento</Label>
            <Input
              id="local_trabalho_complemento"
              placeholder="Sala, andar, bloco..."
              value={data.local_trabalho_complemento || ""}
              onChange={(e) => handleChange("local_trabalho_complemento", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_bairro">Bairro *</Label>
            <Input
              id="local_trabalho_bairro"
              placeholder="Bairro"
              value={data.local_trabalho_bairro || ""}
              onChange={(e) => handleChange("local_trabalho_bairro", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_cidade">Cidade *</Label>
            <Input
              id="local_trabalho_cidade"
              placeholder="Cidade"
              value={data.local_trabalho_cidade || ""}
              onChange={(e) => handleChange("local_trabalho_cidade", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local_trabalho_estado">Estado *</Label>
            <Select value={data.local_trabalho_estado || ""} onValueChange={(value) => handleChange("local_trabalho_estado", value)}>
              <SelectTrigger id="local_trabalho_estado">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Endereço Completo da Empresa</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="empresa_endereco">Rua/Avenida *</Label>
            <Input
              id="empresa_endereco"
              placeholder="Nome da rua ou avenida"
              value={data.empresa_endereco || ""}
              onChange={(e) => handleChange("empresa_endereco", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_numero">Número *</Label>
            <Input
              id="empresa_numero"
              placeholder="Nº"
              value={data.empresa_numero || ""}
              onChange={(e) => handleChange("empresa_numero", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_complemento">Complemento</Label>
            <Input
              id="empresa_complemento"
              placeholder="Sala, andar, bloco..."
              value={data.empresa_complemento || ""}
              onChange={(e) => handleChange("empresa_complemento", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_bairro">Bairro *</Label>
            <Input
              id="empresa_bairro"
              placeholder="Bairro"
              value={data.empresa_bairro || ""}
              onChange={(e) => handleChange("empresa_bairro", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_cidade">Cidade *</Label>
            <Input
              id="empresa_cidade"
              placeholder="Cidade"
              value={data.empresa_cidade || ""}
              onChange={(e) => handleChange("empresa_cidade", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_estado">Estado *</Label>
            <Select value={data.empresa_estado || ""} onValueChange={(value) => handleChange("empresa_estado", value)}>
              <SelectTrigger id="empresa_estado">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="empresa_cep">CEP *</Label>
            <div className="relative">
              <Input
                id="empresa_cep"
                placeholder="00000-000"
                value={data.empresa_cep || ""}
                onChange={(e) => handleCEPChange("empresa_cep", e.target.value)}
                className={errors.empresa_cep ? "border-destructive" : ""}
                disabled={loadingCEP.empresa_cep}
              />
              {loadingCEP.empresa_cep && (
                <Loader2 className="h-4 w-4 absolute right-3 top-3 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.empresa_cep && (
              <p className="text-xs text-destructive">{errors.empresa_cep}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Preencha todos os campos marcados com * (obrigatórios). 
          Quanto mais informações você fornecer, mais completa será sua petição.
        </p>
      </div>
    </div>
  );
};

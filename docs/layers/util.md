# 🛠️ Utils

Utils são **funções utilitárias puras** que fornecem funcionalidades reutilizáveis em toda a aplicação. Elas devem ser stateless, sem efeitos colaterais e focadas em transformações de dados, formatações, validações e operações auxiliares.

> ❗️Utils devem ser **funções puras** - dado o mesmo input, sempre retornam o mesmo output, sem efeitos colaterais.

## 🔗 Restrições de Uso

**Utils NÃO podem ser usados em:**
- Entity
- Gateway
- Repository
- Model

**Utils PODEM ser usados em:**
- Atom
- Molecule
- Organism
- Template
- Feature
- UseCase
- Service

---

## 🔹 Estrutura `src/utils/{name}`

* **Sufixo**: `.util.ts`
* **Exemplo**: `format-date.util.ts` com `formatDateUtil`
* **Arquivos permitidos**:
  * `{name}.util.ts`
  * `{name}.util.spec.ts`
  * `index.ts` // Para exportar múltiplos utils relacionados

> ✅ Funções devem usar **camelCase** e ter sufixo `Util` para diferenciação

---

## 📄 Exemplo `format-date.util.ts`

```ts
/**
 * Utilitários para formatação e manipulação de datas
 */

/**
 * Formata uma data para o padrão brasileiro (DD/MM/AAAA)
 * @param date - Data a ser formatada (Date, string ISO ou timestamp)
 * @param options - Opções de formatação
 * @returns Data formatada como string
 * 
 * @example
 * ```ts
 * formatDateUtil(new Date('2024-01-15')) // "15/01/2024"
 * formatDateUtil('2024-01-15T10:30:00Z') // "15/01/2024"
 * formatDateUtil(1705312200000) // "15/01/2024"
 * ```
 */
export const formatDateUtil = (
  date: Date | string | number,
  options: {
    includeTime?: boolean;
    format?: 'short' | 'long' | 'iso';
    locale?: string;
  } = {}
): string => {
  const {
    includeTime = false,
    format = 'short',
    locale = 'pt-BR'
  } = options;

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Data inválida fornecida');
  }

  switch (format) {
    case 'short':
      const shortOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(includeTime && {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      return dateObj.toLocaleDateString(locale, shortOptions);

    case 'long':
      const longOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...(includeTime && {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      return dateObj.toLocaleDateString(locale, longOptions);

    case 'iso':
      return dateObj.toISOString();

    default:
      return dateObj.toLocaleDateString(locale);
  }
};

/**
 * Calcula a diferença entre duas datas em dias
 * @param startDate - Data inicial
 * @param endDate - Data final (padrão: hoje)
 * @returns Número de dias de diferença
 * 
 * @example
 * ```ts
 * calculateDaysDifferenceUtil('2024-01-01', '2024-01-15') // 14
 * calculateDaysDifferenceUtil('2024-01-15') // Dias até hoje
 * ```
 */
export const calculateDaysDifferenceUtil = (
  startDate: Date | string,
  endDate: Date | string = new Date()
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Uma ou ambas as datas são inválidas');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Verifica se uma data está dentro de um intervalo
 * @param date - Data a ser verificada
 * @param startDate - Data inicial do intervalo
 * @param endDate - Data final do intervalo
 * @returns true se a data estiver no intervalo
 * 
 * @example
 * ```ts
 * isDateInRangeUtil('2024-01-10', '2024-01-01', '2024-01-31') // true
 * isDateInRangeUtil('2024-02-01', '2024-01-01', '2024-01-31') // false
 * ```
 */
export const isDateInRangeUtil = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(checkDate.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Uma ou mais datas são inválidas');
  }

  return checkDate >= start && checkDate <= end;
};

/**
 * Obtém o início e fim de um período específico
 * @param date - Data de referência
 * @param period - Tipo de período
 * @returns Objeto com início e fim do período
 * 
 * @example
 * ```ts
 * getPeriodBoundsUtil('2024-01-15', 'month')
 * // { start: '2024-01-01T00:00:00.000Z', end: '2024-01-31T23:59:59.999Z' }
 * ```
 */
export const getPeriodBoundsUtil = (
  date: Date | string,
  period: 'day' | 'week' | 'month' | 'year'
): { start: Date; end: Date } => {
  const referenceDate = new Date(date);
  
  if (isNaN(referenceDate.getTime())) {
    throw new Error('Data inválida fornecida');
  }

  const start = new Date(referenceDate);
  const end = new Date(referenceDate);

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'week':
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error(`Período '${period}' não suportado`);
  }

  return { start, end };
};

/**
 * Formata uma data para exibição relativa (ex: "há 2 dias")
 * @param date - Data a ser formatada
 * @param locale - Locale para formatação
 * @returns String com tempo relativo
 * 
 * @example
 * ```ts
 * formatRelativeDateUtil(new Date(Date.now() - 86400000)) // "há 1 dia"
 * formatRelativeDateUtil(new Date(Date.now() + 3600000)) // "em 1 hora"
 * ```
 */
export const formatRelativeDateUtil = (
  date: Date | string,
  locale: string = 'pt-BR'
): string => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    throw new Error('Data inválida fornecida');
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, 'day');
  } else if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, 'hour');
  } else if (Math.abs(diffMinutes) >= 1) {
    return rtf.format(diffMinutes, 'minute');
  } else {
    return rtf.format(diffSeconds, 'second');
  }
};

/**
 * Valida se uma string é uma data válida
 * @param dateString - String a ser validada
 * @returns true se for uma data válida
 * 
 * @example
 * ```ts
 * isValidDateUtil('2024-01-15') // true
 * isValidDateUtil('invalid-date') // false
 * isValidDateUtil('2024-02-30') // false
 * ```
 */
export const isValidDateUtil = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString.split('T')[0]);
};
```

---

## 📄 Exemplo `format-currency.util.ts`

```ts
/**
 * Utilitários para formatação de valores monetários
 */

/**
 * Formata um valor numérico como moeda
 * @param value - Valor a ser formatado
 * @param options - Opções de formatação
 * @returns Valor formatado como string
 * 
 * @example
 * ```ts
 * formatCurrencyUtil(1234.56) // "R$ 1.234,56"
 * formatCurrencyUtil(1234.56, { currency: 'USD' }) // "$1,234.56"
 * formatCurrencyUtil(1234.56, { showSymbol: false }) // "1.234,56"
 * ```
 */
export const formatCurrencyUtil = (
  value: number,
  options: {
    currency?: 'BRL' | 'USD' | 'EUR';
    locale?: string;
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const {
    currency = 'BRL',
    locale = currency === 'BRL' ? 'pt-BR' : 'en-US',
    showSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Valor deve ser um número válido');
  }

  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
  };

  if (showSymbol) {
    formatOptions.style = 'currency';
    formatOptions.currency = currency;
  }

  return new Intl.NumberFormat(locale, formatOptions).format(value);
};

/**
 * Converte string de moeda para número
 * @param currencyString - String formatada como moeda
 * @param locale - Locale usado na formatação original
 * @returns Valor numérico
 * 
 * @example
 * ```ts
 * parseCurrencyUtil('R$ 1.234,56') // 1234.56
 * parseCurrencyUtil('$1,234.56', 'en-US') // 1234.56
 * ```
 */
export const parseCurrencyUtil = (
  currencyString: string,
  locale: string = 'pt-BR'
): number => {
  if (typeof currencyString !== 'string') {
    throw new Error('Entrada deve ser uma string');
  }

  // Remove símbolos de moeda e espaços
  let cleanString = currencyString.replace(/[^\d,.-]/g, '');

  // Ajusta para formato numérico baseado no locale
  if (locale === 'pt-BR') {
    // Formato brasileiro: 1.234,56
    cleanString = cleanString.replace(/\./g, '').replace(',', '.');
  } else {
    // Formato americano: 1,234.56
    cleanString = cleanString.replace(/,/g, '');
  }

  const result = parseFloat(cleanString);
  
  if (isNaN(result)) {
    throw new Error('String de moeda inválida');
  }

  return result;
};

/**
 * Calcula porcentagem de um valor
 * @param value - Valor base
 * @param percentage - Porcentagem a ser calculada
 * @param operation - Tipo de operação
 * @returns Resultado do cálculo
 * 
 * @example
 * ```ts
 * calculatePercentageUtil(1000, 10, 'of') // 100 (10% de 1000)
 * calculatePercentageUtil(1000, 10, 'add') // 1100 (1000 + 10%)
 * calculatePercentageUtil(1000, 10, 'subtract') // 900 (1000 - 10%)
 * ```
 */
export const calculatePercentageUtil = (
  value: number,
  percentage: number,
  operation: 'of' | 'add' | 'subtract' = 'of'
): number => {
  if (typeof value !== 'number' || typeof percentage !== 'number') {
    throw new Error('Valor e porcentagem devem ser números');
  }

  if (isNaN(value) || isNaN(percentage)) {
    throw new Error('Valor e porcentagem devem ser números válidos');
  }

  const percentageValue = (value * percentage) / 100;

  switch (operation) {
    case 'of':
      return percentageValue;
    case 'add':
      return value + percentageValue;
    case 'subtract':
      return value - percentageValue;
    default:
      throw new Error(`Operação '${operation}' não suportada`);
  }
};

/**
 * Formata um número como porcentagem
 * @param value - Valor a ser formatado (0.1 = 10%)
 * @param options - Opções de formatação
 * @returns Valor formatado como porcentagem
 * 
 * @example
 * ```ts
 * formatPercentageUtil(0.1234) // "12,34%"
 * formatPercentageUtil(0.1234, { decimals: 1 }) // "12,3%"
 * formatPercentageUtil(1.5, { allowOver100: true }) // "150%"
 * ```
 */
export const formatPercentageUtil = (
  value: number,
  options: {
    decimals?: number;
    locale?: string;
    allowOver100?: boolean;
  } = {}
): string => {
  const {
    decimals = 2,
    locale = 'pt-BR',
    allowOver100 = false,
  } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('Valor deve ser um número válido');
  }

  if (!allowOver100 && value > 1) {
    throw new Error('Valor não pode ser maior que 1 (100%) quando allowOver100 é false');
  }

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};
```

---

## 📄 Exemplo `validation.util.ts`

```ts
/**
 * Utilitários para validação de dados
 */

/**
 * Valida se um email tem formato válido
 * @param email - Email a ser validado
 * @returns true se o email for válido
 * 
 * @example
 * ```ts
 * isValidEmailUtil('user@example.com') // true
 * isValidEmailUtil('invalid-email') // false
 * ```
 */
export const isValidEmailUtil = (email: string): boolean => {
  if (typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida CPF brasileiro
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se o CPF for válido
 * 
 * @example
 * ```ts
 * isValidCPFUtil('123.456.789-09') // true
 * isValidCPFUtil('12345678909') // true
 * isValidCPFUtil('111.111.111-11') // false (sequência inválida)
 * ```
 */
export const isValidCPFUtil = (cpf: string): boolean => {
  if (typeof cpf !== 'string') {
    return false;
  }

  // Remove formatação
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verifica se não é uma sequência de números iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/**
 * Valida CNPJ brasileiro
 * @param cnpj - CNPJ a ser validado (com ou sem formatação)
 * @returns true se o CNPJ for válido
 * 
 * @example
 * ```ts
 * isValidCNPJUtil('11.222.333/0001-81') // true
 * isValidCNPJUtil('11222333000181') // true
 * ```
 */
export const isValidCNPJUtil = (cnpj: string): boolean => {
  if (typeof cnpj !== 'string') {
    return false;
  }

  // Remove formatação
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false;
  }

  // Verifica se não é uma sequência de números iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) return false;

  return true;
};

/**
 * Valida se uma string contém apenas números
 * @param value - Valor a ser validado
 * @param allowDecimals - Se permite números decimais
 * @returns true se contém apenas números
 * 
 * @example
 * ```ts
 * isNumericUtil('123') // true
 * isNumericUtil('123.45', true) // true
 * isNumericUtil('123.45', false) // false
 * isNumericUtil('abc') // false
 * ```
 */
export const isNumericUtil = (value: string, allowDecimals: boolean = false): boolean => {
  if (typeof value !== 'string') {
    return false;
  }

  const regex = allowDecimals ? /^\d+(\.\d+)?$/ : /^\d+$/;
  return regex.test(value.trim());
};

/**
 * Valida força de senha
 * @param password - Senha a ser validada
 * @param requirements - Requisitos de validação
 * @returns Objeto com resultado da validação
 * 
 * @example
 * ```ts
 * validatePasswordStrengthUtil('MyPass123!')
 * // { isValid: true, score: 4, feedback: [] }
 * ```
 */
export const validatePasswordStrengthUtil = (
  password: string,
  requirements: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
} => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements;

  const feedback: string[] = [];
  let score = 0;

  if (typeof password !== 'string') {
    return { isValid: false, score: 0, feedback: ['Senha deve ser uma string'] };
  }

  // Verifica comprimento mínimo
  if (password.length >= minLength) {
    score++;
  } else {
    feedback.push(`Senha deve ter pelo menos ${minLength} caracteres`);
  }

  // Verifica letra maiúscula
  if (requireUppercase) {
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Senha deve conter pelo menos uma letra maiúscula');
    }
  }

  // Verifica letra minúscula
  if (requireLowercase) {
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Senha deve conter pelo menos uma letra minúscula');
    }
  }

  // Verifica números
  if (requireNumbers) {
    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('Senha deve conter pelo menos um número');
    }
  }

  // Verifica caracteres especiais
  if (requireSpecialChars) {
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score++;
    } else {
      feedback.push('Senha deve conter pelo menos um caractere especial');
    }
  }

  const maxScore = [minLength > 0, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars]
    .filter(Boolean).length;

  return {
    isValid: feedback.length === 0,
    score: Math.min(score, maxScore),
    feedback,
  };
};
```

---

## 📄 Exemplo `string.util.ts`

```ts
/**
 * Utilitários para manipulação de strings
 */

/**
 * Converte string para slug (URL-friendly)
 * @param text - Texto a ser convertido
 * @param options - Opções de conversão
 * @returns String convertida para slug
 * 
 * @example
 * ```ts
 * slugifyUtil('Minha Estratégia Incrível!') // "minha-estrategia-incrivel"
 * slugifyUtil('Hello World', { separator: '_' }) // "hello_world"
 * ```
 */
export const slugifyUtil = (
  text: string,
  options: {
    separator?: string;
    lowercase?: boolean;
    removeAccents?: boolean;
  } = {}
): string => {
  const {
    separator = '-',
    lowercase = true,
    removeAccents = true,
  } = options;

  if (typeof text !== 'string') {
    throw new Error('Texto deve ser uma string');
  }

  let result = text.trim();

  // Remove acentos
  if (removeAccents) {
    result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Converte para minúsculo
  if (lowercase) {
    result = result.toLowerCase();
  }

  // Remove caracteres especiais e substitui espaços
  result = result
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, separator) // Substitui espaços por separador
    .replace(new RegExp(`${separator}+`, 'g'), separator) // Remove separadores duplicados
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Remove separadores do início/fim

  return result;
};

/**
 * Trunca uma string para um tamanho específico
 * @param text - Texto a ser truncado
 * @param maxLength - Tamanho máximo
 * @param options - Opções de truncamento
 * @returns String truncada
 * 
 * @example
 * ```ts
 * truncateUtil('Este é um texto muito longo', 10) // "Este é um..."
 * truncateUtil('Texto curto', 20) // "Texto curto"
 * truncateUtil('Texto longo', 10, { ellipsis: ' [...]' }) // "Texto long [...]"
 * ```
 */
export const truncateUtil = (
  text: string,
  maxLength: number,
  options: {
    ellipsis?: string;
    breakWords?: boolean;
  } = {}
): string => {
  const {
    ellipsis = '...',
    breakWords = false,
  } = options;

  if (typeof text !== 'string') {
    throw new Error('Texto deve ser uma string');
  }

  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('Tamanho máximo deve ser um número positivo');
  }

  if (text.length <= maxLength) {
    return text;
  }

  const truncatedLength = maxLength - ellipsis.length;

  if (truncatedLength <= 0) {
    return ellipsis.substring(0, maxLength);
  }

  let truncated = text.substring(0, truncatedLength);

  // Se não deve quebrar palavras, encontra o último espaço
  if (!breakWords) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      truncated = truncated.substring(0, lastSpace);
    }
  }

  return truncated + ellipsis;
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param text - Texto a ser capitalizado
 * @param options - Opções de capitalização
 * @returns String capitalizada
 * 
 * @example
 * ```ts
 * capitalizeWordsUtil('hello world') // "Hello World"
 * capitalizeWordsUtil('HELLO WORLD', { forceLowercase: true }) // "Hello World"
 * ```
 */
export const capitalizeWordsUtil = (
  text: string,
  options: {
    forceLowercase?: boolean;
    exceptions?: string[];
  } = {}
): string => {
  const {
    forceLowercase = false,
    exceptions = [],
  } = options;

  if (typeof text !== 'string') {
    throw new Error('Texto deve ser uma string');
  }

  let result = forceLowercase ? text.toLowerCase() : text;

  return result.replace(/\b\w+/g, (word) => {
    if (exceptions.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
};

/**
 * Remove espaços extras e normaliza espaçamento
 * @param text - Texto a ser normalizado
 * @returns String normalizada
 * 
 * @example
 * ```ts
 * normalizeSpacesUtil('  Hello    world  ') // "Hello world"
 * normalizeSpacesUtil('Line1\n\n\nLine2') // "Line1\nLine2"
 * ```
 */
export const normalizeSpacesUtil = (text: string): string => {
  if (typeof text !== 'string') {
    throw new Error('Texto deve ser uma string');
  }

  return text
    .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um
    .replace(/\n\s*\n/g, '\n') // Remove linhas vazias extras
    .trim(); // Remove espaços do início e fim
};

/**
 * Extrai iniciais de um nome
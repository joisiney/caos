# 🏛️ Entities

Entities são **representações puras dos dados** recebidos da API, definindo a estrutura exata dos objetos que vêm do backend. Elas servem como contratos de dados entre o frontend e a API, garantindo type safety e documentando a interface de comunicação.

> ❗️Entities devem ser **apenas tipos TypeScript**, sem lógica ou transformações. Elas representam fielmente a estrutura de dados da API.

---

## 🔹 Estrutura `src/entities/{name}`

* **Sufixo**: `.entity.ts`
* **Exemplo**: `strategy.entity.ts` com `TStrategyEntity`
* **Arquivos permitidos**:
  * `{name}.entity.ts`
  * `{name}.entity.spec.ts` // Opcional para validação de tipos

> ✅ **Convenção**: Todos os nomes de entities devem começar com a letra `T`

---

## 📄 Exemplo `strategy.entity.ts`

```ts
/**
 * Representa os dados de uma estratégia conforme retornados pela API
 * 
 * @example
 * ```json
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "name": "Estratégia Conservadora",
 *   "description": "Uma estratégia de baixo risco focada em renda fixa",
 *   "risk_level": "low",
 *   "expected_return": 8.5,
 *   "created_at": "2024-01-15T10:00:00Z",
 *   "updated_at": "2024-01-20T15:30:00Z",
 *   "is_active": true,
 *   "tags": ["conservadora", "renda-fixa"],
 *   "metadata": {
 *     "category": "bonds",
 *     "min_investment": 1000
 *   }
 * }
 * ```
 */
export type TStrategyEntity = {
  /** Identificador único da estratégia (UUID v4) */
  id: string;
  
  /** Nome da estratégia */
  name: string;
  
  /** Descrição detalhada da estratégia (opcional) */
  description?: string;
  
  /** Nível de risco da estratégia */
  risk_level: 'low' | 'medium' | 'high';
  
  /** Retorno esperado em porcentagem (0-100) */
  expected_return: number;
  
  /** Data de criação no formato ISO 8601 */
  created_at: string;
  
  /** Data da última atualização no formato ISO 8601 */
  updated_at: string;
  
  /** Indica se a estratégia está ativa */
  is_active: boolean;
  
  /** Tags associadas à estratégia (opcional) */
  tags?: string[];
  
  /** Metadados adicionais da estratégia (opcional) */
  metadata?: Record<string, unknown>;
};

/**
 * Representa os dados de criação de uma estratégia
 * Usado em requisições POST para criar novas estratégias
 */
export type TCreateStrategyEntity = Omit<TStrategyEntity, 'id' | 'created_at' | 'updated_at'>;

/**
 * Representa os dados de atualização de uma estratégia
 * Usado em requisições PUT/PATCH para atualizar estratégias existentes
 */
export type TUpdateStrategyEntity = Partial<Omit<TStrategyEntity, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Representa a resposta paginada da API para listagem de estratégias
 */
export type TStrategyListEntity = {
  /** Lista de estratégias */
  data: TStrategyEntity[];
  
  /** Informações de paginação */
  pagination: {
    /** Página atual (1-based) */
    current_page: number;
    
    /** Total de páginas */
    total_pages: number;
    
    /** Total de itens */
    total_items: number;
    
    /** Itens por página */
    per_page: number;
    
    /** Indica se há próxima página */
    has_next: boolean;
    
    /** Indica se há página anterior */
    has_previous: boolean;
  };
  
  /** Metadados da consulta */
  meta?: {
    /** Filtros aplicados */
    filters?: Record<string, unknown>;
    
    /** Ordenação aplicada */
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    
    /** Tempo de execução da consulta em ms */
    execution_time?: number;
  };
};

/**
 * Representa os dados de uma estratégia com informações de performance
 * Usado em endpoints que retornam dados enriquecidos
 */
export type TStrategyWithPerformanceEntity = TStrategyEntity & {
  /** Dados de performance da estratégia */
  performance: {
    /** Retorno atual em porcentagem */
    current_return: number;
    
    /** Valor atual investido */
    current_value: number;
    
    /** Valor inicial investido */
    initial_value: number;
    
    /** Ganho/perda absoluto */
    absolute_gain: number;
    
    /** Ganho/perda percentual */
    percentage_gain: number;
    
    /** Data da última atualização de performance */
    last_updated: string;
  };
  
  /** Estatísticas históricas */
  statistics?: {
    /** Volatilidade (desvio padrão dos retornos) */
    volatility: number;
    
    /** Sharpe ratio */
    sharpe_ratio: number;
    
    /** Máximo drawdown */
    max_drawdown: number;
    
    /** Número de dias com dados */
    data_points: number;
  };
};

/**
 * Representa os filtros disponíveis para busca de estratégias
 * Usado em query parameters da API
 */
export type TStrategyFiltersEntity = {
  /** Filtrar por nível de risco */
  risk_level?: 'low' | 'medium' | 'high' | 'low,medium' | 'medium,high' | 'low,high' | 'low,medium,high';
  
  /** Filtrar por status ativo */
  is_active?: boolean;
  
  /** Filtrar por retorno mínimo esperado */
  min_expected_return?: number;
  
  /** Filtrar por retorno máximo esperado */
  max_expected_return?: number;
  
  /** Filtrar por data de criação (a partir de) */
  created_after?: string;
  
  /** Filtrar por data de criação (até) */
  created_before?: string;
  
  /** Filtrar por tags (busca por qualquer uma das tags) */
  tags?: string[];
  
  /** Busca textual no nome e descrição */
  search?: string;
  
  /** Campo para ordenação */
  sort_by?: 'name' | 'created_at' | 'updated_at' | 'expected_return' | 'risk_level';
  
  /** Direção da ordenação */
  sort_direction?: 'asc' | 'desc';
  
  /** Página para paginação (1-based) */
  page?: number;
  
  /** Itens por página */
  per_page?: number;
};

/**
 * Representa a resposta de erro da API
 * Usado quando operações falham
 */
export type TStrategyErrorEntity = {
  /** Código do erro */
  error_code: string;
  
  /** Mensagem de erro legível */
  message: string;
  
  /** Detalhes específicos do erro */
  details?: {
    /** Campo que causou o erro (para erros de validação) */
    field?: string;
    
    /** Valor que causou o erro */
    value?: unknown;
    
    /** Regra de validação violada */
    rule?: string;
  }[];
  
  /** Timestamp do erro */
  timestamp: string;
  
  /** ID da requisição para rastreamento */
  request_id?: string;
};

/**
 * Representa os dados de auditoria de uma estratégia
 * Usado em endpoints de histórico de mudanças
 */
export type TStrategyAuditEntity = {
  /** ID único do registro de auditoria */
  id: string;
  
  /** ID da estratégia auditada */
  strategy_id: string;
  
  /** Tipo de operação realizada */
  operation: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  
  /** Dados antes da mudança */
  before_data?: Partial<TStrategyEntity>;
  
  /** Dados depois da mudança */
  after_data?: Partial<TStrategyEntity>;
  
  /** Campos que foram alterados */
  changed_fields?: string[];
  
  /** ID do usuário que fez a alteração */
  user_id: string;
  
  /** Nome do usuário que fez a alteração */
  user_name: string;
  
  /** Timestamp da operação */
  timestamp: string;
  
  /** IP de origem da requisição */
  ip_address?: string;
  
  /** User agent da requisição */
  user_agent?: string;
  
  /** Motivo da alteração (opcional) */
  reason?: string;
};
```

---

## 📄 Exemplo `user.entity.ts`

```ts
/**
 * Representa os dados de um usuário conforme retornados pela API
 */
export type TUserEntity = {
  /** Identificador único do usuário */
  id: string;
  
  /** Nome completo do usuário */
  full_name: string;
  
  /** Email do usuário (único) */
  email_address: string;
  
  /** Número de telefone (opcional) */
  phone_number?: string;
  
  /** Data de nascimento no formato ISO 8601 */
  birth_date: string;
  
  /** Status do usuário */
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  
  /** Data de criação da conta */
  created_at: string;
  
  /** Data da última atualização */
  updated_at: string;
  
  /** Data do último login (opcional) */
  last_login_at?: string;
  
  /** Configurações do usuário */
  preferences: {
    /** Idioma preferido */
    language: 'pt-BR' | 'en-US' | 'es-ES';
    
    /** Timezone do usuário */
    timezone: string;
    
    /** Preferências de notificação */
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    
    /** Tema da interface */
    theme: 'light' | 'dark' | 'auto';
  };
  
  /** Perfil do usuário */
  profile: {
    /** URL da foto de perfil (opcional) */
    avatar_url?: string;
    
    /** Biografia/descrição (opcional) */
    bio?: string;
    
    /** Localização (opcional) */
    location?: string;
    
    /** Website pessoal (opcional) */
    website?: string;
  };
  
  /** Informações de verificação */
  verification: {
    /** Email verificado */
    email_verified: boolean;
    
    /** Telefone verificado */
    phone_verified: boolean;
    
    /** Identidade verificada */
    identity_verified: boolean;
    
    /** Data da verificação de email */
    email_verified_at?: string;
    
    /** Data da verificação de telefone */
    phone_verified_at?: string;
    
    /** Data da verificação de identidade */
    identity_verified_at?: string;
  };
};

/**
 * Representa os dados públicos de um usuário
 * Usado quando dados sensíveis não devem ser expostos
 */
export type TPublicUserEntity = Pick<TUserEntity, 'id' | 'full_name' | 'profile'> & {
  /** Indica se o usuário está online */
  is_online: boolean;
  
  /** Data da última atividade */
  last_seen_at: string;
};

/**
 * Representa os dados de criação de um usuário
 */
export type TCreateUserEntity = {
  full_name: string;
  email_address: string;
  password: string;
  phone_number?: string;
  birth_date: string;
  preferences?: Partial<TUserEntity['preferences']>;
  profile?: Partial<TUserEntity['profile']>;
};

/**
 * Representa os dados de atualização de um usuário
 */
export type TUpdateUserEntity = Partial<Omit<TUserEntity, 'id' | 'created_at' | 'updated_at' | 'verification'>>;
```

---

## 📄 Exemplo `transaction.entity.ts`

```ts
/**
 * Representa os dados de uma transação financeira
 */
export type TTransactionEntity = {
  /** Identificador único da transação */
  id: string;
  
  /** ID do usuário que realizou a transação */
  user_id: string;
  
  /** ID da estratégia relacionada (opcional) */
  strategy_id?: string;
  
  /** Tipo da transação */
  type: 'deposit' | 'withdrawal' | 'investment' | 'dividend' | 'fee' | 'refund';
  
  /** Status da transação */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  
  /** Valor da transação */
  amount: number;
  
  /** Moeda da transação */
  currency: 'BRL' | 'USD' | 'EUR';
  
  /** Taxa aplicada (opcional) */
  fee?: number;
  
  /** Valor líquido (amount - fee) */
  net_amount: number;
  
  /** Descrição da transação */
  description: string;
  
  /** Referência externa (ID do banco, gateway, etc.) */
  external_reference?: string;
  
  /** Método de pagamento */
  payment_method: {
    /** Tipo do método */
    type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'crypto';
    
    /** Detalhes específicos do método */
    details: {
      /** Últimos 4 dígitos do cartão (para cartões) */
      last_four_digits?: string;
      
      /** Bandeira do cartão (para cartões) */
      brand?: 'visa' | 'mastercard' | 'amex' | 'elo';
      
      /** Banco de origem (para transferências) */
      bank_name?: string;
      
      /** Código do banco (para transferências) */
      bank_code?: string;
      
      /** Chave PIX (para PIX) */
      pix_key?: string;
      
      /** Endereço da carteira (para crypto) */
      wallet_address?: string;
      
      /** Moeda crypto (para crypto) */
      crypto_currency?: string;
    };
  };
  
  /** Data de criação da transação */
  created_at: string;
  
  /** Data de atualização da transação */
  updated_at: string;
  
  /** Data de processamento (quando status = completed) */
  processed_at?: string;
  
  /** Metadados adicionais */
  metadata?: {
    /** IP de origem da transação */
    origin_ip?: string;
    
    /** User agent */
    user_agent?: string;
    
    /** Localização geográfica */
    location?: {
      country: string;
      state?: string;
      city?: string;
    };
    
    /** Informações de segurança */
    security?: {
      /** Score de risco (0-100) */
      risk_score: number;
      
      /** Flags de segurança */
      flags: string[];
    };
  };
};

/**
 * Representa um resumo de transações por período
 */
export type TTransactionSummaryEntity = {
  /** Período do resumo */
  period: {
    /** Data de início */
    start_date: string;
    
    /** Data de fim */
    end_date: string;
    
    /** Tipo do período */
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  
  /** Totais por tipo de transação */
  totals: {
    deposits: {
      count: number;
      amount: number;
    };
    withdrawals: {
      count: number;
      amount: number;
    };
    investments: {
      count: number;
      amount: number;
    };
    dividends: {
      count: number;
      amount: number;
    };
    fees: {
      count: number;
      amount: number;
    };
  };
  
  /** Saldo líquido do período */
  net_balance: number;
  
  /** Moeda dos valores */
  currency: string;
};
```

---

## 📄 Exemplo `entity.spec.ts` // Opcional

```ts
import type { TStrategyEntity, TUserEntity, TTransactionEntity } from './strategy.entity';

/**
 * Testes de tipo para garantir que as entities estão corretas
 * Estes testes são executados em tempo de compilação
 */
describe('Entity Type Tests', () => {
  describe('TStrategyEntity', () => {
    it('should have all required fields', () => {
      const strategy: TStrategyEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Strategy',
        risk_level: 'low',
        expected_return: 8.5,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        is_active: true,
      };

      // TypeScript irá falhar se algum campo obrigatório estiver ausente
      expect(strategy.id).toBeDefined();
      expect(strategy.name).toBeDefined();
      expect(strategy.risk_level).toBeDefined();
      expect(strategy.expected_return).toBeDefined();
      expect(strategy.created_at).toBeDefined();
      expect(strategy.updated_at).toBeDefined();
      expect(strategy.is_active).toBeDefined();
    });

    it('should allow optional fields', () => {
      const strategy: TStrategyEntity = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Strategy',
        description: 'Optional description',
        risk_level: 'medium',
        expected_return: 12.0,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        is_active: true,
        tags: ['tag1', 'tag2'],
        metadata: { key: 'value' },
      };

      expect(strategy.description).toBeDefined();
      expect(strategy.tags).toBeDefined();
      expect(strategy.metadata).toBeDefined();
    });

    it('should enforce risk_level enum', () => {
      // @ts-expect-error - 'invalid' is not a valid risk level
      const invalidStrategy: TStrategyEntity = {
        id: '123',
        name: 'Test',
        risk_level: 'invalid', // Erro de tipo esperado
        expected_return: 10,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        is_active: true,
      };
    });
  });

  describe('TUserEntity', () => {
    it('should have nested object types', () => {
      const user: TUserEntity = {
        id: '123',
        full_name: 'John Doe',
        email_address: 'john@example.com',
        birth_date: '1990-01-01',
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: false,
            sms: true,
          },
          theme: 'dark',
        },
        profile: {
          bio: 'Software developer',
        },
        verification: {
          email_verified: true,
          phone_verified: false,
          identity_verified: false,
        },
      };

      expect(user.preferences.language).toBe('pt-BR');
      expect(user.preferences.notifications.email).toBe(true);
      expect(user.verification.email_verified).toBe(true);
    });
  });

  describe('Type Utilities', () => {
    it('should work with utility types', () => {
      // Teste de Pick
      type StrategyBasics = Pick<TStrategyEntity, 'id' | 'name' | 'risk_level'>;
      const basics: StrategyBasics = {
        id: '123',
        name: 'Test',
        risk_level: 'low',
      };

      // Teste de Omit
      type StrategyWithoutDates = Omit<TStrategyEntity, 'created_at' | 'updated_at'>;
      const withoutDates: StrategyWithoutDates = {
        id: '123',
        name: 'Test',
        risk_level: 'medium',
        expected_return: 10,
        is_active: true,
      };

      // Teste de Partial
      type PartialStrategy = Partial<TStrategyEntity>;
      const partial: PartialStrategy = {
        name: 'Partial Strategy',
      };

      expect(basics.id).toBeDefined();
      expect(withoutDates.name).toBeDefined();
      expect(partial.name).toBeDefined();
    });
  });
});

/**
 * Testes de runtime para validar estrutura de dados
 */
describe('Entity Runtime Validation', () => {
  describe('TStrategyEntity', () => {
    it('should validate required fields at runtime', () => {
      const isValidStrategy = (obj: any): obj is TStrategyEntity => {
        return (
          typeof obj.id === 'string' &&
          typeof obj.name === 'string' &&
          ['low', 'medium', 'high'].includes(obj.risk_level) &&
          typeof obj.expected_return === 'number' &&
          typeof obj.created_at === 'string' &&
          typeof obj.updated_at === 'string' &&
          typeof obj.is_active === 'boolean'
        );
      };

      const validStrategy = {
        id: '123',
        name: 'Test',
        risk_level: 'low',
        expected_return: 10,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T15:30:00Z',
        is_active: true,
      };

      const invalidStrategy = {
        id: 123, // Deveria ser string
        name: 'Test',
        risk_level: 'invalid',
        expected_return: 'not a number',
      };

      expect(isValidStrategy(validStrategy)).toBe(true);
      expect(isValidStrategy(invalidStrategy)).toBe(false);
    });
  });
});
```

---

## 🔧 CLI Khaos

```bash
khaos create entity
khaos update entity
khaos check entity
khaos delete entity
```

---

## ✨ Criar Entity

1. **Informar o propósito**: Descrever qual endpoint/dados da API a entity representa
2. **Nome da entity**: Nome que representa o recurso da API
3. **Definir campos**: Especificar todos os campos retornados pela API
4. **Configurar tipos**: Definir tipos TypeScript apropriados
5. **Adicionar documentação**: JSDoc com exemplos de uso

6. **Estrutura sugerida**:
   ```text
   src/entities/
   ├── strategy.entity.ts
   ├── strategy.entity.spec.ts
   ├── user.entity.ts
   ├── user.entity.spec.ts
   └── transaction.entity.ts
   ```

7. **Commit automático**:
   ```bash
   ✨ feat(entity): estrutura base de `strategy` (wip)
   ```

---

## ♻️ Atualizar Entity

```bash
♻️ refactor(entity): renomear `strategy` para `investment-strategy`
```

---

## ✅ Validar Entity

```bash
khaos check entity
```

```text
Check das Entities:
- strategy: ✅ Válido
- user: ❌ Erro: Nome não começa com 'T'
- transaction: ⚠️ Aviso: Muitos campos opcionais, verificar API
Resumo: 1/3 entities válidas
```

---

## 🗑️ Remover Entity

```bash
🗑️ chore(entity): remover entity `strategy`
```

---

## 📋 Responsabilidades das Entities

### ✅ O que Entities DEVEM fazer:
- **Representar fielmente** a estrutura de dados da API
- **Documentar contratos** de dados entre frontend e backend
- **Fornecer type safety** para dados da API
- **Usar nomenclatura** exatamente como vem da API (snake_case, etc.)
- **Incluir todos os campos** retornados pela API
- **Definir tipos precisos** para cada campo
- **Documentar campos opcionais** claramente

### ❌ O que Entities NÃO devem fazer:
- **Conter lógica** de transformação ou validação
- **Ter métodos** ou funções
- **Fazer transformações** de nomenclatura (camelCase, etc.)
- **Incluir campos calculados** que não vêm da API
- **Ter dependências** de outras camadas
- **Conter valores padrão** ou inicializações

---

## 🔄 Relacionamento com Outras Camadas

### Uso em Gateways
```ts
// find-one-strategy.gateway.ts
import type { TStrategyEntity } from '@/entities/strategy.entity';

export const findOneStrategyGateway = async (id: string): Promise<TStrategyEntity> => {
  const response = await api.get(`/strategies/${id}`);
  return response.data; // Dados vêm exatamente como definido na entity
};
```

### Uso em Models
```ts
// strategy.model.ts
import type { TStrategyEntity } from '@/entities/strategy.entity';

export class StrategyModel {
  static fromEntity(entity: TStrategyEntity): TProcessedStrategy {
    // Transformar dados da entity para formato processado
    return {
      id: entity.id,
      name: entity.name.trim(), // Transformações aplicadas aqui
      riskLevel: entity.risk_level, // Mudança de nomenclatura aqui
      // ...
    };
  }
}
```

### Uso em Repositories
```ts
// strategy.repository.ts
import type { TStrategyEntity, TCreateStrategyEntity } from '@/entities/strategy.entity';
import { StrategyModel } from '@/models/strategy.model';

export const useStrategyRepository = () => {
  const create = async (data: TCreateStrategyEntity) => {
    const entity = await createStrategyGateway(data);
    return StrategyModel.fromEntity(entity);
  };

  return { create };
};
```

---

## 📚 Padrões de Nomenclatura

### Convenções da API
```ts
// ✅ Correto - Manter nomenclatura da API
export type TUserEntity = {
  user_id: string;        // snake_case da API
  full_name: string;      // snake_case da API
  email_address: string;  // snake_case da API
  created_at: string;     // snake_case da API
};

// ❌ Incorreto - Não transformar nomenclatura
export type TUserEntity = {
  userId: string;         // Não fazer camelCase
  fullName: string;       // Não fazer camelCase
  emailAddress: string;   // Não fazer camelCase
  createdAt: Date;        // Não transformar tipos
};
```

### Tipos Derivados
```ts
// ✅ Usar utility types para criar variações
export type TCreateUserEntity = Omit<TUserEntity, 'id' | 'created_at' | 'updated_at'>;
export type TUpdateUserEntity = Partial<TCreateUserEntity>;
export type TPublicUserEntity = Pick<TUserEntity, 'id' | 'full_name' | 'avatar_url'>;

// ✅ Criar tipos específicos para respostas diferentes
export type TUserListEntity = {
  data: TUserEntity[];
  pagination: TPaginationEntity;
};

export type TUserWithStatsEntity = TUserEntity & {
  statistics: TUserStatsEntity;
};
```

---

## 📊 Documentação de Campos

### JSDoc Detalhado
```ts
export type TStrategyEntity = {
  /**
   * Identificador único da estratégia
   * @format UUID v4
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  
  /**
   * Nome da estratégia
   * @minLength 3
   * @maxLength 100
   * @example "Estratégia Conservadora"
   */
  name: string;
  
  /**
   * Nível de risco da estratégia
   * @enum ["low", "medium", "high"]
   */
  risk_level: 'low' | 'medium' | 'high';
  
  /**
   * Retorno esperado em porcentagem
   * @minimum 0
   * @maximum 100
   * @example 8.5
   */
  expected_return: number;
  
  /**
   * Data de criação no formato ISO 8601
   * @format date-time
   * @example "2024-01-15T10:00:00Z"
   */
  created_at: string;
};
```

### Exemplos de Uso
```ts
/**
 * @example
 * ```json
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "name": "Estratégia Conservadora",
 *   "description": "Uma estratégia de baixo risco",
 *   "risk_level": "low",
 *   "expected_return": 8.5,
 *   "created_at": "2024-01-15T10:00:00Z",
 *   "updated_at": "2024-01-20T15:30:
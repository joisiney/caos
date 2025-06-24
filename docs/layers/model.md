# 🏗️ Models

Models são **classes que encapsulam regras de negócio e transformações**, sendo de uso exclusivo para tratar dados recebidos de API na camada de repository. Eles representam a lógica de domínio da aplicação, transformando dados brutos em objetos estruturados e aplicando validações e regras específicas do negócio.

> ❗️Models devem ser **stateless** e focados em **transformação de dados**. Eles não devem conter lógica de UI ou efeitos colaterais, apenas regras puras de negócio.

---

## 🔹 Estrutura `src/models/{name}`

* **Sufixo**: `.model.ts`
* **Exemplo**: `strategy.model.ts` com `StrategyModel`
* **Arquivos permitidos**:
  * `{name}.model.ts`
  * `{name}.model.spec.ts`

> ✅ Models são classes simples focadas em transformação de dados, não necessitando de estrutura complexa de pastas

---

## 📄 Exemplo `strategy.model.ts`

```ts
import { z } from 'zod';
import type { TStrategyEntity } from '@/entities/strategy.entity';

// Schema de validação para dados de entrada
const StrategyInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high']),
  expected_return: z.number().min(0).max(100),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  is_active: z.boolean(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Schema para dados processados
const ProcessedStrategySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  expectedReturn: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean(),
  tags: z.array(z.string()),
  metadata: z.record(z.unknown()),
  // Campos calculados
  riskScore: z.number(),
  formattedReturn: z.string(),
  ageInDays: z.number(),
  status: z.enum(['active', 'inactive', 'archived']),
});

export type TProcessedStrategy = z.infer<typeof ProcessedStrategySchema>;

export class StrategyModel {
  private static readonly RISK_SCORES = {
    low: 1,
    medium: 5,
    high: 10,
  } as const;

  private static readonly DEFAULT_DESCRIPTION = 'Estratégia sem descrição';

  /**
   * Transforma dados brutos da API em objeto processado
   */
  static fromEntity(entity: TStrategyEntity): TProcessedStrategy {
    // Validar dados de entrada
    const validatedInput = StrategyInputSchema.parse(entity);

    // Transformar e calcular campos
    const processed = {
      id: validatedInput.id,
      name: validatedInput.name.trim(),
      description: validatedInput.description || this.DEFAULT_DESCRIPTION,
      riskLevel: validatedInput.risk_level,
      expectedReturn: validatedInput.expected_return,
      createdAt: new Date(validatedInput.created_at),
      updatedAt: new Date(validatedInput.updated_at),
      isActive: validatedInput.is_active,
      tags: validatedInput.tags || [],
      metadata: validatedInput.metadata || {},
      // Campos calculados
      riskScore: this.calculateRiskScore(validatedInput.risk_level, validatedInput.expected_return),
      formattedReturn: this.formatReturn(validatedInput.expected_return),
      ageInDays: this.calculateAgeInDays(validatedInput.created_at),
      status: this.determineStatus(validatedInput.is_active, validatedInput.updated_at),
    };

    // Validar dados processados
    return ProcessedStrategySchema.parse(processed);
  }

  /**
   * Transforma múltiplas entities em array processado
   */
  static fromEntities(entities: TStrategyEntity[]): TProcessedStrategy[] {
    return entities.map(entity => this.fromEntity(entity));
  }

  /**
   * Converte objeto processado de volta para formato de API
   */
  static toEntity(processed: TProcessedStrategy): TStrategyEntity {
    return {
      id: processed.id,
      name: processed.name,
      description: processed.description === this.DEFAULT_DESCRIPTION ? undefined : processed.description,
      risk_level: processed.riskLevel,
      expected_return: processed.expectedReturn,
      created_at: processed.createdAt.toISOString(),
      updated_at: processed.updatedAt.toISOString(),
      is_active: processed.isActive,
      tags: processed.tags.length > 0 ? processed.tags : undefined,
      metadata: Object.keys(processed.metadata).length > 0 ? processed.metadata : undefined,
    };
  }

  /**
   * Filtra estratégias por critérios específicos
   */
  static filterByRisk(
    strategies: TProcessedStrategy[], 
    riskLevels: Array<'low' | 'medium' | 'high'>
  ): TProcessedStrategy[] {
    return strategies.filter(strategy => riskLevels.includes(strategy.riskLevel));
  }

  /**
   * Ordena estratégias por critério específico
   */
  static sortBy(
    strategies: TProcessedStrategy[], 
    criteria: 'name' | 'expectedReturn' | 'riskScore' | 'createdAt',
    order: 'asc' | 'desc' = 'asc'
  ): TProcessedStrategy[] {
    const sorted = [...strategies].sort((a, b) => {
      let comparison = 0;

      switch (criteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'expectedReturn':
          comparison = a.expectedReturn - b.expectedReturn;
          break;
        case 'riskScore':
          comparison = a.riskScore - b.riskScore;
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }

      return order === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Agrupa estratégias por nível de risco
   */
  static groupByRisk(strategies: TProcessedStrategy[]): Record<string, TProcessedStrategy[]> {
    return strategies.reduce((groups, strategy) => {
      const risk = strategy.riskLevel;
      if (!groups[risk]) {
        groups[risk] = [];
      }
      groups[risk].push(strategy);
      return groups;
    }, {} as Record<string, TProcessedStrategy[]>);
  }

  /**
   * Calcula estatísticas do conjunto de estratégias
   */
  static calculateStats(strategies: TProcessedStrategy[]) {
    if (strategies.length === 0) {
      return {
        total: 0,
        averageReturn: 0,
        averageRisk: 0,
        activeCount: 0,
        inactiveCount: 0,
      };
    }

    const totalReturn = strategies.reduce((sum, s) => sum + s.expectedReturn, 0);
    const totalRisk = strategies.reduce((sum, s) => sum + s.riskScore, 0);
    const activeCount = strategies.filter(s => s.status === 'active').length;

    return {
      total: strategies.length,
      averageReturn: Number((totalReturn / strategies.length).toFixed(2)),
      averageRisk: Number((totalRisk / strategies.length).toFixed(2)),
      activeCount,
      inactiveCount: strategies.length - activeCount,
    };
  }

  /**
   * Valida se uma estratégia atende aos critérios mínimos
   */
  static validate(strategy: TProcessedStrategy): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (strategy.name.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (strategy.expectedReturn < 0 || strategy.expectedReturn > 100) {
      errors.push('Retorno esperado deve estar entre 0% e 100%');
    }

    if (strategy.riskLevel === 'high' && strategy.expectedReturn < 10) {
      errors.push('Estratégias de alto risco devem ter retorno esperado mínimo de 10%');
    }

    if (strategy.ageInDays < 0) {
      errors.push('Data de criação não pode ser futura');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Métodos privados para cálculos
  private static calculateRiskScore(riskLevel: 'low' | 'medium' | 'high', expectedReturn: number): number {
    const baseScore = this.RISK_SCORES[riskLevel];
    const returnMultiplier = expectedReturn / 10; // Normalizar para 0-10
    return Number((baseScore * (1 + returnMultiplier / 10)).toFixed(2));
  }

  private static formatReturn(expectedReturn: number): string {
    return `${expectedReturn.toFixed(2)}%`;
  }

  private static calculateAgeInDays(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static determineStatus(isActive: boolean, updatedAt: string): 'active' | 'inactive' | 'archived' {
    if (!isActive) return 'inactive';
    
    const updated = new Date(updatedAt);
    const now = new Date();
    const daysSinceUpdate = Math.ceil((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceUpdate > 90) return 'archived';
    return 'active';
  }
}
```

---

## 📄 Exemplo `strategy.model.spec.ts`

```ts
import { StrategyModel, TProcessedStrategy } from './strategy.model';
import type { TStrategyEntity } from '@/entities/strategy.entity';

describe('StrategyModel', () => {
  const mockEntity: TStrategyEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: '  Estratégia Conservadora  ',
    description: 'Uma estratégia de baixo risco',
    risk_level: 'low',
    expected_return: 8.5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T15:30:00Z',
    is_active: true,
    tags: ['conservadora', 'renda-fixa'],
    metadata: { category: 'bonds' },
  };

  describe('fromEntity', () => {
    it('deve transformar entity em objeto processado corretamente', () => {
      const result = StrategyModel.fromEntity(mockEntity);

      expect(result.id).toBe(mockEntity.id);
      expect(result.name).toBe('Estratégia Conservadora'); // Trimmed
      expect(result.description).toBe(mockEntity.description);
      expect(result.riskLevel).toBe('low');
      expect(result.expectedReturn).toBe(8.5);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.isActive).toBe(true);
      expect(result.tags).toEqual(['conservadora', 'renda-fixa']);
      expect(result.metadata).toEqual({ category: 'bonds' });
    });

    it('deve calcular campos derivados corretamente', () => {
      const result = StrategyModel.fromEntity(mockEntity);

      expect(result.riskScore).toBeGreaterThan(0);
      expect(result.formattedReturn).toBe('8.50%');
      expect(result.ageInDays).toBeGreaterThan(0);
      expect(result.status).toBe('active');
    });

    it('deve aplicar valores padrão para campos opcionais', () => {
      const entityWithoutOptionals: TStrategyEntity = {
        ...mockEntity,
        description: undefined,
        tags: undefined,
        metadata: undefined,
      };

      const result = StrategyModel.fromEntity(entityWithoutOptionals);

      expect(result.description).toBe('Estratégia sem descrição');
      expect(result.tags).toEqual([]);
      expect(result.metadata).toEqual({});
    });

    it('deve lançar erro para dados inválidos', () => {
      const invalidEntity = {
        ...mockEntity,
        id: 'invalid-uuid',
      };

      expect(() => StrategyModel.fromEntity(invalidEntity as TStrategyEntity))
        .toThrow();
    });
  });

  describe('fromEntities', () => {
    it('deve transformar array de entities', () => {
      const entities = [mockEntity, { ...mockEntity, id: '456' }];
      const result = StrategyModel.fromEntities(entities);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockEntity.id);
      expect(result[1].id).toBe('456');
    });
  });

  describe('toEntity', () => {
    it('deve converter objeto processado de volta para entity', () => {
      const processed = StrategyModel.fromEntity(mockEntity);
      const result = StrategyModel.toEntity(processed);

      expect(result.id).toBe(mockEntity.id);
      expect(result.name).toBe('Estratégia Conservadora');
      expect(result.risk_level).toBe('low');
      expect(result.expected_return).toBe(8.5);
      expect(result.is_active).toBe(true);
    });

    it('deve omitir campos opcionais quando são valores padrão', () => {
      const processedWithDefaults: TProcessedStrategy = {
        ...StrategyModel.fromEntity(mockEntity),
        description: 'Estratégia sem descrição',
        tags: [],
        metadata: {},
      };

      const result = StrategyModel.toEntity(processedWithDefaults);

      expect(result.description).toBeUndefined();
      expect(result.tags).toBeUndefined();
      expect(result.metadata).toBeUndefined();
    });
  });

  describe('filterByRisk', () => {
    it('deve filtrar estratégias por nível de risco', () => {
      const strategies = [
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'low' }),
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'high' }),
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'medium' }),
      ];

      const result = StrategyModel.filterByRisk(strategies, ['low', 'medium']);

      expect(result).toHaveLength(2);
      expect(result.every(s => ['low', 'medium'].includes(s.riskLevel))).toBe(true);
    });
  });

  describe('sortBy', () => {
    it('deve ordenar por nome em ordem crescente', () => {
      const strategies = [
        StrategyModel.fromEntity({ ...mockEntity, name: 'Zebra' }),
        StrategyModel.fromEntity({ ...mockEntity, name: 'Alpha' }),
        StrategyModel.fromEntity({ ...mockEntity, name: 'Beta' }),
      ];

      const result = StrategyModel.sortBy(strategies, 'name', 'asc');

      expect(result[0].name).toBe('Alpha');
      expect(result[1].name).toBe('Beta');
      expect(result[2].name).toBe('Zebra');
    });

    it('deve ordenar por retorno esperado em ordem decrescente', () => {
      const strategies = [
        StrategyModel.fromEntity({ ...mockEntity, expected_return: 5 }),
        StrategyModel.fromEntity({ ...mockEntity, expected_return: 15 }),
        StrategyModel.fromEntity({ ...mockEntity, expected_return: 10 }),
      ];

      const result = StrategyModel.sortBy(strategies, 'expectedReturn', 'desc');

      expect(result[0].expectedReturn).toBe(15);
      expect(result[1].expectedReturn).toBe(10);
      expect(result[2].expectedReturn).toBe(5);
    });
  });

  describe('groupByRisk', () => {
    it('deve agrupar estratégias por nível de risco', () => {
      const strategies = [
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'low' }),
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'high' }),
        StrategyModel.fromEntity({ ...mockEntity, risk_level: 'low' }),
      ];

      const result = StrategyModel.groupByRisk(strategies);

      expect(result.low).toHaveLength(2);
      expect(result.high).toHaveLength(1);
      expect(result.medium).toBeUndefined();
    });
  });

  describe('calculateStats', () => {
    it('deve calcular estatísticas corretamente', () => {
      const strategies = [
        StrategyModel.fromEntity({ ...mockEntity, expected_return: 10, is_active: true }),
        StrategyModel.fromEntity({ ...mockEntity, expected_return: 20, is_active: false }),
      ];

      const result = StrategyModel.calculateStats(strategies);

      expect(result.total).toBe(2);
      expect(result.averageReturn).toBe(15);
      expect(result.activeCount).toBe(1);
      expect(result.inactiveCount).toBe(1);
    });

    it('deve retornar estatísticas zeradas para array vazio', () => {
      const result = StrategyModel.calculateStats([]);

      expect(result.total).toBe(0);
      expect(result.averageReturn).toBe(0);
      expect(result.averageRisk).toBe(0);
      expect(result.activeCount).toBe(0);
      expect(result.inactiveCount).toBe(0);
    });
  });

  describe('validate', () => {
    it('deve validar estratégia válida', () => {
      const strategy = StrategyModel.fromEntity(mockEntity);
      const result = StrategyModel.validate(strategy);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve detectar nome muito curto', () => {
      const strategy = StrategyModel.fromEntity({ ...mockEntity, name: 'AB' });
      const result = StrategyModel.validate(strategy);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome deve ter pelo menos 3 caracteres');
    });

    it('deve detectar retorno inválido', () => {
      const strategy = StrategyModel.fromEntity({ ...mockEntity, expected_return: 150 });
      const result = StrategyModel.validate(strategy);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Retorno esperado deve estar entre 0% e 100%');
    });

    it('deve detectar inconsistência entre risco alto e retorno baixo', () => {
      const strategy = StrategyModel.fromEntity({ 
        ...mockEntity, 
        risk_level: 'high', 
        expected_return: 5 
      });
      const result = StrategyModel.validate(strategy);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Estratégias de alto risco devem ter retorno esperado mínimo de 10%');
    });
  });
});
```

---

## 🔧 CLI Khaos

```bash
khaos create model
khaos update model
khaos check model
khaos delete model
```

---

## ✨ Criar Model

1. **Informar o propósito**: Descrever as regras de negócio que o model irá encapsular
2. **Nome do model**: Nome da entidade de domínio
3. **Definir transformações**: Especificar como os dados serão processados
4. **Configurar validações**: Definir regras de validação com Zod
5. **Implementar métodos utilitários**: Filtros, ordenação, agrupamento, etc.

6. **Estrutura sugerida**:
   ```text
   src/models/
   ├── strategy.model.ts
   ├── strategy.model.spec.ts
   ├── user.model.ts
   ├── user.model.spec.ts
   └── transaction.model.ts
   ```

7. **Commit automático**:
   ```bash
   ✨ feat(model): estrutura base de `strategy` (wip)
   ```

---

## ♻️ Atualizar Model

```bash
♻️ refactor(model): renomear `strategy` para `investment-strategy`
```

---

## ✅ Validar Model

```bash
khaos check model
```

```text
Check dos Models:
- strategy: ✅ Válido
- user: ❌ Erro: Método com efeito colateral detectado
- transaction: ⚠️ Aviso: Muitos métodos públicos, considere dividir
Resumo: 1/3 models válidos
```

---

## 🗑️ Remover Model

```bash
🗑️ chore(model): remover model `strategy`
```

---

## 📋 Responsabilidades dos Models

### ✅ O que Models DEVEM fazer:
- **Transformar dados** de entities em objetos processados
- **Aplicar regras de negócio** específicas do domínio
- **Validar dados** usando schemas rigorosos
- **Calcular campos derivados** baseados nos dados originais
- **Fornecer métodos utilitários** para manipulação de dados
- **Encapsular lógica de domínio** complexa
- **Manter consistência** de dados através de validações

### ❌ O que Models NÃO devem fazer:
- **Fazer chamadas para APIs** ou serviços externos
- **Conter lógica de UI** ou apresentação
- **Gerenciar estado** de componentes
- **Ter efeitos colaterais** (side effects)
- **Acessar localStorage** ou outras APIs do browser
- **Implementar lógica de navegação**
- **Fazer logging** ou analytics diretamente

---

## 🔄 Relacionamento com Outras Camadas

### Uso em Repositories
```ts
// strategy.repository.ts
import { StrategyModel } from '@/models/strategy.model';
import { findManyStrategiesGateway } from '@/gateways/find-many-strategies.gateway';

export const useStrategyRepository = () => {
  const getStrategies = async () => {
    const entities = await findManyStrategiesGateway();
    return StrategyModel.fromEntities(entities);
  };

  const getActiveStrategies = async () => {
    const strategies = await getStrategies();
    return strategies.filter(s => s.status === 'active');
  };

  return {
    getStrategies,
    getActiveStrategies,
  };
};
```

### Uso em Features (através de repositories)
```tsx
// wallet-strategies.feature.tsx
import { useStrategyRepository } from '@/repositories/strategy.repository';

export const WalletStrategiesFeature: FC<Props> = ({ testID }) => {
  const { getStrategies } = useStrategyRepository();
  const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    const loadStrategies = async () => {
      const data = await getStrategies();
      // Dados já vêm processados pelo model
      setStrategies(data);
    };

    loadStrategies();
  }, []);

  return (
    <View testID={`${testID}-feature`}>
      {strategies.map(strategy => (
        <StrategyCard 
          key={strategy.id}
          name={strategy.name}
          formattedReturn={strategy.formattedReturn}
          riskLevel={strategy.riskLevel}
        />
      ))}
    </View>
  );
};
```

---

## 📚 Padrões de Design em Models

### 1. **Static Factory Methods**
```ts
export class UserModel {
  static fromEntity(entity: TUserEntity): TProcessedUser {
    // Transformação de dados
  }

  static fromPartialEntity(partial: Partial<TUserEntity>): Partial<TProcessedUser> {
    // Transformação parcial
  }
}
```

### 2. **Builder Pattern** (para casos complexos)
```ts
export class StrategyModelBuilder {
  private strategy: Partial<TProcessedStrategy> = {};

  withBasicInfo(name: string, description: string): this {
    this.strategy.name = name;
    this.strategy.description = description;
    return this;
  }

  withRisk(level: 'low' | 'medium' | 'high', expectedReturn: number): this {
    this.strategy.riskLevel = level;
    this.strategy.expectedReturn = expectedReturn;
    return this;
  }

  build(): TProcessedStrategy {
    return StrategyModel.fromPartial(this.strategy);
  }
}
```

### 3. **Validation Chain**
```ts
export class ValidationChain {
  private errors: string[] = [];

  validateName(name: string): this {
    if (name.length < 3) {
      this.errors.push('Nome muito curto');
    }
    return this;
  }

  validateReturn(expectedReturn: number): this {
    if (expectedReturn < 0 || expectedReturn > 100) {
      this.errors.push('Retorno inválido');
    }
    return this;
  }

  getResult(): { isValid: boolean; errors: string[] } {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
    };
  }
}
```

---

## 📊 Exemplos de Transformações Comuns

### Normalização de Dados
```ts
static normalizeUserData(entity: TUserEntity): TProcessedUser {
  return {
    id: entity.id,
    name: entity.full_name.trim().toLowerCase(),
    email: entity.email_address.toLowerCase(),
    phone: entity.phone_number.replace(/\D/g, ''), // Apenas números
    birthDate: new Date(entity.birth_date),
    isActive: entity.status === 'active',
  };
}
```

### Cálculos de Negócio
```ts
static calculatePortfolioMetrics(strategies: TProcessedStrategy[]) {
  const totalValue = strategies.reduce((sum, s) => sum + s.currentValue, 0);
  const weightedReturn = strategies.reduce((sum, s) => {
    const weight = s.currentValue / totalValue;
    return sum + (s.expectedReturn * weight);
  }, 0);

  return {
    totalValue,
    weightedReturn,
    diversificationScore: this.calculateDiversification(strategies),
    riskScore: this.calculatePortfolioRisk(strategies),
  };
}
```

### Formatação e Apresentação
```ts
static formatForDisplay(strategy: TProcessedStrategy) {
  return {
    ...strategy,
    formattedValue: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(strategy.currentValue),
    
    formattedReturn: `${strategy.expectedReturn.toFixed(2)}%`,
    
    relativeTime: this.getRelativeTime(strategy.createdAt),
    
    riskBadge: {
      low: { color: 'green', label: 'Baixo Risco' },
      medium: { color: 'yellow', label: 'Risco Moderado' },
      high: { color: 'red', label: 'Alto Risco' },
    }[strategy.riskLevel],
  };
}
```

---

## 🧪 Estratégias de Teste

### Testes de Transformação
```ts
describe('Data Transformation', () => {
  it('should transform API data correctly', () => {
    const apiData = createMockApiData();
    const result = StrategyModel.fromEntity(apiData);
    
    expect(result).toMatchSnapshot();
    expect(result.formattedReturn).toBe('8.50%');
  });
});
```

### Testes de Validação
```ts
describe('Business Rules Validation', () => {
  it('should reject invalid risk/return combination', () => {
    const invalidStrategy = createHighRiskLowReturnStrategy();
    const result = StrategyModel.validate(invalidStrategy);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('High risk strategies must have minimum 10% return');
  });
});
```

### Testes de Cálculos
```ts
describe('Business Calculations', () => {
  it('should calculate portfolio metrics correctly', () => {
    const strategies = createMockStrategies();
    const metrics = StrategyModel.calculatePortfolioMetrics(strategies);
    
    expect(metrics.totalValue).toBe(10000);
    expect(metrics.weightedReturn).toBeCloseTo(12.5, 2);
  });
});
```

---

## 📚 Boas Práticas

### Performance
- **Use Object.freeze** para dados imutáveis
- **Implemente memoização** para cálculos pesados
- **Evite deep cloning** desnecessário
- **Use lazy evaluation** quando apropriado

### Manutenibilidade
- **Mantenha métodos pequenos** e focados
- **Use nomes descritivos** para métodos e variáveis
- **Documente regras de negócio** complexas
- **Versione schemas** quando necessário

### Testabilidade
- **Torne métodos determinísticos**
- **Evite dependências externas**
- **Use dependency injection** quando necessário
- **Forneça mocks** para testes

---

## 📚 Referências

* [Convenções Gerais](../general-conventions.md)
* [Validação Hermes](../validator.md)
* [Estrutura do Projeto](../project-structure.md)
* [Code Smells](../code-smells.md)
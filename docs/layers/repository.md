# 🗄️ Repositories

Repositories são **orquestradores que combinam múltiplos gateways** (hooks) para fornecer uma interface unificada de acesso a dados. Eles encapsulam a lógica de combinação de diferentes fontes de dados e aplicam transformações através de models, oferecendo uma API limpa para as features usando **React Query (TanStack Query)** para gerenciamento de estado servidor.

> ❗️Repositories devem ser **hooks** que orquestram gateways e aplicam models usando React Query. O nome NÃO deve ser prefixado com verbos, pois podem combinar diversas operações.

---

## 🔹 Estrutura `src/repositories/{name}`

* **Sufixo**: `.repository.ts`
* **Exemplo**: `strategy.repository.ts` com `useStrategyRepository`
* **Arquivos permitidos**:
  * `{name}.repository.ts`
  * `{name}.repository.spec.ts`

> ✅ **Convenção**: Export deve seguir o padrão `use{Name}Repository` (hook pattern)

---

## 📚 React Query Integration

### 🎯 Conceitos Fundamentais

#### **useQuery vs useSuspenseQuery**
- **`useQuery`**: Para operações GET com loading states manuais
- **`useSuspenseQuery`**: Para operações GET com Suspense boundaries

#### **useMutation**
- Para operações POST/PUT/DELETE que modificam dados
- Integração automática com invalidação de cache

#### **Query Keys**
- Padrão hierárquico: `[entity, operation, ...params]`
- Exemplo: `['strategy', 'list', { filters }]` ou `['strategy', 'detail', id]`

---

## 📄 Exemplo `strategy.repository.ts`

```ts
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StrategyModel, type TProcessedStrategy } from '@/models/strategy.model';
import { findManyStrategiesGateway } from '@/gateways/find-many-strategies.gateway';
import { findOneStrategyGateway } from '@/gateways/find-one-strategy.gateway';
import { createStrategyGateway } from '@/gateways/create-strategy.gateway';
import { updateStrategyGateway } from '@/gateways/update-strategy.gateway';
import { deleteStrategyGateway } from '@/gateways/delete-strategy.gateway';
import type { 
  TStrategyEntity, 
  TCreateStrategyEntity, 
  TUpdateStrategyEntity,
  TStrategyFiltersEntity 
} from '@/entities/strategy.entity';

/**
 * Query Keys para estratégias
 * Padrão hierárquico para invalidação eficiente
 */
export const strategyKeys = {
  all: ['strategy'] as const,
  lists: () => [...strategyKeys.all, 'list'] as const,
  list: (filters?: TStrategyFiltersEntity) => [...strategyKeys.lists(), filters] as const,
  details: () => [...strategyKeys.all, 'detail'] as const,
  detail: (id: string) => [...strategyKeys.details(), id] as const,
  stats: () => [...strategyKeys.all, 'stats'] as const,
  portfolioStats: (ids?: string[]) => [...strategyKeys.stats(), 'portfolio', ids] as const,
} as const;

/**
 * Repository para gerenciamento de estratégias
 * Combina múltiplos gateways e aplica transformações via models usando React Query
 */
export const useStrategyRepository = () => {
  const queryClient = useQueryClient();

  /**
   * Busca todas as estratégias com filtros opcionais
   * @param filters - Filtros de busca
   * @param options - Opções do React Query
   */
  const useFindMany = (
    filters?: TStrategyFiltersEntity,
    options?: {
      enabled?: boolean;
      staleTime?: number;
      suspense?: boolean;
    }
  ) => {
    const queryFn = async (): Promise<TProcessedStrategy[]> => {
      const response = await findManyStrategiesGateway(filters);
      return StrategyModel.fromEntities(response.data);
    };

    if (options?.suspense) {
      return useSuspenseQuery({
        queryKey: strategyKeys.list(filters),
        queryFn,
        staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutos
      });
    }

    return useQuery({
      queryKey: strategyKeys.list(filters),
      queryFn,
      enabled: options?.enabled ?? true,
      staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutos
    });
  };

  /**
   * Busca uma estratégia específica por ID
   * @param id - ID da estratégia
   * @param options - Opções do React Query
   */
  const useFindOne = (
    id: string,
    options?: {
      enabled?: boolean;
      staleTime?: number;
      suspense?: boolean;
    }
  ) => {
    const queryFn = async (): Promise<TProcessedStrategy> => {
      const entity = await findOneStrategyGateway(id);
      return StrategyModel.fromEntity(entity);
    };

    if (options?.suspense) {
      return useSuspenseQuery({
        queryKey: strategyKeys.detail(id),
        queryFn,
        staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutos
      });
    }

    return useQuery({
      queryKey: strategyKeys.detail(id),
      queryFn,
      enabled: (options?.enabled ?? true) && !!id,
      staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutos
    });
  };

  /**
   * Cria uma nova estratégia
   * Invalida automaticamente as listas relacionadas
   */
  const useCreate = () => {
    return useMutation({
      mutationFn: async (data: TCreateStrategyEntity): Promise<TProcessedStrategy> => {
        // Validar dados antes de enviar
        const validation = StrategyModel.validate({
          ...data,
          id: 'temp', // ID temporário para validação
          createdAt: new Date(),
          updatedAt: new Date(),
          riskScore: 0,
          formattedReturn: '',
          ageInDays: 0,
          status: 'active',
        } as TProcessedStrategy);

        if (!validation.isValid) {
          throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
        }

        const entity = await createStrategyGateway(data);
        return StrategyModel.fromEntity(entity);
      },
      onSuccess: (newStrategy) => {
        // Invalidar listas para refetch
        queryClient.invalidateQueries({ queryKey: strategyKeys.lists() });
        
        // Adicionar ao cache de detalhes
        queryClient.setQueryData(
          strategyKeys.detail(newStrategy.id),
          newStrategy
        );
      },
    });
  };

  /**
   * Atualiza uma estratégia existente
   * Atualiza automaticamente o cache
   */
  const useUpdate = () => {
    return useMutation({
      mutationFn: async ({ 
        id, 
        data 
      }: { 
        id: string; 
        data: TUpdateStrategyEntity 
      }): Promise<TProcessedStrategy> => {
        const entity = await updateStrategyGateway(id, data);
        return StrategyModel.fromEntity(entity);
      },
      onSuccess: (updatedStrategy, { id }) => {
        // Atualizar cache de detalhes
        queryClient.setQueryData(
          strategyKeys.detail(id),
          updatedStrategy
        );

        // Atualizar listas que podem conter esta estratégia
        queryClient.invalidateQueries({ queryKey: strategyKeys.lists() });
      },
    });
  };

  /**
   * Remove uma estratégia
   * Remove automaticamente do cache
   */
  const useRemove = () => {
    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await deleteStrategyGateway(id);
      },
      onSuccess: (_, id) => {
        // Remover do cache de detalhes
        queryClient.removeQueries({ queryKey: strategyKeys.detail(id) });
        
        // Invalidar listas para refetch
        queryClient.invalidateQueries({ queryKey: strategyKeys.lists() });
      },
    });
  };

  /**
   * Busca estratégias ativas
   * Usa cache compartilhado com findMany
   */
  const useFindActive = (options?: { suspense?: boolean }) => {
    return useFindMany(
      { is_active: true },
      {
        ...options,
        select: (strategies: TProcessedStrategy[]) => 
          strategies.filter(strategy => strategy.status === 'active'),
      }
    );
  };

  /**
   * Busca estratégias por nível de risco
   * @param riskLevels - Níveis de risco desejados
   */
  const useFindByRisk = (
    riskLevels: Array<'low' | 'medium' | 'high'>,
    options?: { suspense?: boolean }
  ) => {
    return useFindMany(
      { risk_level: riskLevels.join(',') as any },
      {
        ...options,
        select: (strategies: TProcessedStrategy[]) => 
          StrategyModel.filterByRisk(strategies, riskLevels),
      }
    );
  };

  /**
   * Busca estratégias com melhor performance
   * @param limit - Número máximo de resultados
   */
  const useFindTopPerforming = (
    limit: number = 10,
    options?: { suspense?: boolean }
  ) => {
    return useFindMany(
      { is_active: true },
      {
        ...options,
        select: (strategies: TProcessedStrategy[]) => {
          const sorted = StrategyModel.sortBy(strategies, 'expectedReturn', 'desc');
          return sorted.slice(0, limit);
        },
      }
    );
  };

  /**
   * Calcula estatísticas do portfólio de estratégias
   * @param strategyIds - IDs das estratégias (opcional, usa todas se não fornecido)
   */
  const useCalculatePortfolioStats = (strategyIds?: string[]) => {
    return useQuery({
      queryKey: strategyKeys.portfolioStats(strategyIds),
      queryFn: async () => {
        let strategies: TProcessedStrategy[];

        if (strategyIds) {
          // Buscar estratégias específicas
          strategies = await Promise.all(
            strategyIds.map(async (id) => {
              const entity = await findOneStrategyGateway(id);
              return StrategyModel.fromEntity(entity);
            })
          );
        } else {
          // Buscar todas as estratégias ativas
          const response = await findManyStrategiesGateway({ is_active: true });
          strategies = StrategyModel.fromEntities(response.data);
        }

        return StrategyModel.calculateStats(strategies);
      },
      staleTime: 2 * 60 * 1000, // 2 minutos
    });
  };

  /**
   * Busca estratégias com paginação
   * @param page - Página atual
   * @param perPage - Itens por página
   * @param filters - Filtros adicionais
   */
  const useFindPaginated = (
    page: number = 1,
    perPage: number = 20,
    filters?: Omit<TStrategyFiltersEntity, 'page' | 'per_page'>
  ) => {
    return useQuery({
      queryKey: strategyKeys.list({ ...filters, page, per_page: perPage }),
      queryFn: async () => {
        const response = await findManyStrategiesGateway({
          ...filters,
          page,
          per_page: perPage,
        });

        const strategies = StrategyModel.fromEntities(response.data);

        return {
          data: strategies,
          pagination: response.pagination,
          meta: response.meta,
        };
      },
      keepPreviousData: true, // Manter dados anteriores durante navegação
      staleTime: 30 * 1000, // 30 segundos para paginação
    });
  };

  /**
   * Utilitários para manipulação de cache
   */
  const utils = {
    /**
     * Invalida todas as queries de estratégias
     */
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.all });
    },

    /**
     * Invalida apenas as listas
     */
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.lists() });
    },

    /**
     * Revalida uma estratégia específica
     */
    revalidateOne: (id: string) => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.detail(id) });
    },

    /**
     * Atualiza uma estratégia no cache sem refetch
     */
    updateInCache: (id: string, updater: (old: TProcessedStrategy) => TProcessedStrategy) => {
      queryClient.setQueryData(strategyKeys.detail(id), updater);
    },

    /**
     * Pré-carrega uma estratégia
     */
    prefetch: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: strategyKeys.detail(id),
        queryFn: async () => {
          const entity = await findOneStrategyGateway(id);
          return StrategyModel.fromEntity(entity);
        },
        staleTime: 10 * 60 * 1000,
      });
    },
  };

  return {
    // Queries
    useFindMany,
    useFindOne,
    useFindActive,
    useFindByRisk,
    useFindTopPerforming,
    useFindPaginated,
    useCalculatePortfolioStats,
    
    // Mutations
    useCreate,
    useUpdate,
    useRemove,
    
    // Utilitários
    utils,
    
    // Query Keys (para uso externo)
    keys: strategyKeys,
  };
};

/**
 * Hook para operações de estratégias com estado otimista
 * Fornece atualizações otimistas para melhor UX
 */
export const useStrategyRepositoryOptimistic = () => {
  const repository = useStrategyRepository();
  const queryClient = useQueryClient();

  /**
   * Atualização otimista - atualiza UI imediatamente
   */
  const useOptimisticUpdate = () => {
    return useMutation({
      mutationFn: async ({ 
        id, 
        data 
      }: { 
        id: string; 
        data: TUpdateStrategyEntity 
      }) => {
        // Atualização otimista
        const previousStrategy = queryClient.getQueryData<TProcessedStrategy>(
          strategyKeys.detail(id)
        );

        if (previousStrategy) {
          queryClient.setQueryData(
            strategyKeys.detail(id),
            { ...previousStrategy, ...data }
          );
        }

        // Executar mutação real
        const entity = await updateStrategyGateway(id, data);
        return StrategyModel.fromEntity(entity);
      },
      onError: (_, { id }) => {
        // Reverter em caso de erro
        repository.utils.revalidateOne(id);
      },
      onSuccess: (updatedStrategy, { id }) => {
        // Confirmar dados corretos
        queryClient.setQueryData(
          strategyKeys.detail(id),
          updatedStrategy
        );
      },
    });
  };

  return {
    ...repository,
    useOptimisticUpdate,
  };
};
```

---

## 📄 Exemplo `user.repository.ts`

```ts
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserModel, type TProcessedUser } from '@/models/user.model';
import { findOneUserGateway } from '@/gateways/find-one-user.gateway';
import { updateUserGateway } from '@/gateways/update-user.gateway';
import { findUserPreferencesGateway } from '@/gateways/find-user-preferences.gateway';
import { updateUserPreferencesGateway } from '@/gateways/update-user-preferences.gateway';
import type { TUserEntity, TUpdateUserEntity } from '@/entities/user.entity';

/**
 * Query Keys para usuários
 */
export const userKeys = {
  all: ['user'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: (userId: string) => [...userKeys.profiles(), userId] as const,
  preferences: () => [...userKeys.all, 'preferences'] as const,
  userPreferences: (userId: string) => [...userKeys.preferences(), userId] as const,
} as const;

/**
 * Repository para gerenciamento de usuários
 * Combina dados de usuário com preferências e perfil
 */
export const useUserRepository = () => {
  const queryClient = useQueryClient();

  /**
   * Busca dados completos do usuário
   * @param userId - ID do usuário
   * @param options - Opções do React Query
   */
  const useFindUserProfile = (
    userId: string,
    options?: {
      enabled?: boolean;
      suspense?: boolean;
    }
  ) => {
    const queryFn = async (): Promise<TProcessedUser> => {
      // Buscar dados do usuário e preferências em paralelo
      const [userEntity, preferencesEntity] = await Promise.all([
        findOneUserGateway(userId),
        findUserPreferencesGateway(userId),
      ]);

      // Combinar dados e processar
      const combinedData: TUserEntity = {
        ...userEntity,
        preferences: {
          ...userEntity.preferences,
          ...preferencesEntity,
        },
      };

      return UserModel.fromEntity(combinedData);
    };

    if (options?.suspense) {
      return useSuspenseQuery({
        queryKey: userKeys.profile(userId),
        queryFn,
        staleTime: 15 * 60 * 1000, // 15 minutos
      });
    }

    return useQuery({
      queryKey: userKeys.profile(userId),
      queryFn,
      enabled: (options?.enabled ?? true) && !!userId,
      staleTime: 15 * 60 * 1000, // 15 minutos
    });
  };

  /**
   * Atualiza dados do usuário
   * Atualiza automaticamente o cache
   */
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async ({
        userId,
        data,
      }: {
        userId: string;
        data: TUpdateUserEntity;
      }): Promise<TProcessedUser> => {
        // Separar dados de usuário e preferências
        const { preferences, ...userData } = data;

        // Atualizar em paralelo se necessário
        const promises: Promise<any>[] = [];

        if (Object.keys(userData).length > 0) {
          promises.push(updateUserGateway(userId, userData));
        }

        if (preferences) {
          promises.push(updateUserPreferencesGateway(userId, preferences));
        }

        await Promise.all(promises);

        // Buscar dados atualizados
        const [userEntity, preferencesEntity] = await Promise.all([
          findOneUserGateway(userId),
          findUserPreferencesGateway(userId),
        ]);

        const combinedData: TUserEntity = {
          ...userEntity,
          preferences: {
            ...userEntity.preferences,
            ...preferencesEntity,
          },
        };

        return UserModel.fromEntity(combinedData);
      },
      onSuccess: (updatedUser, { userId }) => {
        // Atualizar cache
        queryClient.setQueryData(
          userKeys.profile(userId),
          updatedUser
        );
      },
    });
  };

  return {
    // Queries
    useFindUserProfile,
    
    // Mutations
    useUpdateProfile,
    
    // Query Keys
    keys: userKeys,
  };
};
```

---

## 📄 Exemplo `strategy.repository.spec.ts`

```ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStrategyRepository, strategyKeys } from './strategy.repository';
import { StrategyModel } from '@/models/strategy.model';
import * as strategiesGateway from '@/gateways/find-many-strategies.gateway';
import * as strategyGateway from '@/gateways/find-one-strategy.gateway';
import * as createGateway from '@/gateways/create-strategy.gateway';

// Mocks
jest.mock('@/gateways/find-many-strategies.gateway');
jest.mock('@/gateways/find-one-strategy.gateway');
jest.mock('@/gateways/create-strategy.gateway');
jest.mock('@/models/strategy.model');

const mockStrategiesGateway = strategiesGateway as jest.Mocked<typeof strategiesGateway>;
const mockStrategyGateway = strategyGateway as jest.Mocked<typeof strategyGateway>;
const mockCreateGateway = createGateway as jest.Mocked<typeof createGateway>;
const mockStrategyModel = StrategyModel as jest.Mocked<typeof StrategyModel>;

// Test wrapper com QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useStrategyRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useFindMany', () => {
    it('deve buscar e processar múltiplas estratégias', async () => {
      const mockEntities = [
        { id: '1', name: 'Strategy 1' },
        { id: '2', name: 'Strategy 2' },
      ];
      const mockProcessed = [
        { id: '1', name: 'Strategy 1', processed: true },
        { id: '2', name: 'Strategy 2', processed: true },
      ];

      mockStrategiesGateway.findManyStrategiesGateway.mockResolvedValue({
        data: mockEntities,
        pagination: { current_page: 1, total_pages: 1, total_items: 2, per_page: 20, has_next: false, has_previous: false },
      });
      mockStrategyModel.fromEntities.mockReturnValue(mockProcessed);

      const wrapper = createWrapper();
      const { result } = renderHook(() => {
        const repository = useStrategyRepository();
        return repository.useFindMany();
      }, { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockStrategiesGateway.findManyStrategiesGateway).toHaveBeenCalledWith(undefined);
      expect(mockStrategyModel.fromEntities).toHaveBeenCalledWith(mockEntities);
      expect(result.current.data).toEqual(mockProcessed);
    });

    it('deve aplicar filtros corretamente', async () => {
      const filters = { risk_level: 'low' as const, is_active: true };
      
      mockStrategiesGateway.findManyStrategiesGateway.mockResolvedValue({
        data: [],
        pagination: { current_page: 1, total_pages: 1, total_items: 0, per_page: 20, has_next: false, has_previous: false },
      });
      mockStrategyModel.fromEntities.mockReturnValue([]);

      const wrapper = createWrapper();
      const { result } = renderHook(() => {
        const repository = useStrategyRepository();
        return repository.useFindMany(filters);
      }, { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockStrategiesGateway.findManyStrategiesGateway).toHaveBeenCalledWith(filters);
    });

    it('deve usar query key correta', () => {
      const filters = { risk_level: 'low' as const };
      const expectedKey = strategyKeys.list(filters);
      
      expect(expectedKey).toEqual(['strategy', 'list', filters]);
    });
  });

  describe('useFindOne', () => {
    it('deve buscar uma estratégia específica', async () => {
      const mockEntity = { id: '1', name: 'Strategy 1' };
      const mockProcessed = { id: '1', name: 'Strategy 1', processed: true };

      mockStrategyGateway.findOneStrategyGateway.mockResolvedValue(mockEntity);
      mockStrategyModel.fromEntity.mockReturnValue(mockProcessed);

      const wrapper = createWrapper();
      const { result } = renderHook(() => {
        const repository = useStrategyRepository();
        return repository.useFindOne('1');
      }, { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockStrategyGateway.findOneStrategyGateway).toHaveBeenCalledWith('1');
      expect(mockStrategyModel.fromEntity).toHaveBeenCalledWith(mockEntity);
      expect(result.current.data).toEqual(mockProcessed);
    });

    it('deve usar query key correta', () => {
      const id = '1';
      const expectedKey = strategyKeys.detail(id);
      
      expect(expectedKey).toEqual(['strategy', 'detail', id]);
    });
  });

  describe('useCreate', () => {
    it('deve criar uma nova estratégia', async () => {
      const createData = { name: 'New Strategy', risk_level: 'low' as const };
      const mockEntity = { id: '1', ...createData };
      const mockProcessed = { id: '1', name: 'New Strategy', processed: true };

      mockStrategyModel.validate.mockReturnValue({ isValid: true, errors: [] });
      mockCreateGateway.createStrategyGateway.mockResolvedValue(mockEntity);
      mockStrategyModel.fromEntity.mockReturnValue(mockProcessed);

      const wrapper = createWrapper();
      const { result } = renderHook(() => {
        const repository = useStrategyRepository();
        return repository.useCreate();
      }, { wrapper });

      await waitFor(() => {
        result.current.mutate(createData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockStrategyModel.validate).toHaveBeenCalled();
      expect(mockCreateGateway.createStrategyGateway).toHaveBeenCalledWith(createData);
      expect(mockStrategyModel.fromEntity).toHaveBeenCalledWith(mockEntity);
      expect(result.current.data).toEqual(mockProcessed);
    });

    it('deve rejeitar dados inválidos', async () => {
      const createData = { name: '', risk_level: 'low' as const };
      
      mockStrategyModel.validate.mockReturnValue({ 
        isValid: false, 
        errors: ['Nome é obrigatório'] 
      });

      const wrapper = createWrapper();
      const { result } = renderHook(() => {
        const repository = useStrategyRepository();
        return repository.useCreate();
      }, { wrapper });

      await waitFor(() => {
        result.current.mutate(createData);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain('Dados inválidos');
      expect(mockCreateGateway.createStrategyGateway).not.toHaveBeenCalled();
    });
  });

  describe('Query Keys', () => {
    it('deve gerar query keys hierárquicas corretamente', () => {
      expect(strategyKeys.all).toEqual(['strategy']);
      expect(strategyKeys.lists()).toEqual(['strategy', 'list']);
      expect(strategyKeys.list({ risk_level: 'low' })).toEqual(['strategy', 'list', { risk_level: 'low' }]);
      expect(strategyKeys.details()).toEqual(['strategy', 'detail']);
      expect(strategyKeys.detail('1')).toEqual(['strategy', 'detail', '1']);
      expect(strategyKeys.stats()).toEqual(['strategy', 'stats']);
      expect(strategyKeys.portfolioStats(['1', '2'])).toEqual(['strategy', 'stats', 'portfolio', ['1', '2']]);
    });
  });
});
```

---

## 🔧 CLI Khaos

```bash
khaos create repository
khaos update repository
khaos check repository
khaos delete repository
```

---

## ✨ Criar Repository

1. **Informar o propósito**: Descrever qual domínio o repository irá gerenciar
2. **Nome do repository**: Nome da entidade (SEM prefixo de verbo)
3. **Selecionar gateways**: Quais gateways serão orquestrados
4. **Definir operações**: Operações específicas além do CRUD básico
5. **Configurar React Query**: Estratégias de cache e invalidação

6. **Estrutura sugerida**:
   ```text
   src/repositories/
   ├── strategy.repository.ts
   ├── strategy.repository.spec.ts
   ├── user.repository.ts
   ├── user.repository.spec.ts
   └── transaction.repository.ts
   ```

7. **Commit automático**:
   ```bash
   ✨ feat(repository): estrutura base de `strategy` com React Query (wip)
   ```

---

## ♻️ Atualizar Repository

```bash
♻️ refactor(repository): migrar `strategy` para React Query
```

---

## ✅ Validar Repository

```bash
khaos check repository
```

```text
Check dos Repositories:
- strategy: ✅ Válido (React Query ✅)
- user: ❌ Erro: Não usa React Query
- transaction: ⚠️ Aviso: Query keys não seguem padrão hierárquico
Resumo: 1/3 repositories válidos
```

---

##
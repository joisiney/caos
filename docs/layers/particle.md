# ⚛️ Particles

Particles são **serviços, constantes e contextos compartilháveis** entre features. Eles representam elementos transversais da aplicação que podem ser reutilizados por múltiplas camadas, fornecendo funcionalidades como gerenciamento de estado global, utilitários específicos do domínio e providers de contexto.

> ❗️Particles devem ser **stateless** quando possível, ou gerenciar estado através de contextos bem definidos. Não devem conter elementos gráficos no contexto, apenas providers.

---

## 🔹 Estrutura `src/particles/{name}`

* **Sufixo**: `.particle.tsx`
* **Exemplo**: `scroll-button.particle.tsx` com `ScrollButtonParticle`
* **Arquivos permitidos**:
  * `index.ts`
  * `{name}.particle.tsx`
  * `{name}.type.ts`
  * `{name}.context.tsx` // Opcional
  * `{name}.constant.ts` // Opcional
  * `{name}.mock.ts` // Opcional
  * `{name}.stories.tsx`
  * `{name}.spec.ts`
  * `_services/{service-name}.service.ts` // Se necessário

> ✅ Todos os tipos devem estar agrupados na `namespace` no arquivo `.type.ts`

---

## 📄 Exemplo `index.ts`

```ts
export * from './scroll-button.particle';
export * from './scroll-button.type';
export * from './scroll-button.context'; // Opcional
export * from './scroll-button.constant'; // Opcional
export * from './scroll-button.mock'; // Opcional
```

> ❌ Nunca exportar `stories.tsx`, `spec.ts` ou arquivos da pasta `_services`

---

## 📄 Exemplo `scroll-button.type.ts`

```ts
import type { ReactNode } from 'react';

export namespace NScrollButtonParticle {
  export type Props = TWithTestID & {
    threshold?: number;
    position?: Position;
    behavior?: ScrollBehavior;
    onScroll?: (isVisible: boolean) => void;
  };

  export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  export type ScrollBehavior = 'smooth' | 'instant';

  export type ContextValue = {
    isVisible: boolean;
    scrollToTop: () => void;
    scrollToBottom: () => void;
    currentPosition: number;
    threshold: number;
  };

  export type ProviderProps = {
    children: ReactNode;
    threshold?: number;
    behavior?: ScrollBehavior;
  };

  export type ScrollState = {
    position: number;
    isScrolling: boolean;
    direction: 'up' | 'down' | null;
    velocity: number;
  };
}
```

---

## 📄 Exemplo `scroll-button.constant.ts` // Opcional

```ts
export const SCROLL_POSITIONS = {
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
} as const;

export const SCROLL_BEHAVIORS = {
  SMOOTH: 'smooth',
  INSTANT: 'instant',
} as const;

export const DEFAULT_THRESHOLD = 200;

export const SCROLL_BUTTON_STYLES = {
  [SCROLL_POSITIONS.BOTTOM_RIGHT]: 'absolute bottom-4 right-4',
  [SCROLL_POSITIONS.BOTTOM_LEFT]: 'absolute bottom-4 left-4',
  [SCROLL_POSITIONS.TOP_RIGHT]: 'absolute top-4 right-4',
  [SCROLL_POSITIONS.TOP_LEFT]: 'absolute top-4 left-4',
} as const;

export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 100;
```

---

## 📄 Exemplo `scroll-button.context.tsx` // Opcional

```tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useScrollService } from './_services/scroll.service';
import { NScrollButtonParticle } from './scroll-button.type';
import { DEFAULT_THRESHOLD } from './scroll-button.constant';

const ScrollButtonContext = createContext<NScrollButtonParticle.ContextValue | null>(null);

export const ScrollButtonProvider: React.FC<NScrollButtonParticle.ProviderProps> = ({
  children,
  threshold = DEFAULT_THRESHOLD,
  behavior = 'smooth',
}) => {
  const scrollService = useScrollService({ behavior });
  const [isVisible, setIsVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Monitorar posição do scroll
  useEffect(() => {
    const handleScroll = () => {
      const position = scrollService.getCurrentPosition();
      setCurrentPosition(position);
      setIsVisible(position > threshold);
    };

    const unsubscribe = scrollService.subscribe(handleScroll);
    return unsubscribe;
  }, [scrollService, threshold]);

  const scrollToTop = useCallback(() => {
    scrollService.scrollToTop();
  }, [scrollService]);

  const scrollToBottom = useCallback(() => {
    scrollService.scrollToBottom();
  }, [scrollService]);

  const contextValue: NScrollButtonParticle.ContextValue = {
    isVisible,
    scrollToTop,
    scrollToBottom,
    currentPosition,
    threshold,
  };

  return (
    <ScrollButtonContext.Provider value={contextValue}>
      {children}
    </ScrollButtonContext.Provider>
  );
};

export const useScrollButtonContext = (): NScrollButtonParticle.ContextValue => {
  const context = useContext(ScrollButtonContext);
  if (!context) {
    throw new Error('useScrollButtonContext must be used within ScrollButtonProvider');
  }
  return context;
};
```

---

## 📄 Exemplo `scroll-button.particle.tsx`

```tsx
import { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useScrollButtonContext } from './scroll-button.context';
import { NScrollButtonParticle } from './scroll-button.type';
import { SCROLL_BUTTON_STYLES } from './scroll-button.constant';
import { ChevronUpAtom } from '@/atoms/chevron-up';

export const ScrollButtonParticle: FC<NScrollButtonParticle.Props> = ({
  testID,
  position = 'bottom-right',
  onScroll,
}) => {
  const { isVisible, scrollToTop } = useScrollButtonContext();

  // Notificar mudanças de visibilidade
  React.useEffect(() => {
    onScroll?.(isVisible);
  }, [isVisible, onScroll]);

  if (!isVisible) {
    return null;
  }

  const positionStyles = SCROLL_BUTTON_STYLES[position];

  return (
    <TouchableOpacity
      testID={`${testID}-particle`}
      onPress={scrollToTop}
      className={`${positionStyles} w-12 h-12 bg-blue-500 rounded-full shadow-lg justify-center items-center`}
      activeOpacity={0.8}
    >
      <ChevronUpAtom testID="scroll-icon" color="white" size={20} />
    </TouchableOpacity>
  );
};
```

---

## 📄 Exemplo `_services/scroll.service.ts`

```ts
import { useCallback, useRef, useEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { NScrollButtonParticle } from '../scroll-button.type';
import { DEBOUNCE_DELAY, ANIMATION_DURATION } from '../scroll-button.constant';

interface UseScrollServiceProps {
  behavior?: NScrollButtonParticle.ScrollBehavior;
}

export const useScrollService = ({ behavior = 'smooth' }: UseScrollServiceProps = {}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const listenersRef = useRef<Set<() => void>>(new Set());
  const scrollStateRef = useRef<NScrollButtonParticle.ScrollState>({
    position: 0,
    isScrolling: false,
    direction: null,
    velocity: 0,
  });

  // Debounced scroll handler
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const notifyListeners = useCallback(() => {
    listenersRef.current.forEach(listener => listener());
  }, []);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset } = event.nativeEvent;
    const newPosition = contentOffset.y;
    const oldPosition = scrollStateRef.current.position;

    // Calcular direção e velocidade
    const direction = newPosition > oldPosition ? 'down' : newPosition < oldPosition ? 'up' : null;
    const velocity = Math.abs(newPosition - oldPosition);

    scrollStateRef.current = {
      position: newPosition,
      isScrolling: true,
      direction,
      velocity,
    };

    // Debounce para detectar fim do scroll
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      scrollStateRef.current.isScrolling = false;
      notifyListeners();
    }, DEBOUNCE_DELAY);

    notifyListeners();
  }, [notifyListeners]);

  const getCurrentPosition = useCallback(() => {
    return scrollStateRef.current.position;
  }, []);

  const getScrollState = useCallback(() => {
    return { ...scrollStateRef.current };
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 0,
        animated: behavior === 'smooth',
      });
    }
  }, [behavior]);

  const scrollToBottom = useCallback(() => {
    if (scrollViewRef.current) {
      const { height } = Dimensions.get('window');
      scrollViewRef.current.scrollToEnd({
        animated: behavior === 'smooth',
      });
    }
  }, [behavior]);

  const scrollToPosition = useCallback((position: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: position,
        animated: behavior === 'smooth',
      });
    }
  }, [behavior]);

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollViewRef,
    handleScroll,
    getCurrentPosition,
    getScrollState,
    scrollToTop,
    scrollToBottom,
    scrollToPosition,
    subscribe,
  };
};
```

---

## 📄 Exemplo `scroll-button.mock.ts` // Opcional

```ts
import { faker } from '@faker-js/faker';
import type { NScrollButtonParticle } from './scroll-button.type';

export const mockScrollButtonProps = (
  override?: Partial<NScrollButtonParticle.Props>
): NScrollButtonParticle.Props => ({
  testID: 'scroll-button-particle',
  threshold: faker.number.int({ min: 100, max: 500 }),
  position: faker.helpers.arrayElement(['bottom-right', 'bottom-left', 'top-right', 'top-left']),
  behavior: faker.helpers.arrayElement(['smooth', 'instant']),
  onScroll: jest.fn(),
  ...override,
});

export const mockContextValue = (
  override?: Partial<NScrollButtonParticle.ContextValue>
): NScrollButtonParticle.ContextValue => ({
  isVisible: faker.datatype.boolean(),
  scrollToTop: jest.fn(),
  scrollToBottom: jest.fn(),
  currentPosition: faker.number.int({ min: 0, max: 1000 }),
  threshold: faker.number.int({ min: 100, max: 500 }),
  ...override,
});

export const mockScrollState = (
  override?: Partial<NScrollButtonParticle.ScrollState>
): NScrollButtonParticle.ScrollState => ({
  position: faker.number.int({ min: 0, max: 1000 }),
  isScrolling: faker.datatype.boolean(),
  direction: faker.helpers.arrayElement(['up', 'down', null]),
  velocity: faker.number.int({ min: 0, max: 100 }),
  ...override,
});

export const mockProviderProps = (
  override?: Partial<NScrollButtonParticle.ProviderProps>
): NScrollButtonParticle.ProviderProps => ({
  children: null,
  threshold: faker.number.int({ min: 100, max: 500 }),
  behavior: faker.helpers.arrayElement(['smooth', 'instant']),
  ...override,
});
```

---

## 📄 Exemplo `scroll-button.stories.tsx`

```tsx
import { Meta, StoryObj } from '@storybook/react';
import { ScrollButtonParticle } from './scroll-button.particle';
import { ScrollButtonProvider } from './scroll-button.context';
import { mockScrollButtonProps } from './scroll-button.mock';
import { View, Text, ScrollView } from 'react-native';

const meta: Meta = {
  title: 'Particles/ScrollButton',
  component: ScrollButtonParticle,
  decorators: [
    (Story) => (
      <ScrollButtonProvider threshold={200}>
        <View style={{ flex: 1, height: 400 }}>
          <ScrollView style={{ flex: 1 }}>
            {Array.from({ length: 50 }, (_, i) => (
              <View key={i} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text>Item {i + 1}</Text>
              </View>
            ))}
          </ScrollView>
          <Story />
        </View>
      </ScrollButtonProvider>
    ),
  ],
};

export default meta;

export const Default: StoryObj = {
  args: mockScrollButtonProps(),
};

export const BottomLeft: StoryObj = {
  args: mockScrollButtonProps({
    position: 'bottom-left',
  }),
};

export const TopRight: StoryObj = {
  args: mockScrollButtonProps({
    position: 'top-right',
  }),
};

export const WithCallback: StoryObj = {
  args: mockScrollButtonProps({
    onScroll: (isVisible) => console.log('Scroll button visible:', isVisible),
  }),
};

export const CustomThreshold: StoryObj = {
  args: mockScrollButtonProps({
    threshold: 100,
  }),
  decorators: [
    (Story) => (
      <ScrollButtonProvider threshold={100}>
        <Story />
      </ScrollButtonProvider>
    ),
  ],
};
```

---

## 📄 Exemplo `scroll-button.spec.ts`

```ts
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ScrollButtonParticle } from './scroll-button.particle';
import { ScrollButtonProvider } from './scroll-button.context';
import { Default } from './scroll-button.stories';

const HocMount = (props?: Partial<React.ComponentProps<typeof ScrollButtonParticle>>): JSX.Element => {
  return (
    <ScrollButtonProvider threshold={200}>
      <ScrollButtonParticle testID="scroll-button-particle" {...Default.args} {...props} />
    </ScrollButtonProvider>
  );
};

// Mock do contexto para testes
const mockContextValue = {
  isVisible: true,
  scrollToTop: jest.fn(),
  scrollToBottom: jest.fn(),
  currentPosition: 300,
  threshold: 200,
};

jest.mock('./scroll-button.context', () => ({
  ...jest.requireActual('./scroll-button.context'),
  useScrollButtonContext: () => mockContextValue,
}));

describe('Particle: <ScrollButtonParticle />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente quando visível', () => {
    render(<HocMount />);
    const sut = screen.getByTestId('scroll-button-particle');
    expect(sut).toBeTruthy();
  });

  it('não deve renderizar quando não visível', () => {
    mockContextValue.isVisible = false;
    render(<HocMount />);
    const sut = screen.queryByTestId('scroll-button-particle');
    expect(sut).toBeNull();
  });

  it('deve chamar scrollToTop quando pressionado', () => {
    mockContextValue.isVisible = true;
    render(<HocMount />);
    
    const button = screen.getByTestId('scroll-button-particle');
    fireEvent.press(button);
    
    expect(mockContextValue.scrollToTop).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onScroll quando visibilidade muda', () => {
    const mockOnScroll = jest.fn();
    render(<HocMount onScroll={mockOnScroll} />);
    
    expect(mockOnScroll).toHaveBeenCalledWith(true);
  });

  it('deve aplicar estilos de posição corretos', () => {
    render(<HocMount position="bottom-left" />);
    const button = screen.getByTestId('scroll-button-particle');
    
    // Verificar se as classes CSS corretas foram aplicadas
    expect(button.props.className).toContain('bottom-4 left-4');
  });

  it('não deve renderizar se testID for omitido', () => {
    render(<HocMount testID={undefined} />);
    const sut = screen.queryByTestId('scroll-button-particle');
    expect(sut).toBeNull();
  });
});

describe('ScrollButtonProvider', () => {
  it('deve fornecer contexto correto', () => {
    const TestComponent = () => {
      const context = useScrollButtonContext();
      return <Text testID="context-test">{context.threshold}</Text>;
    };

    render(
      <ScrollButtonProvider threshold={300}>
        <TestComponent />
      </ScrollButtonProvider>
    );

    const text = screen.getByTestId('context-test');
    expect(text.props.children).toBe(300);
  });

  it('deve lançar erro quando usado fora do provider', () => {
    const TestComponent = () => {
      useScrollButtonContext();
      return <Text>Test</Text>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useScrollButtonContext must be used within ScrollButtonProvider'
    );
  });
});
```

---

## 🔧 CLI Khaos

```bash
khaos create particle
khaos update particle
khaos check particle
khaos delete particle
```

---

## ✨ Criar Particle

1. **Informar o propósito**: Descrever a funcionalidade compartilhável
2. **Nome do particle**: Nome que representa a funcionalidade
3. **Tipo de particle**:
   * **Context Provider**: Para gerenciamento de estado global
   * **Service Wrapper**: Para encapsular lógica reutilizável
   * **Utility Component**: Para funcionalidades transversais
4. **Selecionar camadas opcionais**:
   * `.context.tsx` // Para providers
   * `.constant.ts` // Para constantes compartilhadas
   * `.mock.ts` com `Props` e `ContextValue` // Opcional
   * `.stories.tsx` obrigatório se houver mock

5. **Estrutura sugerida**:
   ```text
   src/particles/
   ├── scroll-button/
   │   ├── index.ts
   │   ├── scroll-button.particle.tsx
   │   ├── scroll-button.type.ts
   │   ├── scroll-button.context.tsx // Opcional
   │   ├── scroll-button.constant.ts // Opcional
   │   ├── scroll-button.mock.ts // Opcional
   │   ├── scroll-button.stories.tsx
   │   ├── scroll-button.spec.ts
   │   └── _services/
   │       └── scroll.service.ts
   ```

6. **Commit automático**:
   ```bash
   ✨ feat(particle): estrutura base de `scroll-button` (wip)
   ```

---

## ♻️ Atualizar Particle

```bash
♻️ refactor(particle): renomear `scroll-button` para `scroll-to-top`
```

---

## ✅ Validar Particle

```bash
khaos check particle
```

```text
Check dos Particles:
- scroll-button: ✅ Válido
- theme-provider: ❌ Erro: Context contém elementos gráficos
- analytics: ⚠️ Aviso: Service muito complexo, considere dividir
Resumo: 1/3 particles válidos
```

---

## 🗑️ Remover Particle

```bash
🗑️ chore(particle): remover particle `scroll-button`
```

---

## 📋 Tipos de Particles

### 🔄 Context Providers
Gerenciam estado global ou compartilhado:

```tsx
// theme.particle.tsx
export const ThemeParticle: FC<Props> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};
```

### 🛠️ Service Wrappers
Encapsulam lógica reutilizável:

```tsx
// analytics.particle.tsx
export const AnalyticsParticle: FC<Props> = ({ children }) => {
  const analytics = useAnalyticsService();
  
  useEffect(() => {
    analytics.initialize();
  }, []);

  return <>{children}</>;
};
```

### 🎯 Utility Components
Funcionalidades transversais:

```tsx
// error-boundary.particle.tsx
export const ErrorBoundaryParticle: FC<Props> = ({ children, fallback }) => {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};
```

---

## 📋 Responsabilidades dos Particles

### ✅ O que Particles DEVEM fazer:
- **Fornecer funcionalidades compartilháveis** entre features
- **Gerenciar estado global** através de contextos
- **Encapsular lógica transversal** da aplicação
- **Prover services reutilizáveis** para múltiplas camadas
- **Implementar providers** sem elementos visuais
- **Manter interface consistente** através de types bem definidos

### ❌ O que Particles NÃO devem fazer:
- **Conter elementos gráficos** no contexto (apenas providers)
- **Implementar lógica específica** de uma única feature
- **Fazer acoplamento direto** com componentes visuais
- **Gerenciar estado local** de componentes específicos
- **Duplicar funcionalidades** já existentes em utils

---

## 🔄 Relacionamento com Outras Camadas

### Uso em Features
```tsx
// wallet-deposit.feature.tsx
import { ScrollButtonParticle } from '@/particles/scroll-button';
import { ThemeParticle } from '@/particles/theme';

export const WalletDepositFeature: FC<Props> = ({ testID }) => {
  return (
    <ThemeParticle>
      <ScrollView>
        {/* Conteúdo da feature */}
      </ScrollView>
      <ScrollButtonParticle testID="scroll-button" />
    </ThemeParticle>
  );
};
```

### Uso em Layouts
```tsx
// wallet.layout.tsx
import { AnalyticsParticle } from '@/particles/analytics';

export const WalletLayout: FC<Props> = ({ children }) => {
  return (
    <AnalyticsParticle module="wallet">
      <View>
        {children}
      </View>
    </AnalyticsParticle>
  );
};
```

### Uso Global na App
```tsx
// App.tsx
import { ThemeParticle } from '@/particles/theme';
import { ErrorBoundaryParticle } from '@/particles/error-boundary';

export const App = () => {
  return (
    <ErrorBoundaryParticle>
      <ThemeParticle>
        <Router />
      </ThemeParticle>
    </ErrorBoundaryParticle>
  );
};
```

---

## 📚 Boas Práticas

### Context Design
- **Mantenha contextos focados** em uma responsabilidade
- **Use TypeScript rigoroso** para type safety
- **Implemente error boundaries** para contextos críticos
- **Documente dependências** entre contextos

### Performance
- **Use React.memo** em providers quando apropriado
- **Implemente lazy loading** para particles pesados
- **Otimize re-renders** com useMemo e useCallback
- **Monitore performance** de contextos globais

### Testing
- **Mock contextos** em testes unitários
- **Teste providers isoladamente**
- **Valide error handling** em contextos
- **Teste integração** com componentes consumidores

### Documentação
- **Documente APIs** de contextos e services
- **Forneça exemplos** de uso em stories
- **Mantenha changelog** de mudanças em particles
- **Documente dependências** e configurações

---

## 📚 Referências

* [Convenções Gerais](../general-conventions.md)
* [Validação Hermes](../validator.md)
* [Estrutura do Projeto](../project-structure.md)
* [Code Smells](../code-smells.md)
* [Utils](./util.md)
* [Features](./feature.md)

---

## ➡️ Próxima Camada

* [Models](./model.md)
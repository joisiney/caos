# 🧬 Khaos CLI

Intelligent CLI for Khaos Architecture - Automates creation, validation, and maintenance of code following rigorously the Khaos architecture.

## 🚀 Quick Start

### Installation

```bash
npm install
npm run build
npm link
```

### Basic Usage

```bash
# Show help
khaos --help

# Create components (Coming in Sprint 1)
khaos create atom button
khaos create molecule login-form
khaos create organism header

# Validate architecture (Coming in Sprint 1)
khaos validate
khaos validate --layer=atoms

# Analyze code quality (Coming in Sprint 2)
khaos analyze --smells
khaos analyze --metrics
```

## 🏗️ Project Structure

```
src/
├── core/                          # Core system
│   ├── ai/                        # AI integration
│   │   ├── providers/             # OpenAI, Anthropic, OpenRouter
│   │   ├── analyzers/             # Code analysis
│   │   └── generators/            # Code generation
│   ├── validators/                # Validation system
│   │   ├── layer-validators/      # Per-layer validators
│   │   └── convention-validators/ # Convention validators
│   ├── parsers/                   # Code parsing
│   └── utils/                     # Shared utilities
├── commands/                      # CLI commands
│   ├── create/                    # Creation commands
│   ├── validate/                  # Validation commands
│   ├── analyze/                   # Analysis commands
│   └── refactor/                  # Refactoring commands
├── templates/                     # Code templates
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   ├── features/
│   ├── layouts/
│   └── ...
├── schemas/                       # Validation schemas
└── config/                        # Configuration
```

## 🛠️ Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Setup development tools
npm run setup-dev

# Run in development mode
npm run dev

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Linting and formatting
npm run lint
npm run format
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# AI Providers
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key

# Configuration
KHAOS_MODE=development
KHAOS_LOG_LEVEL=info
```

## 📋 Roadmap

### ✅ Sprint 0: Foundation (Current)
- [x] Project structure setup
- [x] TypeScript configuration (strict mode)
- [x] Testing framework (Jest)
- [x] Linting and formatting (ESLint + Prettier)
- [x] Basic CLI structure
- [x] Core types and utilities
- [x] Template system foundation

### 🚧 Sprint 1: Validation System (Weeks 1-4)
- [ ] Architecture validator
- [ ] Layer-specific validators
- [ ] Validation schemas (Zod)
- [ ] TypeScript parser
- [ ] Validation commands
- [ ] Interactive prompts

### 📋 Sprint 2: AI Integration (Weeks 5-8)
- [ ] OpenAI/Anthropic/OpenRouter providers
- [ ] Layer classification
- [ ] Smart creation commands
- [ ] Code generation

### 📋 Sprint 3: Full Feature Set (Weeks 9-12)
- [ ] All 12 layers support
- [ ] Advanced templates
- [ ] Dependency resolution
- [ ] Analysis commands

### 📋 Sprint 4: Production Ready (Weeks 13-16)
- [ ] Refactoring assistance
- [ ] Git integration
- [ ] Performance optimization
- [ ] Documentation

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## 📚 Architecture

The Khaos CLI follows the same architectural principles it enforces:

- **Atoms**: Basic reusable utilities
- **Molecules**: Composed functionality (validators, parsers)
- **Organisms**: Complex systems (AI integration, command handlers)
- **Templates**: Code generation templates
- **Features**: Complete CLI commands
- **Layouts**: CLI structure and navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/khaos/cli/issues)
- **Roadmap**: [docs/ROADMAP_IMPLEMENTACAO.md](docs/ROADMAP_IMPLEMENTACAO.md)
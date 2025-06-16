"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAtom = createAtom;
const inquirer_1 = __importDefault(require("inquirer"));
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * Fluxo completo de criação de átomos baseado no atom.md
 * 5 Passos: Descrever → Nome → Selecionar → Visualizar → Confirmar
 */
async function createAtom() {
    console.log('🧬 Criando novo átomo Khaos...\n');
    try {
        // PASSO 1: Descrever o átomo
        const { description } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'description',
                message: '📝 Descreva o que você quer construir (ex: "um botão reutilizável"):',
                validate: (input) => input.trim().length > 0 || 'Descrição não pode ser vazia',
            },
        ]);
        // PASSO 2: Sugerir nome (IA simulada baseada no atom.md)
        const suggestedName = suggestAtomName(description);
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `✏️ Nome sugerido: ${suggestedName}. Aceitar ou modificar (Enter para aceitar):`,
                default: suggestedName,
                validate: (input) => validateAtomName(input),
            },
        ]);
        // PASSO 3: Selecionar arquivos opcionais (type.ts é obrigatório)
        const { relatedFiles } = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'relatedFiles',
                message: '🎯 Selecionar arquivos opcionais (type.ts é sempre criado):',
                choices: [
                    { name: `${name}.constant.ts`, value: 'constant', checked: false },
                    { name: `${name}.spec.ts`, value: 'spec', checked: false },
                ],
            },
        ]);
        // PASSO 4: Visualizar árvore de arquivos
        console.log('\n📁 Visualizar árvore de arquivos:');
        displayAtomTree(name, relatedFiles);
        // PASSO 5: Confirmar e commit
        const { confirm } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: '✅ Confirmar criação do átomo?',
                default: true,
            },
        ]);
        if (!confirm) {
            console.log('❌ Operação cancelada.');
            return;
        }
        // Gerar arquivos do átomo
        await generateAtomFiles(name, relatedFiles);
        console.log(`\n🎉 Átomo "${name}" criado com sucesso!`);
        console.log(`💡 Commit automático: feat: add ${name} atom`);
    }
    catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}
/**
 * IA simulada para sugerir nomes baseada em palavras-chave
 */
function suggestAtomName(description) {
    const cleanDesc = description.toLowerCase();
    const suggestions = {
        'botão': 'button',
        'button': 'button',
        'ícone': 'icon',
        'icon': 'icon',
        'texto': 'text',
        'text': 'text',
        'input': 'input',
        'campo': 'input',
        'imagem': 'image',
        'image': 'image',
        'divisor': 'divider',
        'linha': 'divider',
        'loading': 'spinner',
        'carregando': 'spinner',
        'badge': 'badge',
        'tag': 'tag',
    };
    for (const [keyword, suggestion] of Object.entries(suggestions)) {
        if (cleanDesc.includes(keyword)) {
            return suggestion;
        }
    }
    // Fallback: primeira palavra limpa em dash-case
    const firstWord = cleanDesc.split(' ')[0];
    return firstWord.replace(/[^a-z0-9]/g, '') || 'element';
}
/**
 * Valida nome do átomo (dash-case obrigatório)
 */
function validateAtomName(name) {
    if (!name || name.trim().length === 0) {
        return 'Nome não pode ser vazio';
    }
    const cleaned = name.trim().toLowerCase();
    if (!/^[a-z]+(-[a-z]+)*$/.test(cleaned)) {
        return 'Use dash-case: apenas letras minúsculas e hifens (ex: button, icon-button)';
    }
    if (cleaned.length < 2) {
        return 'Nome deve ter pelo menos 2 caracteres';
    }
    return true;
}
/**
 * Exibe a árvore de arquivos que será criada (baseado no atom.md)
 */
function displayAtomTree(name, relatedFiles) {
    console.log(`src/atoms/`);
    console.log(`├── ${name}/`);
    console.log(`│   ├── index.ts`);
    console.log(`│   ├── ${name}.atom.tsx`);
    // O último arquivo depende das opções selecionadas
    const hasConstant = relatedFiles.includes('constant');
    const hasSpec = relatedFiles.includes('spec');
    if (hasConstant && hasSpec) {
        console.log(`│   ├── ${name}.type.ts`);
        console.log(`│   ├── ${name}.constant.ts`);
        console.log(`│   └── ${name}.spec.ts`);
    }
    else if (hasConstant) {
        console.log(`│   ├── ${name}.type.ts`);
        console.log(`│   └── ${name}.constant.ts`);
    }
    else if (hasSpec) {
        console.log(`│   ├── ${name}.type.ts`);
        console.log(`│   └── ${name}.spec.ts`);
    }
    else {
        console.log(`│   └── ${name}.type.ts`);
    }
    console.log('');
}
/**
 * Gera todos os arquivos do átomo usando templates EJS
 */
async function generateAtomFiles(name, relatedFiles) {
    const atomDir = path_1.default.join(process.cwd(), 'src/atoms', name);
    const templateDir = path_1.default.join(__dirname, '../templates');
    // Variáveis para templates
    const nameCapitalized = toPascalCase(name);
    const NAME_CONSTANT = name.toUpperCase().replace(/-/g, '_');
    const templateVars = {
        name,
        nameCapitalized,
        NAME: NAME_CONSTANT,
        hasConstant: relatedFiles.includes('constant'),
        hasType: relatedFiles.includes('type'),
        hasSpec: relatedFiles.includes('spec')
    };
    // Criar diretório do átomo
    await fs_extra_1.default.ensureDir(atomDir);
    // Gerar arquivos obrigatórios
    await generateFromTemplate(templateDir, atomDir, 'atom-index.ejs', 'index.ts', templateVars);
    await generateFromTemplate(templateDir, atomDir, 'atom-atom.ejs', `${name}.atom.tsx`, templateVars);
    await generateFromTemplate(templateDir, atomDir, 'atom-type.ejs', `${name}.type.ts`, templateVars);
    // Arquivos opcionais
    if (relatedFiles.includes('constant')) {
        await generateFromTemplate(templateDir, atomDir, 'atom-constant.ejs', `${name}.constant.ts`, templateVars);
    }
    if (relatedFiles.includes('spec')) {
        await generateFromTemplate(templateDir, atomDir, 'atom-spec.ejs', `${name}.spec.ts`, templateVars);
    }
}
/**
 * Gera arquivo a partir de template EJS
 */
async function generateFromTemplate(templateDir, outputDir, templateName, fileName, variables) {
    const templatePath = path_1.default.join(templateDir, templateName);
    if (!await fs_extra_1.default.pathExists(templatePath)) {
        console.log(`⚠️ Template não encontrado: ${templatePath}`);
        return;
    }
    const content = await ejs_1.default.renderFile(templatePath, variables);
    const filePath = path_1.default.join(outputDir, fileName);
    await fs_extra_1.default.writeFile(filePath, content);
    console.log(`✅ Criado: ${path_1.default.relative(process.cwd(), filePath)}`);
}
/**
 * Converte string para PascalCase
 */
function toPascalCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

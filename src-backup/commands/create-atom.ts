import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';

/**
 * Fluxo completo de criação de átomos baseado no atom.md
 * 5 Passos: Descrever → Nome → Selecionar → Visualizar → Confirmar
 */
export async function createAtom() {
  console.log('🧬 Criando novo átomo Khaos...\n');

  try {
    // PASSO 1: Descrever o átomo
    const { description } = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: '📝 Descreva o que você quer construir (ex: "um botão reutilizável"):',
        validate: (input: string) => input.trim().length > 0 || 'Descrição não pode ser vazia',
      },
    ]);

    // PASSO 2: Sugerir nome (IA simulada baseada no atom.md)
    const suggestedName = suggestAtomName(description);

    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `✏️ Nome sugerido: ${suggestedName}. Aceitar ou modificar (Enter para aceitar):`,
        default: suggestedName,
        validate: (input: string) => validateAtomName(input),
      },
    ]);

    // PASSO 3: Selecionar arquivos opcionais (type.ts é obrigatório)
    const { relatedFiles } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'relatedFiles',
        message: '🎯 Selecionar arquivos opcionais (type.ts é sempre criado):',
        choices: [
          { name: `${name}.constant.ts`, value: 'constant', checked: false },
          { name: `${name}.spec.tsx`, value: 'spec', checked: false },
        ],
      },
    ]);

    // PASSO 4: Visualizar árvore de arquivos
    console.log('\n📁 Visualizar árvore de arquivos:');
    displayAtomTree(name, relatedFiles);

    // PASSO 5: Confirmar e commit
    const { confirm } = await inquirer.prompt([
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

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

/**
 * IA simulada para sugerir nomes baseada em palavras-chave
 */
function suggestAtomName(description: string): string {
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
function validateAtomName(name: string): boolean | string {
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
function displayAtomTree(name: string, relatedFiles: string[]) {
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
    console.log(`│   └── ${name}.spec.tsx`);
  } else if (hasConstant) {
    console.log(`│   ├── ${name}.type.ts`);
    console.log(`│   └── ${name}.constant.ts`);
  } else if (hasSpec) {
    console.log(`│   ├── ${name}.type.ts`);
    console.log(`│   └── ${name}.spec.tsx`);
  } else {
    console.log(`│   └── ${name}.type.ts`);
  }
  
  console.log('');
}

/**
 * Gera todos os arquivos do átomo usando templates EJS
 */
async function generateAtomFiles(name: string, relatedFiles: string[]) {
  const atomDir = path.join(process.cwd(), 'src/atoms', name);
  const templateDir = path.join(__dirname, '../templates');
  console.log('atomDir', atomDir);
  console.log('templateDir', templateDir);
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
  await fs.ensureDir(atomDir);

  // Gerar arquivos obrigatórios
  await generateFromTemplate(templateDir, atomDir, 'atom-index.ejs', 'index.ts', templateVars);
  await generateFromTemplate(templateDir, atomDir, 'atom-atom.ejs', `${name}.atom.tsx`, templateVars);
  await generateFromTemplate(templateDir, atomDir, 'atom-type.ejs', `${name}.type.ts`, templateVars);

  // Arquivos opcionais
  if (relatedFiles.includes('constant')) {
    await generateFromTemplate(templateDir, atomDir, 'atom-constant.ejs', `${name}.constant.ts`, templateVars);
  }
  
  if (relatedFiles.includes('spec')) {
    await generateFromTemplate(templateDir, atomDir, 'atom-spec.ejs', `${name}.spec.tsx`, templateVars);
  }
}

/**
 * Gera arquivo a partir de template EJS
 */
async function generateFromTemplate(
  templateDir: string,
  outputDir: string,
  templateName: string,
  fileName: string,
  variables: any
) {
  const templatePath = path.join(templateDir, templateName);
  
  if (!await fs.pathExists(templatePath)) {
    console.log(`⚠️ Template não encontrado: ${templatePath}`);
    return;
  }

  const content = await ejs.renderFile(templatePath, variables);
  const filePath = path.join(outputDir, fileName);
  
  await fs.writeFile(filePath, content as string);
  console.log(`✅ Criado: ${path.relative(process.cwd(), filePath)}`);
}

/**
 * Converte string para PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
} 
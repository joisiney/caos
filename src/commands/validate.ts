import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { loadConfig } from '../utils/config';

interface ValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
}

export function setupValidateCommand(program: Command) {
  program
    .command('validate')
    .description('Valida a estrutura do projeto e convenções Khaos')
    .option('--fix', 'Tenta corrigir problemas automaticamente')
    .action(async (options) => {
      console.log('🔍 Validando projeto Khaos...\n');

      const config = await loadConfig();
      const results: ValidationResult[] = [];

      // Validar estrutura de diretórios
      await validateDirectoryStructure(config, results);
      
      // Validar arquivos de repositório
      await validateRepositories(config, results);
      
      // Validar naming conventions
      await validateNamingConventions(config, results);
      
      // Validar imports
      await validateImports(config, results);

      // Exibir resultados
      displayResults(results);

      if (options.fix) {
        await fixIssues(results);
      }
    });
}

async function validateDirectoryStructure(config: any, results: ValidationResult[]) {
  const requiredDirs = Object.values(config.directories) as string[];
  
  for (const dir of requiredDirs) {
    if (!await fs.pathExists(dir)) {
      results.push({
        type: 'error',
        message: `Diretório obrigatório não encontrado: ${dir}`,
      });
    }
  }

  // Verificar se existe tsconfig.json
  if (!await fs.pathExists('tsconfig.json')) {
    results.push({
      type: 'warning',
      message: 'tsconfig.json não encontrado. Execute "tartarus init" para criar.',
    });
  }

  // Verificar configuração de paths no tsconfig
  try {
    const tsconfig = await fs.readJson('tsconfig.json');
    if (!tsconfig.compilerOptions?.paths?.['@/*']) {
      results.push({
        type: 'warning',
        message: 'Path alias "@/*" não configurado no tsconfig.json',
      });
    }
  } catch {
    // tsconfig não existe ou é inválido
  }
}

async function validateRepositories(config: any, results: ValidationResult[]) {
  const repoDir = config.directories.repositories;
  
  if (!await fs.pathExists(repoDir)) return;

  const files = await fs.readdir(repoDir);
  const repoFiles = files.filter(f => f.endsWith('.repository.ts'));

  for (const file of repoFiles) {
    const filePath = path.join(repoDir, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Validar se o arquivo segue o padrão esperado
    const name = file.replace('.repository.ts', '');
    const expectedExport = `use${toPascalCase(name)}Repository`;

    if (!content.includes(expectedExport)) {
      results.push({
        type: 'error',
        message: `Repository ${file} deve exportar ${expectedExport}`,
        file: filePath,
      });
    }

    // Validar imports
    if (!content.includes('import') || !content.includes('gateway') || !content.includes('model')) {
      results.push({
        type: 'warning',
        message: `Repository ${file} pode estar incompleto (faltam imports de gateway/model)`,
        file: filePath,
      });
    }
  }
}

async function validateNamingConventions(config: any, results: ValidationResult[]) {
  const dirs = [
    config.directories.repositories,
    config.directories.gateways,
    config.directories.models,
    config.directories.entities,
  ];

  for (const dir of dirs) {
    if (!await fs.pathExists(dir)) continue;

    const files = await fs.readdir(dir);
    
    for (const file of files) {
      if (file === '.gitkeep') continue;

      // Validar kebab-case
      if (!/^[a-z0-9-]+\.(repository|gateway|model|entity)\.ts$/.test(file)) {
        results.push({
          type: 'error',
          message: `Arquivo ${file} não segue convenção kebab-case`,
          file: path.join(dir, file),
        });
      }

      // Validar se nome contém verbos (para repositórios)
      if (file.includes('.repository.ts')) {
        const name = file.replace('.repository.ts', '');
        const verbos = ['create', 'update', 'delete', 'get', 'find', 'list', 'search'];
        
        if (verbos.some(verbo => name.includes(verbo))) {
          results.push({
            type: 'warning',
            message: `Repository ${file} contém verbo no nome. Use substantivos.`,
            file: path.join(dir, file),
          });
        }
      }
    }
  }
}

async function validateImports(config: any, results: ValidationResult[]) {
  const dirs = [
    config.directories.repositories,
    config.directories.gateways,
    config.directories.models,
  ];

  for (const dir of dirs) {
    if (!await fs.pathExists(dir)) continue;

    const files = await fs.readdir(dir);
    
    for (const file of files) {
      if (file === '.gitkeep' || !file.endsWith('.ts')) continue;

      const filePath = path.join(dir, file);
      const content = await fs.readFile(filePath, 'utf-8');

      // Verificar se usa imports relativos em vez de path alias
      const relativeImports = content.match(/import.*from ['"]\.\.?\//g);
      if (relativeImports && relativeImports.length > 0) {
        results.push({
          type: 'warning',
          message: `Arquivo ${file} usa imports relativos. Prefira usar '@/*'`,
          file: filePath,
        });
      }
    }
  }
}

function displayResults(results: ValidationResult[]) {
  const errors = results.filter(r => r.type === 'error');
  const warnings = results.filter(r => r.type === 'warning');
  const infos = results.filter(r => r.type === 'info');

  console.log(`📊 Resultado da validação:`);
  console.log(`❌ Erros: ${errors.length}`);
  console.log(`⚠️  Avisos: ${warnings.length}`);
  console.log(`ℹ️  Infos: ${infos.length}\n`);

  if (errors.length > 0) {
    console.log('❌ ERROS:');
    errors.forEach(error => {
      console.log(`  • ${error.message}`);
      if (error.file) console.log(`    📁 ${error.file}`);
    });
    console.log();
  }

  if (warnings.length > 0) {
    console.log('⚠️  AVISOS:');
    warnings.forEach(warning => {
      console.log(`  • ${warning.message}`);
      if (warning.file) console.log(`    📁 ${warning.file}`);
    });
    console.log();
  }

  if (results.length === 0) {
    console.log('✅ Projeto está em conformidade com as convenções Khaos!');
  }
}

async function fixIssues(results: ValidationResult[]) {
  console.log('🔧 Tentando corrigir problemas...');
  
  // Por enquanto apenas sugestões
  console.log('💡 Execute "tartarus init" para criar estrutura básica');
  console.log('💡 Execute comandos create/update para manter consistência');
}

function toPascalCase(str: string): string {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
} 
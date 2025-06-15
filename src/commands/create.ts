import { Command } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';
import { loadConfig } from '../utils/config';
import { suggestName, sanitizeName, toPascalCase, createSpinner, isKhaosProject } from '../utils/helpers';

export function setupCreateCommand(program: Command) {
  program
    .command('create <layer>')
    .description('Cria arquivos para uma camada específica')
    .action(async (layer: string) => {
      if (layer !== 'repository') {
        console.log('❌ Camada não suportada. Use: repository');
        console.log('💡 Camadas futuras: component, feature, layout');
        return;
      }

      // Verificar se é um projeto Khaos
      if (!await isKhaosProject()) {
        console.log('⚠️  Este não parece ser um projeto Khaos.');
        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: 'Continuar mesmo assim?',
            default: false,
          },
        ]);

        if (!proceed) {
          console.log('💡 Execute "tartarus init" para inicializar um projeto Khaos.');
          return;
        }
      }

      const config = await loadConfig();

      // Passo 1: Perguntar descrição
      const { description } = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Descreva o que você quer construir:',
        },
      ]);

      // Passo 2: Sugerir nome usando IA simulada
      const suggestedName = suggestName(description);

      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `Nome sugerido: ${suggestedName}. Novo nome (Enter para aceitar):`,
          default: suggestedName,
          validate: (input: string) => {
            const result = sanitizeName(input);
            return result.isValid || result.error || 'Nome inválido';
          },
        },
      ]);

      // Passo 3: Sugerir camadas
      const { layers } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'layers',
          message: 'Selecione camadas relacionadas:',
          choices: [
            { name: 'gateway (find-one)', checked: true },
            { name: 'model', checked: true },
            { name: 'entity', checked: false },
          ],
        },
      ]);

      // Passo 4: Gerar arquivos
      const spinner = createSpinner('Gerando arquivos...');
      
      try {
        const files: string[] = [];
        const templateDir = path.join(__dirname, '../templates');
        const outputDir = process.cwd();
        const nameCapitalized = toPascalCase(name);

        // Repository
        const repoTemplate = await ejs.renderFile(
          path.join(templateDir, config.templates.repository),
          { name, nameCapitalized }
        );
        const repoPath = path.join(outputDir, config.directories.repositories, `${name}${config.naming.suffixes.repository}`);
        await fs.ensureDir(path.dirname(repoPath));
        await fs.writeFile(repoPath, repoTemplate);
        files.push(repoPath);

      // Gateway
      if (layers.includes('gateway (find-one)')) {
        const gatewayTemplate = await ejs.renderFile(
          path.join(templateDir, 'gateway.ts.ejs'),
          { name, nameCapitalized: name.split('-').map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)).join('') }
        );
        const gatewayPath = path.join(outputDir, 'src/gateways', `find-one-${name}.gateway.ts`);
        await fs.ensureDir(path.dirname(gatewayPath));
        await fs.writeFile(gatewayPath, gatewayTemplate);
        files.push(gatewayPath);
      }

      // Model
      if (layers.includes('model')) {
        const modelTemplate = await ejs.renderFile(
          path.join(templateDir, 'model.ts.ejs'),
          { name, nameCapitalized: name.split('-').map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)).join('') }
        );
        const modelPath = path.join(outputDir, 'src/models', `${name}.model.ts`);
        await fs.ensureDir(path.dirname(modelPath));
        await fs.writeFile(modelPath, modelTemplate);
        files.push(modelPath);
      }

      // Entity
      if (layers.includes('entity')) {
        const entityTemplate = await ejs.renderFile(
          path.join(templateDir, 'entity.ts.ejs'),
          { name, nameCapitalized: name.split('-').map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)).join('') }
        );
        const entityPath = path.join(outputDir, 'src/entities', `${name}.entity.ts`);
        await fs.ensureDir(path.dirname(entityPath));
        await fs.writeFile(entityPath, entityTemplate);
        files.push(entityPath);
      }

        spinner.stop('✅ Arquivos gerados com sucesso!');
        console.log('📁 Arquivos criados:', files.map(f => path.relative(outputDir, f)));

        // Passo 5: Sugerir commit
        if (config.git.autoCommit) {
          const { doCommit } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'doCommit',
              message: `Fazer commit? Mensagem: '${config.git.commitTemplate.replace('{name}', name).replace('{layer}', 'repository')}'`,
              default: true,
            },
          ]);

          if (doCommit) {
            const commitSpinner = createSpinner('Fazendo commit...');
            const git = simpleGit();
            try {
              await git.add(files);
              await git.commit(config.git.commitTemplate.replace('{name}', name).replace('{layer}', 'repository'));
              commitSpinner.stop('✅ Commit realizado com sucesso!');
            } catch (error: any) {
              commitSpinner.stop('❌ Erro ao fazer commit');
              console.log('Erro:', error.message);
            }
          }
        }
      } catch (error: any) {
        spinner.stop('❌ Erro ao gerar arquivos');
        console.error('Erro:', error.message);
        process.exit(1);
      }
    });
} 
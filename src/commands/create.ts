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
      const supportedLayers = ['repository', 'gateway', 'model', 'entity', 'component', 'feature', 'layout'];
      
      if (!supportedLayers.includes(layer)) {
        console.log('❌ Camada não suportada.');
        console.log(`💡 Camadas disponíveis: ${supportedLayers.join(', ')}`);
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

      // Passo 3: Sugerir camadas relacionadas (apenas para repository)
      let relatedLayers: string[] = [];
      
      if (layer === 'repository') {
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
        relatedLayers = layers;
      } else if (layer === 'feature') {
        const { includeRepository } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'includeRepository',
            message: 'Incluir repository relacionado?',
            default: true,
          },
        ]);
        if (includeRepository) {
          relatedLayers = ['repository', 'gateway', 'model', 'entity'];
        }
      }

              // Passo 4: Gerar arquivos
        const spinner = createSpinner('Gerando arquivos...');
        
        try {
          const files: string[] = [];
          const templateDir = path.join(__dirname, '../templates');
          const outputDir = process.cwd();
          const nameCapitalized = toPascalCase(name);

          // Função para gerar arquivo individual
          const generateFile = async (layerType: string, namePrefix: string = '') => {
            const templatePath = path.join(templateDir, (config.templates as any)[layerType]);
            const layerDir = (config.directories as any)[layerType + 's'] || (config.directories as any)[layerType];
            const suffix = (config.naming.suffixes as any)[layerType];
            
            if (!await fs.pathExists(templatePath)) {
              console.log(`⚠️ Template não encontrado para ${layerType}: ${templatePath}`);
              return;
            }

            const template = await ejs.renderFile(templatePath, { name, nameCapitalized });
            const fileName = namePrefix ? `${namePrefix}-${name}${suffix}` : `${name}${suffix}`;
            const filePath = path.join(outputDir, layerDir, fileName);
            
            await fs.ensureDir(path.dirname(filePath));
            await fs.writeFile(filePath, template);
            files.push(filePath);
          };

          // Gerar arquivo principal da camada
          await generateFile(layer);

          // Gerar arquivos relacionados
          if (relatedLayers.includes('gateway (find-one)')) {
            await generateFile('gateway', 'find-one');
          }
          if (relatedLayers.includes('model')) {
            await generateFile('model');
          }
          if (relatedLayers.includes('entity')) {
            await generateFile('entity');
          }
          if (relatedLayers.includes('repository')) {
            await generateFile('repository');
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
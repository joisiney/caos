import { Command } from 'commander';
import inquirer from 'inquirer';
import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';
import { simpleGit } from 'simple-git';

export function setupCreateCommand(program: Command) {
  program
    .command('create <layer>')
    .description('Cria arquivos para uma camada específica')
    .action(async (layer: string) => {
      if (layer !== 'repository') {
        console.log('Camada não suportada. Use: repository');
        return;
      }

      // Passo 1: Perguntar descrição
      const { description } = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Descreva o que você quer construir:',
        },
      ]);

      // Passo 2: Sugerir nome (simulado, IA seria usada aqui)
      let suggestedName = description
        .toLowerCase()
        .replace(/gerenciar|criar/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (!suggestedName) suggestedName = 'strategy';

      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `Nome sugerido: ${suggestedName}. Novo nome (Enter para aceitar):`,
          default: suggestedName,
          validate: (input: string) =>
            /^[a-z0-9-]+$/.test(input) || 'Use apenas letras minúsculas, números e hífens',
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
      const files: string[] = [];
      const templateDir = path.join(__dirname, '../templates');
      const outputDir = process.cwd();

      // Repository
      const repoTemplate = await ejs.renderFile(
        path.join(templateDir, 'repository.ts.ejs'),
        { name, nameCapitalized: name.split('-').map((c: string) => c.charAt(0).toUpperCase() + c.slice(1)).join('') }
      );
      const repoPath = path.join(outputDir, 'src/repositories', `${name}.repository.ts`);
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

      console.log('Arquivos gerados:', files);

      // Passo 5: Sugerir commit
      const { doCommit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'doCommit',
          message: `Fazer commit? Mensagem: 'feat: add ${name} repository and related files'`,
          default: true,
        },
      ]);

      if (doCommit) {
        const git = simpleGit();
        try {
          await git.add(files);
          await git.commit(`feat: add ${name} repository and related files`);
          console.log('Commit realizado com sucesso!');
        } catch (error: any) {
          console.log('Erro ao fazer commit:', error.message);
        }
      }
    });
} 
import { Command } from 'commander';
import chalk from 'chalk';
import { SmartCreateCommand } from './smart-create.command';

export class CreateCommand {
  createCommand(): Command {
    const command = new Command('create')
      .description('Criar componentes da arquitetura Khaos')
      .option('--smart', 'Usar IA para criação inteligente')
      .action(async (options) => {
        if (options.smart) {
          // Redirecionar para smart create
          const smartCommand = new SmartCreateCommand();
          await smartCommand.createCommand().parseAsync(process.argv);
        } else {
          // Modo manual (implementar depois)
          await this.executeManual(options);
        }
      });

    // Adicionar subcomando smart
    const smartCommand = new SmartCreateCommand();
    command.addCommand(smartCommand.createCommand());

    // Adicionar outros subcomandos manuais (para implementar depois)
    command
      .command('atom <name>')
      .description('Criar um átomo manualmente')
      .action(async (name) => {
        console.log(chalk.yellow(`⚠️  Criação manual de átomos será implementada em Sprint 1`));
        console.log(chalk.blue(`💡 Por enquanto, use: khaos create smart "átomo ${name}"`));
      });

    command
      .command('molecule <name>')
      .description('Criar uma molécula manualmente')
      .action(async (name) => {
        console.log(chalk.yellow(`⚠️  Criação manual de moléculas será implementada em Sprint 1`));
        console.log(chalk.blue(`💡 Por enquanto, use: khaos create smart "molécula ${name}"`));
      });

    command
      .command('organism <name>')
      .description('Criar um organismo manualmente')
      .action(async (name) => {
        console.log(chalk.yellow(`⚠️  Criação manual de organismos será implementada em Sprint 1`));
        console.log(chalk.blue(`💡 Por enquanto, use: khaos create smart "organismo ${name}"`));
      });

    command
      .command('template <name>')
      .description('Criar um template manualmente')
      .action(async (name) => {
        console.log(chalk.yellow(`⚠️  Criação manual de templates será implementada em Sprint 1`));
        console.log(chalk.blue(`💡 Por enquanto, use: khaos create smart "template ${name}"`));
      });

    command
      .command('feature <name>')
      .description('Criar uma feature manualmente')
      .action(async (name) => {
        console.log(chalk.yellow(`⚠️  Criação manual de features será implementada em Sprint 1`));
        console.log(chalk.blue(`💡 Por enquanto, use: khaos create smart "feature ${name}"`));
      });

    return command;
  }

  private async executeManual(options: any): Promise<void> {
    console.log(chalk.blue.bold('\n🏗️  Khaos Create - Modo Manual\n'));
    console.log(chalk.yellow('⚠️  Modo manual será implementado em Sprint 1'));
    console.log(chalk.blue('\n💡 Opções disponíveis agora:'));
    console.log(chalk.blue('   • khaos create smart - Criação com IA'));
    console.log(chalk.blue('   • khaos create smart "descrição do componente"'));
    console.log(chalk.blue('   • khaos create smart --help - Ver todas as opções\n'));
  }

  // Método para integração com o CLI principal
  static register(program: Command): void {
    const createCommand = new CreateCommand();
    program.addCommand(createCommand.createCommand());
  }
} 
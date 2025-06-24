#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const program = new commander_1.Command();
// Display ASCII art banner
console.log(chalk_1.default.blue(figlet_1.default.textSync('Khaos CLI', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
})));
console.log(chalk_1.default.gray('🧬 Intelligent CLI for Khaos Architecture\n'));
program
    .name('khaos')
    .description('CLI para gerar arquivos baseados na arquitetura do projeto khaos')
    .version('1.0.0');
// Import and register commands
const create_command_1 = require("./commands/create/create.command");
// Register create command with smart functionality
create_command_1.CreateCommand.register(program);
program
    .command('validate')
    .description('Validate project architecture')
    .action(() => {
    console.log(chalk_1.default.yellow('⚠️  Validate command will be implemented in Sprint 1'));
});
program
    .command('analyze')
    .description('Analyze code quality and architecture')
    .action(() => {
    console.log(chalk_1.default.yellow('⚠️  Analyze command will be implemented in Sprint 2'));
});
program
    .command('refactor')
    .description('AI-assisted refactoring')
    .action(() => {
    console.log(chalk_1.default.yellow('⚠️  Refactor command will be implemented in Sprint 3'));
});
program
    .command('config')
    .description('Configure CLI settings')
    .action(() => {
    console.log(chalk_1.default.yellow('⚠️  Config command will be implemented in Sprint 1'));
});
// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
program.parse();
//# sourceMappingURL=index.js.map
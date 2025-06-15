#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./commands/create");
const update_1 = require("./commands/update");
commander_1.program.version('1.0.0').description('Tartarus CLI para automação de arquivos');
(0, create_1.setupCreateCommand)(commander_1.program);
(0, update_1.setupUpdateCommand)(commander_1.program);
commander_1.program.parse(process.argv);

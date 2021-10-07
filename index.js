#!/usr/bin/env node
const { Command } = require("commander");
const { init } = require("./init");
const { build } = require("./build");

const { version } = require("./package.json");

const program = new Command();

program.version(version);

program
	.command("init")
	.action(init);

program
	.command("build")
	.action(build);

program.parse();

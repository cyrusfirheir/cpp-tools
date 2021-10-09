const { exec } = require("child_process");
const { readFileSync } = require("fs");
const { sync } = require("glob");
const path = require("path");

function build() {
	let config = {};

	try {
		config = JSON.parse(readFileSync(path.join(process.cwd(), "cpp-tools.config.json"), "utf-8"));
	} catch (ex) {
		return console.error(ex);
	}

	const sources = config["includeDirs"]
		.reduce(function (a, path) {
			sync(`${path}/**/*.{c,cpp}`, {
				cwd: process.cwd()
			}).forEach(file => {
				if (!a.includes(file)) a.push(file);
			});
			return a;
		}, [])
		.join(" ");
	
	const includeDirs = config["includeDirs"]
		.map(I => `-I ${I}`)
		.join(" ");
	
	const libraryDirs = config["libraryDirs"]
		.map(L => `-L${L}`)
		.join(" ");
	
	const link = config["link"]
		.map(l => `-l${l}`)
		.join(" ");
	
	const prepMacroDefs = config["prepMacroDefs"]
		.map(D => `-D${D}`)
		.join(" ");
	
	const command = config["command"]
		.join(" ")
		.replace("${sources}", sources)
		.replace("${prepMacroDefs}", prepMacroDefs)
		.replace("${includeDirs}", includeDirs)
		.replace("${libraryDirs}", libraryDirs)
		.replace("${link}", link);
	
	console.log("Executing:", command);
	exec(command, function (error, stdout, stderr) {
		console.log(error, stdout, stderr);
	});
}

module.exports = {
	build
};
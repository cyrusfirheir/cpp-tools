const { prompt } = require("enquirer");
const path = require("path");
const { copySync, mkdirSync, writeFileSync } = require("fs-extra");

function init() {
	const initOptions = prompt([
		{
			name: "name",
			type: "input",
			message: "Name",
			initial: path.basename(process.cwd())
		},
		{
			name: "version",
			type: "input",
			message: "Version",
			initial: "1.0.0"
		},
		{
			name: "description",
			type: "input",
			message: "Description"
		},
		{
			name: "template",
			type: "select",
			message: "Project Template",
			choices: [
				{
					message: "Default",
					value: "default",
					hint: "(Barebones C++ project)"
				},
				{
					message: "OpenGL",
					value: "opengl-legacy",
					hint: "(Legacy OpenGL + GLU + GLUT)"
				},
				{
					message: "OpenGL",
					value: "opengl-modern",
					hint: "(Modern OpenGL + GLAD + GLFW)"
				}
			]
		},
		{
			name: "author",
			type: "input",
			message: "Author"
		},
		{
			name: "license",
			type: "input",
			message: "License",
			initial: "MIT"
		}
	]);

	initOptions.then(config => {
		const link = [];
		const prepMacroDefs = [];
		switch (config["template"]) {
			case "opengl-legacy": {
				link.push(
					"freeglut_static",
					"opengl32",
					"glu32",
					"gdi32",
					"winmm"
				);
				prepMacroDefs.push(
					"FREEGLUT_STATIC"
				);
				break;
			}
			case "opengl-modern": {
				link.push(
					"glfw3_static",
					"gdi32",
				);
				break;
			}
		}
		Object.assign(config, {
			prepMacroDefs,
			includeDirs: [
				"include",
				"src",
			],
			libraryDirs: [
				"lib"
			],
			link,
			command: [
				"g++",
					"-o bin/main.exe",
					"-g ${sources}",
					"${prepMacroDefs}",
					"${includeDirs}",
					"${libraryDirs}",
					"${link}",
			]
		});
		console.log("Setting up project...");

		const configString = JSON.stringify(config, null, "\t");
		writeFileSync(path.join(process.cwd(), "cpp-tools.config.json"), configString, "utf-8");
		
		[ "bin", "include", "lib", "src" ]
			.forEach(dir => mkdirSync(path.join(process.cwd(), dir)));
		
		const scaffoldsPath = path.join(__dirname, "scaffolds", config["template"]);
		copySync(scaffoldsPath, path.join(process.cwd()));
		
		const vscodePath = path.join(__dirname, "scaffolds", ".vscode");
		copySync(vscodePath, path.join(process.cwd(), ".vscode"));

		console.log("Done!");
	})
	.catch(ex => {
		console.error(ex);
		console.log("C++ Tools: Process terminated.")
	});
}

module.exports = {
	init
};
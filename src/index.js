#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const fs = require('fs');
const pathBase = process.cwd();
// Template que usaremos para la creación del contenido del fichero
let templateHTML = require('./templates/templateHTML');
// Mostrar un banner con un mensaje formado por caracteres.
const msn = msn => {
    console.log(chalk.bold.cyan(figlet.textSync(msn, {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })));
}
// Preguntas que se van a realizar y que más tarde usaremos
const queryParams = () => {
    const qs = [{
        name: 'projectName',
        type: 'input',
        message: 'Escribe el nombre del proyecto'
    }, {
        name: 'type',
        type: 'list',
        message: 'Selecciona el tipo de elemento a crear: ',
        choices: [
            'HTML/CSS',
            'HTML/Javascript',
            'HTML/Javascript/CSS',
        ],
    },
    ];
    return inquirer.prompt(qs);
};
// Método que se encarga de crear el fichero en base a las preguntas realizadas
const createFile = (data) => {
    const path = `${pathBase}\\src`;

    let files = [];

    switch (data.type) {
        case 'HTML/CSS':
            files.push(
                `${path}\\index.html`,
                `${path}\\style.css`,
            )
            break;
        case 'HTML/Javascript':
            files.push(
                `${path}\\index.html`,
                `${path}\\main.js`,
            )
            break;
        case 'HTML/Javascript/CSS':
            files.push(
                `${path}\\index.html`,
                `${path}\\style.css`,
                `${path}\\main.js`,
            )
            break;
        default:
            break;
    }
    
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, 0777);
    }
    try {
        files.forEach(file => {
            fs.writeFileSync(file, '', { mode: 0o777 });
        });
        templateHTML = templateHTML.replace('$title', data.projectName);
        templateHTML = templateHTML.replace('$name', data.projectName);
        fs.writeFileSync(files[0], templateHTML, { mode: 0o777 });
    } catch (err) {
        console.error(err);
    } finally {
        console.log(`
      ------ CREADO CORRECTAMENTE ------\n
      Se ha creado el siguiente proyecto\n
      - Tipo: ${chalk.blue.bold(data.type)}\n
      - Ruta: ${chalk.blue.bold(path)}\n
      ----------------------------------\n
    `);
    require('child_process').exec(`code "" "${pathBase}"`);
    }
}
// IIFE (Immediately Invoked Function Expression)
(async () => {
    msn('CLI Vanilla MMB');
    createFile(await queryParams());
})();
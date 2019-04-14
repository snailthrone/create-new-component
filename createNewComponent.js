'use strict';
const fs = require('fs');

const componentName = process.argv[2],
  outputPath = process.argv[3]
    ? process.argv[3]
    : `${__dirname}/${componentName}`,
  templatePath = `${__dirname}/template`;

function outputFileName(fileName) {
  return `${outputPath}/${fileName}`.replace('__COMPONENT__', componentName);
}

function copyTemplateFile(fileName) {
  // Make new component folder if not exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  return new Promise((resolve, reject) => {
    fs.copyFile(
      `${templatePath}/${fileName}`,
      `${outputFileName(fileName)}`,
      (error) => {
        if (error) {
          reject(error);
        }
        resolve(`Succesfull copied ${fileName}!`);
      }
    );
  });
}

function injectFile(fileName) {
  return new Promise((resolve) => {
    const file = fs.readFileSync(`${outputPath}/${fileName}`, 'utf8');
    fs.writeFileSync(
      `${outputPath}/${fileName}`,
      file.replace(/__COMPONENT__/gu, componentName),
      'utf8'
    );
    resolve(`Injected ${outputPath}/${fileName}`);
  });
}

function listFiles(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (error, files) => {
      if (error) {
        reject(error);
      }
      resolve(files);
    });
  });
}

function createComponent() {
  listFiles(templatePath).then((files) => {
    const copyPromises = files.map(file => (
      copyTemplateFile(file).then(status => console.log(status))
    ));
    Promise.all(copyPromises).then(() => {
      listFiles(outputPath).then((injectFiles) => {
        const injectPromises = injectFiles.map(file => (
          injectFile(file).then(status => console.log(status))
        ));
        Promise.all(injectPromises).then(() => console.log('Done!'));
      });
    });
  });
}

if (componentName) {
  createComponent();
} else {
  console.log('Component name not defined.');
  console.log('Usage: node createNewComponent.js [NAME] [PATH]');
}

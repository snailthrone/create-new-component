const fs = require('fs');

const componentName = process.argv[2];

if (componentName) {
  const templatePath = `${__dirname}/template`;
  const outputPath = process.argv[3] ? `${process.argv[3]}/${componentName}` : `src/js/components/${componentName}`;
  createComponent(templatePath, outputPath);
} else {
  console.log('Component name not defined. Usage: node createNewComponent.js [NAME] [PATH]')
}

function copyTemplateFile(fileName) {
  return new Promise((resolve, reject) => {
    //Make new component folder if not exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }

    fs.copyFile(`${templatePath}/${fileName}`, `${outputFileName(fileName)}`, (error) => {
      if (error) {
        reject(error);
      }
      resolve(`Succesfull copied ${fileName}!`)
    });
  });
}

function createComponent(templatePath, outputPath) {
  listFiles(templatePath)
    .then((files) => {
      const copyPromises = files.map((file) => (
        copyTemplateFile(file).then(status => console.log(status))
      ));
      Promise.all(copyPromises).then(() => {
        listFiles(outputPath).then((files) => {
          const injectPromises = files.map((file) => (
            injectFile(file).then(status => console.log(status))
          ));
          Promise.all(injectPromises).then(() => console.log('Done!'));
        });
      });
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

function injectFile(fileName) {
  return new Promise((resolve) => {
    const file = fs.readFileSync(`${outputPath}/${fileName}`, 'utf8');
    const regex = /__COMPONENT__/g;
    fs.writeFileSync(`${outputPath}/${fileName}`, file.replace(regex, componentName), 'utf8')
    resolve(`Injected ${outputPath}/${fileName}`)
  });
}

function outputFileName(fileName) {
  return `${outputPath}/${fileName}`.replace('__COMPONENT__', componentName);
}

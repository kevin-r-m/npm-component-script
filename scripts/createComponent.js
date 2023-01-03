import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import promptSync from "prompt-sync";
const prompt = promptSync();
const { log, error } = console;

handleComponentCreation();

function handleComponentCreation() {
  let fileNameInput;

  log("<== Let's get a new component set-up ==>\n");

  try {
    fileNameInput = prompt("Component name: ");
    if (!fileNameInput) {
      throw "!== component name must be a valid value ==!";
    }
  } catch (e) {
    error(e);
    return;
  }

  const parentPath = `components/${fileNameInput}/`;
  const stylePath = `components/${fileNameInput}/${fileNameInput}.scss`;
  const componentPath = `components/${fileNameInput}/${fileNameInput}.jsx`;

  try {
    buildFileStructure(parentPath, fileNameInput);
  } catch (e) {
    error(e);
    return;
  }

  try {
    writeFileSync(componentPath, constructTemplate(fileNameInput));
    writeFileSync(stylePath, "");
  } catch (e) {
    error(e);
    return;
  }

  log(`<== Component has been set-up, check ${parentPath}  ==>\n`);
}

function buildFileStructure(parentPath, fileNameInput) {
  if (!existsSync("components")) {
    mkdirSync("components");
  }

  if (!existsSync(parentPath)) {
    mkdirSync(parentPath);
  } else {
    log(
      `${fileNameInput} already exists, please try again with a unique component name`
    );
  }
}

function constructTemplate(fileNameInput) {
  const fileBody = {
    imports: [
      `import react from "react";\n`,
      `import styles from "./${fileNameInput}.scss";\n`,
      `import PropTypes from "prop-types";`,
    ],
    propTypes: `${fileNameInput}.propTypes = {\n  propName: PropTypes.string.isRequired,\n};`,
    function: `function ${fileNameInput}({ propName }) {\n  return <div></div>;\n} \n\nexport default ${fileNameInput};`,
  };

  const bodyTemplate = `${fileBody.imports.join("")}\n\n${
    fileBody.propTypes
  }\n\n${fileBody.function}`;

  return bodyTemplate;
}

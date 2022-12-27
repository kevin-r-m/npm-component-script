import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import promptSync from "prompt-sync";
const prompt = promptSync();
const { log } = console;

// node includes script pathing so slice arguments at 2nd index
log("<== Let's get a new component set-up ==>\n");
const fileNameInput = prompt("Component name: ");

function handleComponentCreation() {
  checkArgs();
  buildFileStructure();
  writeFileSync(
    `components/${fileNameInput}/${fileNameInput}.jsx`,
    constructTemplate()
  );
  writeFileSync(`components/${fileNameInput}/${fileNameInput}.scss`, "");
}

handleComponentCreation();

function checkArgs() {
  const args = process.argv.slice(2);
  if (args.includes("help")) {
    // serve usage text
    log("included help");
  }
}

function buildFileStructure() {
  if (!existsSync("components")) {
    mkdirSync("components");
  }

  if (!existsSync(`components/${fileNameInput}/`)) {
    mkdirSync(`components/${fileNameInput}/`);
  } else {
    log(
      `${fileNameInput} already exists, please try again with a unique component name`
    );
  }
}

function constructTemplate() {
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

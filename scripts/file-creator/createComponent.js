import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
} from "node:fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import promptSync from "prompt-sync";
const prompt = promptSync();
const { log, error } = console;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

handleComponentCreation();

function handleComponentCreation() {
  let fileNameInput;
  let codeNamesInput;

  /* NEW FILE WRITING */

  // copies template file to the new file name input -- this needs to go after we grab the user input (test/test.jsx) should be the user input names.
  copyFileSync(
    `${__dirname}/templates/_Component_Module_PropTypes.jsx`,
    `components/test/test.jsx`
  );

  // grabs file data and turns into an array of strings, split on new lines (/n)
  const data = readFileSync(newComponentFile).toString().split("\n");

  // used on template file to replace in data array with imports -- needs better syntax
  const importString = '("import placeholder");';

  // finds index of import string
  const importIndex = data.findIndex((element) => element === importString);

  // import array
  const imports = [
    `import styles from "./${fileNameInput}.scss";\n`,
    `import PropTypes from "prop-types";`,
  ];

  // replaces placeholder for imports with imports array
  data[importIndex] = imports.join("");

  // converts array back to string on line breaks
  const text = data.join("\n");

  // writes new file
  writeFileSync(__dirname + "/templates/_component.jsx", text, function (err) {
    if (err) return err;
  });

  /* END NEW FILE WRITING */

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

  try {
    codeNamesInput = prompt("Include class names library? (y/n): ");
    if (!codeNamesInput) {
      throw "!== input does not match accepted responses ==!";
    }
  } catch (e) {
    error(e);
    return;
  }

  if (codeNamesInput === "y") {
    codeNamesInput = true;
  } else {
    codeNamesInput = false;
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

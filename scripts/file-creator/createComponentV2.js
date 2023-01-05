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

const userInput = {
  fileName: {
    prompt: "Component Name: ",
    errorMessage: "!== component name must be a truthy value ==!",
    value: "",
  },
  classNames: {
    prompt: "Include class names library? (y/n): ",
    errorMessage: "!== input does not match accepted responses ==!",
    value: "",
  },
};

createNewComponent();

function createNewComponent() {
  for (const field in userInput) {
    try {
      getUserInput(field, userInput[field]["prompt"]);
      if (!userInput[field]["value"]) {
        throwError(userInput[field]["errorMessage"]);
      }
    } catch (err) {
      error(err);
      return;
    }
  }
}

function getUserInput(inputField, inputPrompt) {
  userInput[inputField]["value"] = prompt(inputPrompt);
}

function throwError(errorMessage) {
  throw errorMessage;
}

// might want to incorporate a promise and run the function async
function createNewFile(fileName) {
  // copy template
  copyFileSync(
    `${__dirname}/templates/_component.jsx`,
    `components/${fileName}/${fileName}.jsx`
  );

  // grabs file data and turns into an array of strings
  const data = readFileSync("components/test/test.jsx").toString().split("\n");
}

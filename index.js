import fs from "fs/promises";
import { spawn, exec } from "child_process";
import { resolve } from "path";
import chalk from "chalk";

let gitConfigEditor = undefined;

async function getGitEditor() {
  let editor = process.env["GIT_EDITOR"] ?? gitConfigEditor;
  if (!editor)
    editor = gitConfigEditor = await new Promise((resolve) =>
      exec("git config core.editor", (error, stdout) =>
        resolve(error ? undefined : stdout.split("\n")[0]),
      ),
    );
  return editor;
}

async function guessEditor() {
  let editor = await getGitEditor();
  if (!editor) {
    ["VISUAL", "EDITOR"].some((envVar) => (editor = process.env[envVar]));
    if (!editor)
      throw new Error(
        "Cannot identify preferred editor (tip: set git editor or VISUAL/EDITOR env vars)",
      );
  }
  return editor;
}

export async function launchEditor(path, editor, printInfo) {
  if (!editor) editor = await guessEditor();
  path = resolve(path);

  // Just some info
  const printTips = typeof printInfo === "object";
  if (printInfo !== "none") {
    if (printTips)
      printInfo.forEach((tip) => console.log(chalk.blue("# "), tip));
    console.log(
      chalk.yellow("hint:"),
      "Waiting for your editor to close the file...",
    );
  }

  await new Promise((resolve, reject) => {
    const p = spawn(`${editor} "${path}"`, { shell: true, stdio: "inherit" });
    p.on("error", () =>
      reject(`there was a problem with the editor '${editor}'`),
    );
    p.on("exit", resolve);
  });

  // Rolling back the printed info
  if (printTips) {
    process.stdout.moveCursor(0, -(1 + printInfo.length));
    process.stdout.clearScreenDown();
  }

  return fs.readFile(path, { encoding: "utf8" }).catch(() => {
    throw new Error(`could not read file '${path}'`);
  });
}

export async function editInteractively(
  path,
  initialContents,
  editor,
  printInfo,
) {
  path = resolve(path);
  await fs.writeFile(path, initialContents, { encoding: "utf8" }).catch(() => {
    throw new Error(`could not open '${path}' for writing`);
  });

  return await launchEditor(path, editor, printInfo).catch((error) => {
    throw new Error(`could not edit '${path}': ${error}`);
  });
}

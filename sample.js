import { launchEditor, editInteractively } from "./index.js";
import fs from "fs";

const file = "./tmp";
fs.writeFileSync(file, "");

const whatTheyWrote = await launchEditor(file, undefined, [
  "Write anything ya want!",
  "No limitations.",
]);
console.log("Tada, you wrote:", whatTheyWrote);

console.log("Say buh bye to what you wrote (it kinda sucked anyway)");
const whatTheyInteractivelyWrote = await editInteractively(
  file,
  "This is some initial contents to spruce your imaginiation.\n\nWhat kinda wonders will you dream up this pleasant file?",
  undefined,
  ["Sky's the limits!", "Go crazy."],
);
console.log("woah, that's definitely something:", whatTheyInteractivelyWrote);

console.log("Walking away now...");
fs.unlinkSync(file);

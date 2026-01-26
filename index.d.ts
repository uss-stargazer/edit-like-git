/**
 * Launch the user preferred editor to edit a file and return the file's
 * contents upon the user completing their editing.
 *
 * @param path Path to the file
 * @param editor Editor to use, or undefined if ya wanna guess
 * @param tips Tooltips to display for editing, optional
 * @returns File contents
 */
export declare function launchEditor(
  path: string,
  editor?: string,
  printInfo?: "none" | string[],
): Promise<string>;

/**
 * In contrast to `launchEditor()`, this function writes out the contents
 * of the specified file first, then launches the editor and reads back in
 * the file contents.
 *
 * @param path Path to the file
 * @param initialContents Intial contents to overwrite file
 * @param editor Editor to use, or undefined if ya wanna guess
 * @param tips Tooltips to display for editing, optional
 * @returns File contents
 */
export declare function editInteractively(
  path: string,
  initialContents: string,
  editor?: string,
  printInfo?: "none" | string[],
): Promise<string>;

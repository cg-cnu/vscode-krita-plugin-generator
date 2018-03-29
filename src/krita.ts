"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-krita-extension-templates" is now active!'
  );

  let create = vscode.commands.registerCommand("krita.create", () => {

    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        placeHolder: "Name here...",
        prompt: "Enter the name of the script"
      })
      .then(name => {
        vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: "Description here...",
            prompt: "Enter the descriptions of the script"
          })
          .then(description => {
            vscode.window
              .showInputBox({
                ignoreFocusOut: true,
                placeHolder: "Menu entry here...",
                prompt: "Enter the menu entry of the script"
              })
              .then(menuEntry => {
                const scriptTypes = ["Extension", "Docker"];
                vscode.window.showQuickPick(scriptTypes).then(scriptType => {
                    console.log( name, description, menuEntry, scriptType);
                });
              });
          });
      });
  });
  context.subscriptions.push(create);
}

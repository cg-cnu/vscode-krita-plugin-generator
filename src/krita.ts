"use strict";
import * as vscode from "vscode";
import { writeFileSync, existsSync, lstatSync, readFileSync } from "fs";
import { join } from "path";
import * as mkdf from "node-mkdirfilep";

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getTemplate(fileName: string) {
  const template_path = join(__dirname, "..", "src", "templates");
  return readFileSync(join(template_path, fileName), "utf8");
}

export function activate(context: vscode.ExtensionContext) {
  let create = vscode.commands.registerCommand("krita.create", () => {
    // plugin_path
    vscode.window
      .showInputBox({
        ignoreFocusOut: true,
        placeHolder: "Path...",
        prompt: "Enter the path where the plugin has to be created!"
      })
      .then(plugin_path => {
        if (!plugin_path) {
          return;
        }
        // TODO: created by salapati @ 2018-4-3 15:26:34
        // save the pugin path and prefill next time!
        if (!existsSync(plugin_path) || !lstatSync(plugin_path).isDirectory()) {
          vscode.window.showErrorMessage(
            `Given directory '${plugin_path}' dosen't exist!`
          );
          return;
        }

        // plugin_name
        vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: "Name here...",
            prompt: "Enter the name of the plugin!"
          })
          .then(orig_plugin_name => {
            if (!orig_plugin_name) {
              return;
            }
            var plugin_name = orig_plugin_name.replace(/[^a-zA-Z0-9]/g, "");
            if (orig_plugin_name !== plugin_name) {
              vscode.window.showInformationMessage(
                `Plugin name changed from '${orig_plugin_name}' to '${plugin_name}'`
              );
            }
            if (existsSync(join(plugin_path, plugin_name))) {
              vscode.window.showErrorMessage(
                `A plugin already exists in the path '${plugin_path}' with name '${plugin_name}'`
              );
              return;
            }

            // plugin_comment
            vscode.window
              .showInputBox({
                ignoreFocusOut: true,
                placeHolder: "Description here...",
                prompt: `(optional) Enter the descriptions for the plugin!`
              })
              .then(plugin_comment => {
                if (!plugin_comment) {
                  plugin_comment = plugin_name;
                  vscode.window.showInformationMessage(
                    `No plugin comment given. Defaulting to plugin name '${plugin_name}'`
                  );
                }

                // menu_entry
                vscode.window
                  .showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: "Menu entry here...",
                    prompt: "(optional) Enter the menu entry of the plugin!"
                  })
                  .then(menu_entry => {
                    if (!menu_entry) {
                      menu_entry = plugin_name;
                      vscode.window.showInformationMessage(
                        `No menu entry given. Defaulting to plugin name '${plugin_name}'`
                      );
                    }

                    // plugin_types
                    const plugin_types = ["Extension", "Docker"];
                    vscode.window
                      .showQuickPick(plugin_types, {
                        ignoreFocusOut: true
                      })
                      .then(plugin_type => {
                        if (!plugin_type) {
                          vscode.window.showInformationMessage(
                            "No plugin type choosen. Defaulting to Extension!"
                          );
                        }
                        const plugin = plugin_type
                          ? plugin_type.toLowerCase()
                          : "extension";
                        const class_name = capitalizeFirstLetter(plugin_name);

                        // Get templates
                        let plugin_template = eval(
                          "`" + getTemplate(`${plugin}.py`) + "`"
                        );
                        let desktop_template = eval(
                          "`" + getTemplate("script.desktop") + "`"
                        );
                        let manual_template = eval(
                          "`" + getTemplate("manual.html") + "`"
                        );
                        let init_template = `from .${plugin_name} import *`;

                        // Write templates
                        const desktop_file = join(
                          plugin_path,
                          `${plugin_name}.desktop`
                        );
                        mkdf.create(desktop_file);
                        writeFileSync(desktop_file, desktop_template);

                        const folder = join(plugin_path, plugin_name);

                        const py_file = join(folder, `${plugin_name}.py`);
                        mkdf.create(py_file);
                        writeFileSync(py_file, plugin_template);

                        const init_file = join(folder, "__init__.py");
                        mkdf.create(init_file);
                        writeFileSync(init_file, init_template);

                        const manual_file = join(folder, "/manual.html");
                        mkdf.create(manual_file);
                        writeFileSync(manual_file, manual_template);

                        vscode.window.showInformationMessage(
                          `Krita script ${plugin_name} successfully created at ${folder}`
                        );
                        // IDEA: logged by salapati @ 2018-4-3 15:55:57
                        // prompt to open folder on completion
                        // vscode.window
                        //   .showQuickPick([
                        //     `open ${plugin_name} in current window`,
                        //     `open ${plugin_name} in new window`,
                        //     "Don't open!"
                        //   ])
                        //   .then(choice => {
                        //     console.log(choice);
                        //   });
                      });
                  });
              });
          });
      });
  });
  context.subscriptions.push(create);
}

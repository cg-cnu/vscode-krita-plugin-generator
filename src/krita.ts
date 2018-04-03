"use strict";
import * as vscode from "vscode";
import { writeFileSync, existsSync, lstatSync } from "fs";
import { join } from "path";
import * as mkdf from "node-mkdirfilep";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-krita-plugin-generator" is now active!'
  );

  let create = vscode.commands.registerCommand("krita.create", () => {
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
        // make sure the path is valid
        if (!existsSync(plugin_path) || !lstatSync(plugin_path).isDirectory()) {
          vscode.window.showErrorMessage(
            `Given directory '${plugin_path}' dosen't exist!`
          );
          return;
        }
        // get script name...
        vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: "Name here...",
            prompt: "Enter the name of the plugin!"
          })
          .then(plugin_name => {
            if (!plugin_name) {
              return;
            }
            var plugin_name = plugin_name.replace(/[^a-zA-Z ]/g, "");
            // make sure that path dosen't contain the script name already
            if (existsSync(join(plugin_path, plugin_name))) {
              vscode.window.showErrorMessage(
                `A plugin already exists in the path '${plugin_path}'`
              );
              return;
            }
            vscode.window
              .showInputBox({
                ignoreFocusOut: true,
                placeHolder: "Description here...",
                prompt: `Enter the descriptions for the plugin!`
              })
              .then(plugin_comment => {
                if (!plugin_comment) {
                  plugin_comment = plugin_name;
                }
                vscode.window
                  .showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: "Menu entry here...",
                    prompt: "Enter the menu entry of the plugin!"
                  })
                  .then(menu_entry => {
                    if (!menu_entry) {
                      menu_entry = plugin_name;
                    }
                    const plugin_types = ["Extension", "Docker"];
                    vscode.window
                      .showQuickPick(plugin_types)
                      .then(plugin_type => {
                        // const class_name = plugin_name.upper();
                        const class_name = plugin_name;
                        var plugin_template = "";
                        if (plugin_type === "Extension") {
                          plugin_template = `from krita import Extension

EXTENSION_ID = 'pykrita_${plugin_name}'
MENU_ENTRY = '${menu_entry}'

class ${class_name}(Extension):

    def __init__(self, parent):
        super().__init__(parent)

    def setup(self):
        app = Krita.instance()
        action = app.createAction(EXTENSION_ID, MENU_ENTRY)
        # parameter 1 =  the name that Krita uses to identify the action
        # parameter 2 = the text to be added to the menu entry for this script
        action.triggered.connect(self.action_triggered)
        
    def action_triggered(self):
        pass # your active code goes here. 

# And add the extension to Krita's list of extensions:
app=Krita.instance()
extension=${class_name}(parent=app) #instantiate your class
app.addExtension(extension)`;
                        }
                        if (plugin_type === "Docker") {
                          plugin_template = `from krita import DockWidget, DockWidgetFactory, DockWidgetFactoryBase

DOCKER_NAME = '${plugin_name}'
DOCKER_ID = 'pyKrita_${plugin_name}'

class ${class_name}(DockWidget):

    def __init__(self):
        super().__init__()
        self.setWindowTitle(DOCKER_NAME) 

    def canvasChanged(self, canvas):
        pass

instance = Krita.instance()
dock_widget_factory = DockWidgetFactory(DOCKER_ID, 
    DockWidgetFactoryBase.DockRight, 
    ${class_name})

instance.addDockWidgetFactory(dock_widget_factory)`;
                        }
                        let DESKTOP_TEMPLATE = `[Desktop Entry]
Type=Service
ServiceTypes=Krita/PythonPlugin
X-KDE-Library=${plugin_name}
X-Python-2-Compatible=false
X-Krita-Manual=manual.html
Name=${plugin_name}
Comment=${plugin_comment}`;

                        let INIT_TEMPLATE = `from .${plugin_name} import *`;

                        let MANUAL_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<!--BBD's Krita Script Starter, Feb 2018 -->
<head><title>${plugin_name}</title>
</head>
<body>
<h3>${plugin_name}</h3>
Tell people about what your script does here. This is an html document so you can format it with html tags.
<h3>Usage</h3>
Tell people how to use your script here. 

</body>
</html>`;
                        //create .desktop file...
                        mkdf.create(
                          join(`${plugin_path}`, `${plugin_name}.desktop`)
                        );
                        // write contents...
                        writeFileSync(
                          join(`${plugin_path}`, `${plugin_name}.desktop`),
                          DESKTOP_TEMPLATE
                        );
                        // create main script file...
                        mkdf.create(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            `${plugin_name}.py`
                          )
                        );
                        // write files to disk
                        writeFileSync(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            `${plugin_name}.py`
                          ),
                          plugin_template
                        );
                        // Create __init__.py file...
                        mkdf.create(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            "__init__.py"
                          )
                        );
                        writeFileSync(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            "__init__.py"
                          ),
                          INIT_TEMPLATE
                        );
                        // Create manual.html file...
                        mkdf.create(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            "/manual.html"
                          )
                        );
                        writeFileSync(
                          join(
                            `${plugin_path}`,
                            `${plugin_name}`,
                            "/manual.html"
                          ),
                          MANUAL_TEMPLATE
                        );
                        vscode.window.showInformationMessage(
                          `Krita script ${plugin_name} successfully created at ${plugin_path}`
                        );
                        // IDEA: logged by salapati @ 2018-4-3 15:55:57
                        // prompt to open folder on completion
                      });
                  });
              });
          });
      });
  });
  context.subscriptions.push(create);
}

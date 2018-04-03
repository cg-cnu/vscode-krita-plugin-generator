"use strict";
import * as vscode from "vscode";
import { writeFileSync } from "fs";
import { join } from "path";

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
      .then(script_name => {
        // TODO: created by salapati @ 2018-4-3 11:46:43
        // format name to not have special characters and spaces
        vscode.window
          .showInputBox({
            ignoreFocusOut: true,
            placeHolder: "Description here...",
            prompt: `Enter the descriptions for the script `
          })
          .then(script_comment => {
            // TODO: created by salapati @ 2018-4-3 11:49:18
            // if descript is none create a dummy description
            vscode.window
              .showInputBox({
                ignoreFocusOut: true,
                placeHolder: "Menu entry here...",
                prompt: "Enter the menu entry of the script"
              })
              .then(menu_entry => {
                // TODO: created by salapati @ 2018-4-3 11:48:56
                // if menu entry is none make script name as entry
                vscode.window
                  .showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: "Path...",
                    prompt:
                      "Enter the path where the extension has to be created"
                  })
                  .then(script_path => {
                    const scriptTypes = ["Extension", "Docker"];
                    vscode.window
                      .showQuickPick(scriptTypes)
                      .then(scriptType => {
                        // const class_name = script_name.upper();
                        const class_name = script_name;
                        var script_template = "";
                        if (scriptType === "Extension") {
                          script_template = `from krita import Extension

EXTENSION_ID = 'pykrita_${script_name}'
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
                        if (scriptType === "Docker") {
                          script_template = `from krita import DockWidget, DockWidgetFactory, DockWidgetFactoryBase

DOCKER_NAME = '${script_name}'
DOCKER_ID = 'pyKrita_${script_name}'

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
X-KDE-Library=${script_name}
X-Python-2-Compatible=false
X-Krita-Manual=manual.html
Name=${script_name}
Comment=${script_comment}`;

                        let INIT_TEMPLATE = `from .${script_name} import *`;

                        let MANUAL_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<!--BBD's Krita Script Starter, Feb 2018 -->
<head><title>${script_name}</title>
</head>
<body>
<h3>${script_name}</h3>
Tell people about what your script does here. This is an html document so you can format it with html tags.
<h3>Usage</h3>
Tell people how to use your script here. 

</body>
</html>`;
                        // Create .desktop file
                        writeFileSync(
                          join(`${script_path}`, `${script_name}.desktop`),
                          DESKTOP_TEMPLATE
                        );

                        // write files to disk
                        writeFileSync(
                          join(
                            `${script_path}`,
                            `${script_name}`,
                            `${script_name}.py`
                          ),
                          script_template
                        );

                        writeFileSync(
                          join(
                            `${script_path}`,
                            `${script_name}`,
                            "__init__.py"
                          ),
                          INIT_TEMPLATE
                        );

                        writeFileSync(
                          join(
                            `${script_path}`,
                            `${script_name}`,
                            "/manual.html"
                          ),
                          MANUAL_TEMPLATE
                        );
                      });
                  });
              });
          });
      });
  });
  context.subscriptions.push(create);
}

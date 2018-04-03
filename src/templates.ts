// library_name : name
// script_name: name
// script_comment: comment || generated
// krita_id : 'pykrita_'+name
// menu_entry: menuEntry || name
// class_name: convert name into a camecase!

const script_name = "script_name";
const script_comment = "script_comment";
const library_name = "library_name";
const menu_entry = "menu_entry";
const class_name = "class_name";

export const DESKTOP_TEMPLATE = `
[Desktop Entry]
Type=Service
ServiceTypes=Krita/PythonPlugin
X-KDE-Library={library_name}
X-Python-2-Compatible=false
X-Krita-Manual=Manual.html
Name=${script_name}
Comment=${script_comment}`;

export const INIT_TEMPLATE = `from .${library_name} import *`;

export const EXTENSION_TEMPLATE = `
from krita import Extension

EXTENSION_ID = 'pykrita_${library_name}'
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

export const DOCKER_TEMPLATE = `
from krita import DockWidget, DockWidgetFactory, DockWidgetFactoryBase

DOCKER_NAME = '${script_name}'
DOCKER_ID = 'pyKrita_${library_name}'

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

export const MANUAL_TEMPLATE = `
<?xml version="1.0" encoding="utf-8"?>
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

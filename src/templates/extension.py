from krita import Extension

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
app.addExtension(extension)
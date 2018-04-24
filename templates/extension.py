from krita import Extension

MENU_NAME = '${orig_plugin_name}'
EXTENSION_ID = 'pykrita_${plugin_name}'
MENU_ENTRY = '${menu_entry}'

class ${class_name}(Extension):

    def __init__(self, parent):
        super().__init__(parent)

    def setup(self):
        pass

    def createActions(self, window):
        action = window.createAction(EXTENSION_ID, MENU_NAME, MENU_ENTRY)
        action.triggered.connect(self.action_triggered)
        
    def action_triggered(self):
        # code here.
        pass  

app=Krita.instance()
extension=${class_name}(parent=app)
app.addExtension(extension)
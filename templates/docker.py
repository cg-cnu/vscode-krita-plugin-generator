from krita import DockWidget, DockWidgetFactory, DockWidgetFactoryBase

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

instance.addDockWidgetFactory(dock_widget_factory)
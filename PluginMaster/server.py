import time
from . import globalVal
from .pluginService import PluginService
from .pluginHelper import PluginHelper
from .snowid import IdWorker
import threading

class PluginServer(object):
    name = "PluginServer"
    _instance_lock = threading.Lock()
    service = None

    def __init__(self):
        time.sleep(1)
        event = threading.Event()
        self.service = PluginService(event, 0)

    @classmethod
    def instance(cls, *args, **kwargs):
        if not hasattr(PluginServer, "_instance"):
            with PluginServer._instance_lock:   #为了保证线程安全在内部加锁
                if not hasattr(PluginServer, "_instance"):
                    PluginServer._instance = PluginServer(*args, **kwargs)
        return PluginServer._instance

    def startup(self):
        self.service.start()
        print("plugin service started")
        
    def shutdown(self):
        self.service.status = 0
        self.service.stop()
        print("plugin service stopped")

    def createPlugin(self):
        #import uuid # 也可以试用UUID，都可以。
        #print(uuid.uuid4())
        helper = PluginHelper()
        worker = IdWorker(1, 2, 0)
        key = "SP_" + str(worker.get_id())
        helper.createPluginSpace(globalVal.PLUGINS_DIR, key)
        return key

    def removePlugin(self, pluginId):
        helper = PluginHelper()
        helper.removePluginSpace(globalVal.PLUGINS_DIR, pluginId)

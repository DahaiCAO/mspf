import threading
import os,time
from django.conf.urls import url, include
from django.conf import settings
from django.conf import urls
from importlib import import_module
from . import globalVal
from .pluginListener import FileEventHandler
from watchdog.observers import Observer
from watchdog.events import *

class PluginService(threading.Thread):
    name = "PluginService"
    status = 0 # 0: stop; 1: start;

    def __init__(self, thread_event, status=1):
        threading.Thread.__init__(self)
        self.name = "PluginService"
        self.event = thread_event
        self.status = status
        self.setDaemon(True) # 设置为后台线程

    def run(self):
        observer = Observer()
        event_handler = FileEventHandler()
        watch = observer.schedule(event_handler, path=globalVal.PLUGINS_DIR, recursive=False)
        event_handler2 = LoggingEventHandler()  
        observer.add_handler_for_watch(event_handler2, watch)      #为watch新添加一个event handler
        observer.start()
        try:
            while self.status == 1:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
        print("plugin service stopped.")
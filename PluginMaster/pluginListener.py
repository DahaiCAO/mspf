import os,shutil,time
import configparser 
from watchdog.observers import Observer
from watchdog.events import *
import logging
from . import globalVal
from django.conf import settings
from django.conf.urls.i18n import urlpatterns
from django.conf.urls import url, include
from importlib import import_module
from .pluginHelper import PluginHelper

class FileEventHandler(FileSystemEventHandler):
    def __init__(self):
        logging.basicConfig(filename=globalVal.LOGS_DIR+'/plugin_master.log', 
                            level=logging.DEBUG,
                            filemode="w", #文件的写入格式，w为重新写入文件，默认是追加
                            format=globalVal.LOGS_FORMAT, 
                            datefmt=globalVal.LOGS_DATE_FORMAT)
        FileSystemEventHandler.__init__(self)

    def on_moved(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            logger.info("directory moved from {0} to {1}".format(event.src_path, event.dest_path))
        else:
            logger.info("file moved from {0} to {1}".format(event.src_path, event.dest_path))

    def on_created(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            # file_path0 = event.src_path
            # #print(file_path0.index('/'))
            # file_path1 = file_path0[file_path0.rindex('\\')+1:]
            # #print(file_path1)
            # helper = PluginHelper()
            # helper.registerPlugin(file_path1)
            logger.info("directory created:{0}".format(event.src_path))
        else:
            logger.info("file created:{0}".format(event.src_path))

    def on_deleted(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            # file_path0 = event.src_path
            # #print(file_path0.index('/'))
            # file_path1 = file_path0[file_path0.rindex('\\')+1:]
            # #print(file_path1)
            # helper = PluginHelper()
            # helper.writeoffPlugin(file_path1)
            # print(file_path1)
            # print("o")
            logger.info("directory deleted:{0}".format(event.src_path))
        else:
            # print("p")
            # print(event.src_path)
            logger.info("file deleted:{0}".format(event.src_path))

    def on_modified(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            logger.info("directory modified:{0}".format(event.src_path))
        else:
            logger.info("file modified:{0}".format(event.src_path))

# if __name__ == "__main__":
#     observer = Observer()
#     event_handler = FileEventHandler()
#     plugin_directory = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), "plugins")
#     log_directory = os.path.join(os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)), "logs")
#     watch = observer.schedule(event_handler, path=plugin_directory, recursive=True)
#     logging.basicConfig(filename=log_directory+'/plugin_master.log', 
#                         level=logging.DEBUG,
#                         filemode="w", #文件的写入格式，w为重新写入文件，默认是追加
#                         format='%(asctime)s %(filename)s %(levelname)-9s : %(lineno)s line - %(message)s', 
#                         datefmt='%Y-%m-%d %H:%M:%S')
#     event_handler2 = LoggingEventHandler()  
#     observer.add_handler_for_watch(event_handler2, watch)      #为watch新添加一个event handler
#     observer.start()
    # try:
    #     while True:
    #         time.sleep(1)
    # except KeyboardInterrupt:
    #     observer.stop()
    # observer.join()



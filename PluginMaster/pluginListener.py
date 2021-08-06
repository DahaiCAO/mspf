from watchdog.events import *
import logging
from . import globalVal


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
            logger.info("directory created:{0}".format(event.src_path))
        else:
            logger.info("file created:{0}".format(event.src_path))

    def on_deleted(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            logger.info("directory deleted:{0}".format(event.src_path))
        else:
            logger.info("file deleted:{0}".format(event.src_path))

    def on_modified(self, event):
        logger = logging.getLogger()
        if event.is_directory:
            logger.info("directory modified:{0}".format(event.src_path))
        else:
            logger.info("file modified:{0}".format(event.src_path))



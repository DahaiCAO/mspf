import os
from . import globalVal

globalVal.ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
globalVal.PLUGINS_DIR = os.path.join(globalVal.ROOT_DIR, "plugins")
globalVal.LOGS_DIR = os.path.join(globalVal.ROOT_DIR, "logs")
globalVal.LOGS_FORMAT = '%(asctime)s %(filename)s %(levelname)-9s : %(lineno)s line - %(message)s'
globalVal.LOGS_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

#print("m主程序第一个执行:__init__")

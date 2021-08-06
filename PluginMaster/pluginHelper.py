from genericpath import isfile
import os
from pathlib import Path
from . import globalVal
import logging
import shutil
from django.conf import settings
from django.conf.urls import url, include
from django.urls.resolvers import URLResolver, URLPattern
from importlib import import_module
from .core import FileFolderMenuItem
import re
import time
from time import mktime
from datetime import datetime


class PluginHelper():
    def __init__(self):
        logging.basicConfig(filename=globalVal.LOGS_DIR+'/plugin_helper.log', 
                            level=logging.DEBUG,
                            filemode="w", #文件的写入格式，w为重新写入文件，默认是追加
                            format=globalVal.LOGS_FORMAT, 
                            datefmt=globalVal.LOGS_DATE_FORMAT)
        self.logger = logging.getLogger()

    def createPath(self, path):
        p = Path(path)
        try:
            p.mkdir()
            self.logger.info("created path: {0}".format(path))
        except FileExistsError as e:
            self.logger.error("created path: {0}".format(path))

    def createPluginSpace(self, pluginPath, pluginId):
        path = os.path.join(pluginPath, pluginId)
        self.createPath(path)
        self.createPath(path+"/migrations")
        self.createPath(path+"/logs")
        self.createPath(path+"/static")
        self.createPath(path+"/static/img")
        self.createPath(path+"/static/css")
        self.createPath(path+"/static/jsplugins")
        self.createPath(path+"/templates")

        f = open(path+"/migrations/__init__.py", "w", encoding="utf8")
        f.close()
        self.logger.info("created migrations/__init__.py")
        
        f = open(path+"/__init__.py", "w", encoding="utf8")
        f.write("# Firstly run:__init__.py\r\n")
        f.close()
        self.logger.info("created __init__.py")
        
        f = open(path+"/admin.py", "w", encoding="utf8")
        f.write("from django.contrib import admin\r\n")
        f.write("# Fourthly run:admin.py\n")
        f.write("# This file is used to configure the admin site.\n")
        f.write("# Register your models here.\r\n")
        f.close()
        self.logger.info("created admin.py")

        f = open(path+"/apps.py", "w", encoding="utf8")
        f.write("from django.apps import AppConfig\r\n")
        f.write("# Secondly run:apps.py\n")
        f.write("# This file is used to configure current App's conf.\r\n")
        f.write("class "+pluginId+"Config(AppConfig):\n")
        f.write("    default_auto_field = 'django.db.models.BigAutoField'\n")
        f.write("    name = 'plugins."+pluginId+"'\r\n")
        f.close()
        self.logger.info("created apps.py")

        f = open(path+"/models.py", "w", encoding="utf8")
        f.write("from django.db import models\r\n")
        f.write("# Thirdly run:models.py\r\n")
        f.write("# Create your models here.\r\n")
        f.close()
        self.logger.info("created models.py")

        f = open(path+"/tests.py", "w", encoding="utf8")
        f.write("from django.test import TestCase\r\n")
        f.write("# Create your unit tests here.\r\n")
        f.close()
        self.logger.info("created tests.py")

        f = open(path+"/urls.py", "w", encoding="utf8")
        f.write("from django.urls import path\n")
        f.write("from . import views\r\n")
        f.write("# This file is used to defined RESTFul APIs:\n")
        f.write("# path('hello/', views.hello)，that is http://localhost:port/hello,\n# direct to views.hello method，views.hello defined in views.py。\n")
        f.write("# Fifthly run:urls.py\r\n")
        f.write("urlpatterns = [\n")
        f.write("    path('', views.pluginIndex),\n")
        f.write("    path('hello/', views.hello),\n")
        f.write("]\r\n")
        f.close()
        self.logger.info("created urls.py")

        f = open(path+"/views.py", "w", encoding="utf8")
        f.write("from django.shortcuts import render\n")
        f.write("from django.http import HttpResponse,JsonResponse\n")
        f.write("from django.views.decorators.csrf import csrf_exempt\r\n")
        f.write("# When getting requests from browers using ajax :views.py\r\n")
        f.write("# this file is similar to controllers in srpingmvc or springboot\n")
        f.write("# Create your views here.\n")
        f.write("def pluginIndex(request):\n")
        f.write("    return HttpResponse('Hi, this is a plugin!')\r\n")
        f.write("def hello(request):\n")
        f.write("    return HttpResponse('Hi, This is Cao Dahai!')\r\n")
        f.close()
        self.logger.info("created views.py")

    def removePluginSpace(self, pluginPath, pluginId):
        # 使用shutil库，该库为python内置库，是一个对文件及文件夹高级操作的库，
        # 可以与os库互补完成一些操作，如文件夹的整体复制，移动文件夹，对文件重命名等。
        # os.remove(path)  # path是文件的路径，如果这个路径是一个文件夹，则会抛出OSError的错误，这时需用用rmdir()来删除
        # os.rmdir(path)  # path是文件夹路径，注意文件夹需要时空的才能被删除
        # os.unlink('F:\新建文本文档.txt')  # unlink的功能和remove一样是删除一个文件，但是删除一个删除一个正在使用的文件会报错。
        # os.removedirs(path)  # 递归地删除目录。如果子目录成功被删除，则将会成功删除父目录，子目录没成功删除，将抛异常。
        try:
            if os.path.exists(pluginPath+"/"+pluginId):
                shutil.rmtree(pluginPath+"/"+pluginId)
            self.logger.info("deleted plugin: {0}".format(pluginPath+"/"+pluginId))
        except FileExistsError as e:
            self.logger.error("delete path error: {0}".format(pluginPath+"/"+pluginId))

    def registerPlugin(self, plugin_name):
        # dynamic add plugins
        plugin = 'plugins.'+plugin_name
        if plugin not in settings.INSTALLED_APPS:
            settings.INSTALLED_APPS.append(plugin)
            try:
                _module = import_module('%s.urls' % plugin)
            except:
                pass
            else:
                urls = import_module(settings.ROOT_URLCONF)
                flag = ''
                for app in urls.urlpatterns:
                    if isinstance(app, URLResolver):
                        #print('\n'.join(['%s:%s' % item for item in app.__dict__.items()]))
                        if app.pattern.regex is re.compile("^"+plugin+"/"):
                            flag = True
                            break
                if flag == '':
                    urls.urlpatterns.append(url(r'^%s/' % plugin, include('%s.urls' % plugin)))
                    for app in urls.urlpatterns:
                        print(app)

        self.logger.info("registed plugin app: {0}".format(plugin))

        for app in settings.INSTALLED_APPS:
            print(app)

    def writeoffPlugin(self, plugin_name):
        plugin = 'plugins.'+plugin_name
        for app in settings.INSTALLED_APPS:
            if app == plugin:
                settings.INSTALLED_APPS.remove(app)
        
        urls = import_module(settings.ROOT_URLCONF)
        for app in urls.urlpatterns:
            if isinstance(app, URLPattern):  # 非路由分发
                # 打印所有属性
                #print('\n'.join(['%s:%s' % item for item in app.__dict__.items()]))
                pass
            elif isinstance(app, URLResolver):
                #print('\n'.join(['%s:%s' % item for item in app.__dict__.items()]))
                if app.pattern.regex is re.compile("^"+plugin+"/"):
                    urls.urlpatterns.remove(app)
                    break

        self.logger.info("wrote off plugin app: {0}".format(plugin))

        for app in settings.INSTALLED_APPS:
            print(app)
        for app in urls.urlpatterns:
            print(app)

    """
        this function will convert bytes to MB.... GB... etc
    """
    def convert_bytes(self, num):
        for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
            if num < 1024.0:
                return "%3.0f %s" % (num, x)
            num /= 1024.0


    def getFoldersFiles(self, plugins_folder, plugin_folder, children):
        for path, dirNames, fileNames in os.walk(plugins_folder + os.sep + plugin_folder):
            for name in dirNames:
                folder = FileFolderMenuItem()
                folder.parent = path.replace(plugins_folder + os.sep, '')
                folder.parent = folder.parent.replace(os.sep, '_')
                children.append(folder)
                folder.name = name
                if not os.listdir(path + os.sep + name):
                   folder.icon = "bi bi-folder"
                else:
                   folder.icon = "bi bi-folder-fill"
                folder.id = path.replace(plugins_folder + os.sep, '') + os.sep + name
                folder.context = folder.id
                folder.dirName = folder.id # duplicated 
                folder.id = folder.id.replace(os.sep, '_')
                folder.menuItemType = 1
                folder.expended = 0
                folder.children = []
                folder.targetId = ""
                folder_info = os.stat(path + os.sep + name)
                modifiedTime = time.ctime(folder_info.st_mtime)
                mTime_t = time.strptime(modifiedTime, "%a %b %d %H:%M:%S %Y")
                folder.lastModified = time.strftime("%y-%m-%d %H:%M:%S", mTime_t)
                folder.description = folder.name + " " + folder.lastModified
            for name in fileNames:
                file = FileFolderMenuItem()
                file.parent = path.replace(plugins_folder + os.sep, '') 
                file.parent = file.parent.replace(os.sep, '_')
                children.append(file)
                file_info = os.stat(path + os.sep + name)
                # os.path.getsize(path + os.sep + name)
                file.size = self.convert_bytes(file_info.st_size)
                file.name = name
                if (file_info.st_size > 0):
                    file.icon = "bi bi-file-earmark-code-fill"
                else:
                    file.icon = "bi bi-file-earmark-code"
                file.id = path.replace(plugins_folder + os.sep, '') + os.sep + name
                file.context = file.id
                file.id = file.id.replace(os.sep, '_')
                file.dirName = path.replace(plugins_folder + os.sep, '') # the directory of file
                file.menuItemType = 0
                modifiedTime = time.ctime(file_info.st_mtime)
                mTime_t = time.strptime(modifiedTime, "%a %b %d %H:%M:%S %Y")
                file.expended = 0
                file.lastModified = time.strftime("%y-%m-%d %H:%M:%S", mTime_t)
                file.description = file.name + " (" + file.size + ") " + file.lastModified
                file.children = []
                file.targetId = ""

    def pluginDirectory(self, plugins_folder, plugin_folder):
        root = FileFolderMenuItem()
        root.id = plugin_folder
        root.expended = 1
        root.name = root.id
        root.icon = "bi bi-folder-fill"
        root.parent = "_"
        root.context = root.id
        root.dirName = root.id
        root.children = []
        root.menuItemType = 1 # 1 means folder;0 means file
        root.targetId = ""
        root.description = root.id
        list = []
        list.append(root)
        if os.path.isdir(plugins_folder + os.sep + plugin_folder):
            self.getFoldersFiles(plugins_folder, plugin_folder, list)
        return list

    # file_folder_name is the file name or folder name to be removed
    def removeFileFolder(self, file_folder_name):
        path = globalVal.PLUGINS_DIR + os.sep + file_folder_name
        if os.path.isfile(path): 
            os.remove(path) # remove file
        elif os.path.isdir(path):
            shutil.rmtree(path) # remove folder

    def newFolderFile(self, parent_folder, type, name):
        parentFolder = parent_folder + os.sep + name
        path = os.path.join(globalVal.PLUGINS_DIR, parentFolder)
        print(path)
        if (int(type) == 1): # new folder
            self.createPath(path)
        elif (int(type) == 0): # new file
            f = open(path, "w", encoding="utf8")
            f.close()

    def renameFolderFile(self, old_folder_file_name, parent_folder, new_folder_file_name):
        oldpath = globalVal.PLUGINS_DIR + os.sep + old_folder_file_name
        newpath = globalVal.PLUGINS_DIR + os.sep + parent_folder + os.sep + new_folder_file_name
        os.rename(oldpath, newpath)

    def getAllDirectories(self, plugins_folder, plugin_folder, src_folder):
        folders = []
        for path, subfolders, files in os.walk(plugins_folder + os.sep + plugin_folder):
            relative_path = path.replace(plugins_folder + os.sep, "")
            if (relative_path.find(src_folder) == -1 and relative_path not in folders):
                folders.append(relative_path)
            for name in subfolders:
                dist_path = relative_path + os.sep + name
                if (dist_path.find(src_folder) == -1):
                    folders.append(dist_path)
        return folders

    def copyMoveTo(self, src_file_folder_name, dist_folder_name, operation):
        print(src_file_folder_name)
        print(dist_folder_name)
        print(operation)
        if (operation == "moveto"):
            shutil.move(src_file_folder_name, dist_folder_name)
        elif (operation == "copyto"):
            if (os.path.isfile(src_file_folder_name)):
                shutil.copy(src_file_folder_name, dist_folder_name)
            elif (os.path.isdir(src_file_folder_name)):
                dst = src_file_folder_name[src_file_folder_name.rfind(os.sep)+1:]
                shutil.copytree(src_file_folder_name, dist_folder_name + os.sep + dst, dirs_exist_ok=True)

    def openFile(self, src_file_path):
        f = open(src_file_path, "r", encoding="utf8")
        file_context = ""
        try:
            file_context = f.read()
        finally:
            f.close()
        return file_context

    def saveFile(self, filePath, fileContent):
        f = open(filePath, "w", encoding="utf8")
        try:
            f.write(fileContent)
        finally:
            f.close()



# if __name__ == "__main__":
#     helper = PluginHelper()
#     globalVal.ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
#     globalVal.PLUGINS_DIR = os.path.join(globalVal.ROOT_DIR, "plugins")
#     worker = IdWorker(1, 2, 0)
#     key = "SP_" + str(worker.get_id())
#     helper.createPluginSpace(globalVal.PLUGINS_DIR, key)

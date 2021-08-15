from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
from django.http import HttpResponse,JsonResponse,FileResponse
from .snowid import IdWorker
from .models import Plugin
from .pluginHelper import PluginHelper
from . import globalVal
from .core import MainframeConfig
import zipfile
import os
from urllib.parse import unquote
import json
from django.core import serializers

def index(request):
    return render(request, 'index.html')

def pluginIndex(request):
    return render(request, 'plugin.html')

def pluginExample(request):
    return render(request, 'plugin_example.html')

def pluginEditor(request):
    return render(request, 'plugin_editor.html')

def docs(request):
    return render(request, 'Application micro service plugin framework deployment manual.docs',)

def download(request):
    return render(request, 'PaaSPluginFwk.zip')

def help(request):
    return render(request, 'help.html')

@csrf_exempt
def uploadPluginZipFile(request):
    if request.method == "POST":
        request.encoding = "utf-8"
        file = request.FILES.get("file", None)
        fileName = request.POST.get("filename", "",)
        fileName = unquote(fileName)
        # flen = request.POST.get("flen", "")
        if file is None:
            return JsonResponse({ 'status' : '1', 'message': '文件不存在' })
        else:
            with open(globalVal.PLUGINS_DIR+"/"+fileName, 'wb+') as f:
                 for chunk in file.chunks():
                     f.write(chunk)
            with zipfile.ZipFile(globalVal.PLUGINS_DIR+"/"+fileName) as zf:
                zf.extractall(path=globalVal.PLUGINS_DIR)
            if os.path.exists(globalVal.PLUGINS_DIR+"/"+fileName): # 压缩包文件也删除
                os.unlink(globalVal.PLUGINS_DIR+"/"+fileName)
            record = Plugin.objects.filter(id=fileName[0:-4])
            if not record.exists():
                Plugin.objects.create(id=fileName[0:-4], 
                    name="新上传的插件："+fileName[0:-4], 
                    developer="dev", 
                    pluginVersion="0.1",
                    copyright="dev",
                    pluginDescription="添加插件...",
                    useCounting=0,
                    likeCounting=0,
                    keywords="插件",
                    pluginType="general",
                    logo="",
                    defaultOptions="?",
                    isFree=1,
                    license="Apache License 2.0",
                    pricing="0",
                    banned="0",
                    parent='None',
                    currOwner='None',
                    owner='None')
                helper = PluginHelper()
                helper.registerPlugin(fileName[0:-4]) # 注册插件
        return JsonResponse({ 'status' : '0' })
    else:
        return JsonResponse({ 'status' : '1' })

def get_zip_file(input_path, result):
    files = os.listdir(input_path)
    for file in files:
        if os.path.isdir(input_path + os.sep + file):
            get_zip_file(input_path + os.sep + file, result)
        result.append(input_path + os.sep + file)
        
def zip_plugin(plugins_folder, plugin_folder):
    f = zipfile.ZipFile(plugins_folder + os.sep + plugin_folder+".zip", 'w', zipfile.ZIP_DEFLATED)
    filelists = []
    get_zip_file(plugins_folder + os.sep + plugin_folder, filelists)
    for file in filelists:
        fpath = file.replace(plugins_folder, '')
        f.write(file, fpath)
    f.close()
    return plugins_folder + os.sep + plugin_folder+".zip"

@csrf_exempt
def downloadPluginZipFile(request):
    pluginId = request.POST.get('filename', '')
    #pluginId = pluginId[0:9]
    if os.path.isdir(globalVal.PLUGINS_DIR + os.sep + pluginId):
        zip_plugin(globalVal.PLUGINS_DIR, pluginId)

    fileName = pluginId+".zip"
    if os.path.isfile(globalVal.PLUGINS_DIR + os.sep + fileName):
        file = open(globalVal.PLUGINS_DIR + os.sep + fileName,'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response["Content-disposition"] = "attachment;filename={0}".format(fileName)
        # file.close()
        # os.remove(globalVal.PLUGINS_DIR+"/"+fileName)
        return response
    return JsonResponse({ 'status' : '1' }) # 下载失败

@csrf_exempt
def createPlugin(request):
    pluginName = request.POST.get('pluginName', '')
    developer = request.POST.get('developer', '')
    version = request.POST.get('version', '')
    copyright = request.POST.get('copyright', '')
    description = request.POST.get('description', '')
    keywords =  request.POST.get('keywords', '')
    logo =  request.POST.get('logo', '')
    defaultOptions =  request.POST.get('defaultOptions', '')
    pricing =  request.POST.get('pricing', '')
    banned =  request.POST.get('banned', '')
    worker = IdWorker(1, 2, 0)
    key = "SP_" + str(worker.get_id())
    Plugin.objects.create(id=key, 
                          name=pluginName, 
                          developer=developer, 
                          pluginVersion=version,
                          copyright=copyright,
                          pluginDescription=description,
                          useCounting=0,
                          likeCounting=0,
                          keywords=keywords,
                          pluginType="general",
                          logo=logo,
                          defaultOptions=defaultOptions,
                          isFree=1,
                          license="Apache License 2.0",
                          pricing=pricing,
                          banned=banned,
                          parent='None',
                          currOwner='None',
                          owner='None')
    helper = PluginHelper()
    helper.createPluginSpace(globalVal.PLUGINS_DIR, key)
    helper.registerPlugin(key)
    return JsonResponse({'status':0})

@csrf_exempt
def savePlugin(request):
    id = request.POST.get('id', '')
    pluginName = request.POST.get('pluginName', '')
    developer = request.POST.get('developer', '')
    version = request.POST.get('version', '')
    copyright = request.POST.get('copyright', '')
    description = request.POST.get('description', '')
    keywords =  request.POST.get('keywords', '')
    logo =  request.POST.get('logo', '')
    defaultOptions =  request.POST.get('defaultOptions', '')
    pricing =  request.POST.get('pricing', '')
    banned =  request.POST.get('banned', '')
    Plugin.objects.filter(id=id).update(
        name=pluginName, 
        developer=developer, 
        pluginVersion=version,
        copyright=copyright,
        pluginDescription=description,
        keywords=keywords,
        logo=logo,
        defaultOptions=defaultOptions,
        pricing=pricing,
        banned=banned)
    return JsonResponse({'status':0})

def getAllPlugins(request):
    #name = request.session.get('name') # 从session中获取name?
    allPlugins = Plugin.objects.all().order_by('-lastupdate') 
    plugins = []
    for i in allPlugins:
      json_dict = {}
      json_dict['id'] = i.id
      json_dict['name'] = i.name
      json_dict['developer'] = i.developer
      json_dict['pluginVersion'] = i.pluginVersion
      json_dict['copyright'] = i.copyright
      json_dict['pluginDescription'] = i.pluginDescription
      json_dict['useCounting'] = i.useCounting
      json_dict['likeCounting'] = i.likeCounting
      json_dict['keywords'] = i.keywords
      json_dict['logo'] = i.logo
      json_dict['defaultOptions'] = i.defaultOptions
      json_dict['isFree'] = i.isFree
      json_dict['pricing'] = i.pricing
      json_dict['banned'] = i.banned
      json_dict['createDatetime'] = str(i.createDatetime)
      json_dict['lastupdate'] = str(i.lastupdate)
      json_dict['license'] = i.license
      plugins.append(json_dict)

    return JsonResponse(plugins,safe=False)

def getPlugin(request):
    pluginId = request.GET.get('pluginId', '')
    i = Plugin.objects.get(id=pluginId)
    json_dict = {}
    json_dict['id'] = i.id
    json_dict['name'] = i.name
    json_dict['developer'] = i.developer
    json_dict['pluginVersion'] = i.pluginVersion
    json_dict['copyright'] = i.copyright
    json_dict['pluginDescription'] = i.pluginDescription
    json_dict['useCounting'] = i.useCounting
    json_dict['likeCounting'] = i.likeCounting
    json_dict['keywords'] = i.keywords
    json_dict['logo'] = i.logo
    json_dict['defaultOptions'] = i.defaultOptions
    json_dict['isFree'] = i.isFree
    json_dict['pricing'] = i.pricing
    json_dict['banned'] = i.banned
    json_dict['createDatetime'] = str(i.createDatetime)
    json_dict['lastupdate'] = str(i.lastupdate)
    json_dict['license'] = i.license
    return JsonResponse(json_dict)

@csrf_exempt
def deletePlugin(request):
    id = request.POST.get('id', '')
    Plugin.objects.filter(id=id).delete()
    helper = PluginHelper()
    helper.removePluginSpace(globalVal.PLUGINS_DIR, id)
    helper.writeoffPlugin(id)
    return JsonResponse({'status':'0'})

def zip_file_path(plugins_folder, plugin_folder):
    f = zipfile.ZipFile(plugins_folder + os.sep + plugin_folder + ".zip", 'w', zipfile.ZIP_DEFLATED)
    filelists = []
    get_zip_file(plugins_folder + os.sep + plugin_folder, filelists)
    for file in filelists:
        fpath = file.replace(plugins_folder, '')
        f.write(file, fpath)
    f.close()
    return plugins_folder + os.sep + plugin_folder + ".zip"

# zip one file to zip package
def zip_file(plugins_folder, plugin_folder, file_path, file_name):
    f = zipfile.ZipFile(plugins_folder + os.sep + plugin_folder + os.sep + file_name + ".zip", 'w', zipfile.ZIP_DEFLATED)
    f.write(plugins_folder + os.sep + file_path, file_path)
    f.close()
    return plugins_folder + os.sep + plugin_folder + os.sep + file_name + ".zip"

@csrf_exempt
def downloadZipFile(request):
    pluginId = request.POST.get('oid', '')
    path = request.POST.get('path', '')
    filename = request.POST.get('filename', '')
    zipfilepath = ""
    if os.path.isfile(globalVal.PLUGINS_DIR + os.sep + path):
        zipfilepath = zip_file(globalVal.PLUGINS_DIR, pluginId, path, filename)
    elif os.path.isdir(globalVal.PLUGINS_DIR + os.sep + path):
        zipfilepath = zip_file_path(globalVal.PLUGINS_DIR, path)
    if os.path.isfile(zipfilepath):
        file = open(zipfilepath, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response["Content-disposition"] = "attachment;filename={0}".format(filename+".zip")
        return response
    return JsonResponse({ 'status' : '1' })

@csrf_exempt
def getPluginDirectory(request):
    helper = PluginHelper()
    pluginId = request.POST.get('pluginId', '')
    menuItems = helper.pluginDirectory(globalVal.PLUGINS_DIR, pluginId)
    return HttpResponse(json.dumps(menuItems, default=lambda o: o.__dict__, sort_keys=True, indent=4), content_type="application/json")

@csrf_exempt
def uploadFiles(request):
    request.encoding = "utf-8"
    file = request.FILES.get("file", None)
    fileName = request.POST.get("filename", "",)
    targetPath = request.POST.get("path", "",)
    fileName = unquote(fileName)
    targetPath = unquote(targetPath)
    if file is None:
        return JsonResponse({ 'status' : '1', 'message': '文件不存在' })
    else:
        path = globalVal.PLUGINS_DIR + os.sep + targetPath
        if os.path.isfile(path): 
            with open(os.path.dirname(path) + os.sep + fileName, 'wb+') as f:
                for chunk in file.chunks():
                    f.write(chunk)
        elif os.path.isdir(path):
            with open(path + os.sep + fileName, 'wb+') as f:
                for chunk in file.chunks():
                    f.write(chunk)
    return JsonResponse({ 'status' : '0' })

@csrf_exempt
def removeFileFolder(request):
    path = request.POST.get('context', '')
    helper = PluginHelper()
    helper.removeFileFolder(path)
    return JsonResponse({ 'status' : '0' })

@csrf_exempt
def newFileFolder(request):
    parentPath = request.POST.get('parentFolder', '')
    name = request.POST.get('name', '')
    type = request.POST.get('type', '')
    helper = PluginHelper()
    helper.newFolderFile(parentPath, type, name)
    return JsonResponse({ 'status' : '0' })

@csrf_exempt
def renameFileFolder(request):
    oldFolderFileName = request.POST.get('oldFolderFileName', '')
    oldName = request.POST.get('oldName', '')
    parentFolder = oldFolderFileName.replace(oldName, '')
    newFolderFileName = request.POST.get('newFolderFileName', '')
    helper = PluginHelper()
    try:
        helper.renameFolderFile(oldFolderFileName, parentFolder, newFolderFileName)
        return JsonResponse({ 'status' : '0' })
    except FileExistsError as e:
        return JsonResponse({ 'status' : '1' })

@csrf_exempt
def getDistDirectories(request):
    dirname = request.POST.get('dirname', '')
    pluginId = request.POST.get('pluginId', '')
    helper = PluginHelper()
    srcDirs = helper.getAllDirectories(globalVal.PLUGINS_DIR, pluginId, dirname)
    return HttpResponse(json.dumps(srcDirs, default=lambda o: o.__dict__, sort_keys=True, indent=4), content_type="application/json")

@csrf_exempt
def copyMoveTo(request):
    srcFolder = request.POST.get('srcFolder', '')
    distFolder = request.POST.get('distFolder', '')
    operation = request.POST.get('operation', '')
    helper = PluginHelper()
    helper.copyMoveTo(globalVal.PLUGINS_DIR + os.sep + srcFolder, globalVal.PLUGINS_DIR + os.sep + distFolder, operation)
    return JsonResponse({ 'status' : '0' })

@csrf_exempt
def openFile(request):
    filePath = request.POST.get('filePath', '')
    helper = PluginHelper()
    fileContent = helper.openFile(globalVal.PLUGINS_DIR + os.sep + filePath)
    return JsonResponse({ 'status' : '0', 'fileContent' : fileContent })

@csrf_exempt
def saveFile(request):
    filePath = request.POST.get('filePath', '')
    fileContent = request.POST.get('fileContent', '')
    helper = PluginHelper()
    helper.saveFile(globalVal.PLUGINS_DIR + os.sep + filePath, fileContent);
    return JsonResponse({ 'status' : '0' })

def start(request):
    a = request.GET
    start = a.get('start')
    print(start)
    return JsonResponse({'status':'启动成功'})

def stop(request):
    a = request.GET
    stop = a.get('stop')
    print(stop)
    return JsonResponse({'status':'停止成功'})
    
from django.urls import path
from . import views

urlpatterns = [
    path('', views.pluginIndex),
    path('pluginEditor', views.pluginEditor),
    path('start', views.start),
    path('stop', views.stop),
    path('service/s0/api0/', views.createPlugin), # insert
    path('service/s0/api1/', views.getAllPlugins), # query all
    path('service/s0/api2/', views.getPlugin), # query one 
    path('service/s0/api3/', views.savePlugin), # update
    path('service/s0/api4/', views.deletePlugin), # delete
    path('service/s0/api5/', views.uploadPluginZipFile), # upload a zip file with python plugin files
    path('service/s0/api6/', views.downloadPluginZipFile), # download a zip file with python plugin files all in one
    path('service/s0/api7/', views.getPluginDirectory), # get plugin folder directory
    path('service/s0/api8/', views.downloadZipFile), # download one file or folder
    path('service/s0/api9/', views.removeFileFolder), # remove one file or folder
    path('service/s0/api10/', views.uploadFiles), # upload one or more files
    path('service/s0/api11/', views.newFileFolder), # create one folder or file
    path('service/s0/api12/', views.renameFileFolder), # rename one folder or file
    path('service/s0/api13/', views.getDistDirectories), # get distination directories
    path('service/s0/api14/', views.copyMoveTo), # copy source file or folder to distination directories
    path('service/s0/api15/', views.openFile), # open a file to edit
    path('service/s0/api16/', views.saveFile), # save a file automatically
]

#print("master程序第三个执行:urls.py")

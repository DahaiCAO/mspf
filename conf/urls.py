"""PaaSPluginFwk URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from PluginMaster import views
from django.conf.urls import url, include
import os
from django.conf import settings
from importlib import import_module

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('index.html', views.index),
    path('example/', views.pluginExample),
    path('docs/', views.docs),
    path('download/', views.download),

    url(r'^master/', include('PluginMaster.urls')),
    #url(r'^aaa/', include('plugins.SP_1415482859229159424.urls')),
]

# dynamic add plugins to url patterns
for app in settings.INSTALLED_APPS:
    if app != 'PluginMaster':
        try:
            _module = import_module('%s.urls' % app)
        except:
            pass
        else:
            urlpatterns.append(url(r'^%s/' %app, include('%s.urls' % app)))

for app in urlpatterns:
    print(app)

#print("m主程序第三个执行:urls.py")

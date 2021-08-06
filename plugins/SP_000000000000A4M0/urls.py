from django.urls import path
from . import views
# This file is used to defined RESTFul APIs:
# path('hello/', views.hello)，that is http://localhost:port/hello,
# direct to views.hello method，views.hello defined in views.py。
# Fifthly run:urls.py
urlpatterns = [
    path('', views.pluginIndex),
    path('hello/', views.hello),
]

from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt

# When getting requests from browers using ajax :views.py

# this file is similar to controllers in srpingmvc or springboot
# Create your views here.
def pluginIndex(request):
    return HttpResponse('Hi, this is a plugin!')

def hello(request):
    return HttpResponse('Hello, This is Mspf!')


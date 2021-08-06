from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
import time

# When getting requests from browers using ajax :views.py

# this file is similar to controllers in srpingmvc or springboot
# Create your views here.
def pluginIndex(request):
    import threading
    # 1 获取线程ID,NAME
    t = threading.currentThread()
    #线程ID
    print('Thread id : %d' % t.ident)
    #线程NAME
    print('Thread name : %s' % t.getName())
    return HttpResponse('Hi, this is a plugin!')

def hello(request):
    import threading
    # 1 获取线程ID,NAME
    t = threading.currentThread()
    time.sleep(10)
    #线程ID
    print('Thread id : %d' % t.ident)
    #线程NAME
    print('Thread name : %s' % t.getName())
    return HttpResponse('Hi, This is Cao Dahai!')


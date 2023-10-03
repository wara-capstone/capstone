from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from py_eureka_client import eureka_client

from django.conf import settings


def health(request):
    return JsonResponse({"status": "UP"})


def register_service():
    instance_port = int(settings.EUREKA_SERVICE['instance']['port']['$'])
    eureka_client.init(eureka_server=settings.EUREKA_SERVER_URL,
                    app_name=settings.EUREKA_SERVICE['instance']['app'],
                    instance_port=instance_port)

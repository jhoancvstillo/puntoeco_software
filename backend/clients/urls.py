from rest_framework.routers import DefaultRouter
from .views import ClientsViewSet, ConductorViewSet
from django.urls import path, include
from django.http import JsonResponse

def clients_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Clients API. Use specific endpoints to access data."
    })

router = DefaultRouter()
router.register(r'clients', ClientsViewSet, basename='clients')
router.register(r'conductor', ConductorViewSet, basename='conductor')
router.register(r'clientsnormal', ClientsViewSet, basename='clientsnormal')


urlpatterns = [
    path('', include(router.urls)),
    path('', clients_root_view, name='clients-root'),
]
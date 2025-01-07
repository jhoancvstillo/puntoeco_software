from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CombustibleViewSet

router = DefaultRouter()
router.register(r'combustible', CombustibleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

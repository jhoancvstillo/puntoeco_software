from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VertederoViewSet

router = DefaultRouter()
router.register(r'vertedero', VertederoViewSet, basename='vertedero')

urlpatterns = [
    path('', include(router.urls)),
]

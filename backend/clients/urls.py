from rest_framework.routers import DefaultRouter
from .views import ClientsViewSet, ConductorViewSet

router = DefaultRouter()
router.register(r'clients', ClientsViewSet, basename='clients')
router.register(r'conductor', ConductorViewSet, basename='conductor')
router.register(r'clientsnormal', ClientsViewSet, basename='clientsnormal')

urlpatterns = router.urls

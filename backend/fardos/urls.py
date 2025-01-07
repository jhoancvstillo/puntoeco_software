from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductionViewSet, DispatchViewSet, DebtViewSet

router = DefaultRouter()
router.register(r'productions', ProductionViewSet, basename='productions')
router.register(r'dispatches', DispatchViewSet, basename='dispatches')
router.register(r'debts', DebtViewSet, basename='debts')

urlpatterns = [
    path('', include(router.urls)),
]

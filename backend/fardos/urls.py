from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductionViewSet, DispatchViewSet, DebtViewSet
from django.http import JsonResponse

def fardos_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Fardos API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'productions', ProductionViewSet, basename='productions')
router.register(r'dispatches', DispatchViewSet, basename='dispatches')
router.register(r'debts', DebtViewSet, basename='debts')

urlpatterns = [
    path('', include(router.urls)),
    path('', fardos_root_view, name='fardos-root'),
]

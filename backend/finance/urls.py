from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TransactionViewSet
from .views import ClassificationViewSet, SubcategoryViewSet
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse


def finance_root_view(request):
    return JsonResponse({
        "message": "Welcome to the Finance API. Use specific endpoints to access data."
    })
    

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'classifications', ClassificationViewSet, basename='classification')
router.register(r'subcategories', SubcategoryViewSet, basename='subcategory')
    
urlpatterns = [
    path('', finance_root_view, name='finance-root'),  # Vista personalizada para la raíz
    path('', include(router.urls)),  # Enrutador para las rutas secundarias
]

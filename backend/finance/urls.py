from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TransactionViewSet
from .views import ClassificationViewSet, SubcategoryViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'classifications', ClassificationViewSet, basename='classification')
router.register(r'subcategories', SubcategoryViewSet, basename='subcategory')

urlpatterns = [
    path('', include(router.urls)),
]

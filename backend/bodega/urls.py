from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, MarcaViewSet, ModeloViewSet, ProductoViewSet, StockViewSet



router = DefaultRouter()
router.register('categorias', CategoriaViewSet)
router.register('marcas', MarcaViewSet)
router.register('modelos', ModeloViewSet)
router.register('productos', ProductoViewSet)
router.register('stock', StockViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
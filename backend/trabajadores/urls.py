
from rest_framework.routers import DefaultRouter
from .views import (
    TrabajadorViewSet, AsistenciaViewSet, PagoBeneficioViewSet, NotaViewSet,
    DocumentoViewSet, VacacionPermisoViewSet, CapacitacionViewSet, IncidenteViewSet
)

router = DefaultRouter()
router.register(r'trabajadores', TrabajadorViewSet, basename='trabajador')
router.register(r'asistencias', AsistenciaViewSet, basename='asistencia')
router.register(r'pagos', PagoBeneficioViewSet, basename='pago')
router.register(r'notas', NotaViewSet, basename='nota')
router.register(r'documentos', DocumentoViewSet, basename='documento')
router.register(r'vacaciones-permisos', VacacionPermisoViewSet, basename='vacacion-permiso')
router.register(r'capacitaciones', CapacitacionViewSet, basename='capacitacion')
router.register(r'incidentes', IncidenteViewSet, basename='incidente')

urlpatterns = router.urls

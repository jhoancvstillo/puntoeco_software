from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static


# Registrar el ViewSet en el router
router = DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')

if settings.DEBUG:
    print("STATICFILES_DIRS[0]:", settings.STATICFILES_DIRS[0])  # Verifica la ruta


# Definir urlpatterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('finance/', include('finance.urls')),  # Incluye las URLs de la aplicación 'finance'
    path('clients/', include('clients.urls')),  # Incluye las URLs de la aplicación 'clients'
    path('hr/', include('hr.urls')),  # Incluye las URLs de la aplicación 'hr'
    path('bodega/', include('bodega.urls')),  # Incluye las URLs de la aplicación 'bodega'
    path('trabajadores/', include('trabajadores.urls')),  # Incluye las URLs de la aplicación 'trabajadores'
    path('pesajes/', include('pesajes.urls')),  # Incluye las URLs de la aplicación 'pesajes'
    path('cotizaciones/', include('cotizaciones.urls')),  # Incluye las URLs de la aplicación 'cotizaciones'
    path('destinofinal/', include('destinofinal.urls')),  # Incluye las URLs de la aplicación 'destinofinal'
    path('combustible/', include('combustible.urls')),  # Incluye las URLs de la aplicación 'combustible'
    path('fardos/', include('fardos.urls')),  # Incluye las URLs de la aplicación 'fardos'
    path('vertedero/', include('vertedero.urls')),  # Incluye las URLs de la aplicación 'vertedero'
    path('users/', include('users.urls')),  # Incluye las URLs de la aplicación 'users'
]

# Añadir las rutas generadas por el router
urlpatterns += router.urls

# Configuración para servir archivos estáticos y multimedia durante el desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    if settings.MEDIA_URL and settings.MEDIA_ROOT:
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


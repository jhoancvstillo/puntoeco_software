
from django.contrib import admin
from django.urls import path, re_path, include
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    # path('hello_world/', views.hello_world),
    re_path('login/', views.login),
    re_path('register/', views.register),
    re_path('profile/', views.profile),
    re_path('delete/', views.delete),
    path('finance/', include('finance.urls')),  # Incluye las URLs de la aplicación 'finance'
    path('clients/', include('clients.urls')),  # Incluye las URLs de la aplicación 'clients'
]

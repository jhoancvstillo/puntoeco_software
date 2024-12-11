from django.urls import path


from .views import get_clients, create_client, client_detail, update_client, delete_client

urlpatterns = [

    path('getClients/', get_clients),
    path('create/', create_client),
    path('profile_<int:pk>/', client_detail),  # GET, PUT, DELETE para un cliente específico
    path('update/profile_<int:pk>/', update_client),
    path('delete/profile_<int:pk>/', delete_client),
]


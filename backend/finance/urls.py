from django.urls import path
from .views import finance_create
from .views import finance_list


urlpatterns = [
    path('create/', finance_create),
    path('list/', finance_list),
]
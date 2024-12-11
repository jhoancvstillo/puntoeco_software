from django.contrib import admin
from .models import Transaction, Classification, Subcategory

admin.site.register(Transaction)
admin.site.register(Classification)
admin.site.register(Subcategory)

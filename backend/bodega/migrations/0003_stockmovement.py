# Generated by Django 5.1.2 on 2025-01-13 08:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bodega', '0002_remove_producto_modelo_delete_modelo'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='StockMovement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('movement_type', models.CharField(choices=[('add', 'Agregar'), ('remove', 'Retirar')], max_length=6)),
                ('quantity', models.PositiveIntegerField()),
                ('observation', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos', to='bodega.producto')),
                ('stock_afectado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='movimientos', to='bodega.stock')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='movimientos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
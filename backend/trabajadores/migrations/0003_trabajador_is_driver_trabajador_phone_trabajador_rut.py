# Generated by Django 5.1.3 on 2024-12-30 14:07

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trabajadores', '0002_pagobeneficio'),
    ]

    operations = [
        migrations.AddField(
            model_name='trabajador',
            name='is_driver',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='trabajador',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='trabajador',
            name='rut',
            field=models.CharField(default=django.utils.timezone.now, max_length=20),
            preserve_default=False,
        ),
    ]
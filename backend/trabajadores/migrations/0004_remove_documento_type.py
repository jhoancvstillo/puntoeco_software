# Generated by Django 5.1.2 on 2025-01-11 04:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trabajadores', '0003_trabajador_is_driver_trabajador_phone_trabajador_rut'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='documento',
            name='type',
        ),
    ]

# Generated by Django 5.1.2 on 2025-01-10 16:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bodega', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='producto',
            name='modelo',
        ),
        migrations.DeleteModel(
            name='Modelo',
        ),
    ]
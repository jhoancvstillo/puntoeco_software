# Generated by Django 5.1.2 on 2025-01-14 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('combustible', '0003_alter_combustible_conductor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='combustible',
            name='litros',
            field=models.DecimalField(decimal_places=5, max_digits=10),
        ),
        migrations.AlterField(
            model_name='combustible',
            name='valor_litro',
            field=models.DecimalField(decimal_places=5, max_digits=10),
        ),
    ]

# Generated by Django 5.1.3 on 2025-01-02 04:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacion',
            name='file',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
# Generated by Django 5.1.3 on 2025-01-07 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('destinofinal', '0003_remove_certificado_periodo_certificado_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='plasticodetalle',
            name='cantidad_kg',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='certificado',
            name='folio',
            field=models.CharField(max_length=20),
        ),
    ]

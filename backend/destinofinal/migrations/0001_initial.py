# Generated by Django 5.1.3 on 2025-01-02 05:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0005_conductor'),
    ]

    operations = [
        migrations.CreateModel(
            name='Certificado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('folio', models.CharField(max_length=20, unique=True)),
                ('categoria', models.CharField(choices=[('Metales', 'Metales'), ('Plásticos', 'Plásticos'), ('Fibras', 'Fibras'), ('Fitosanitarios', 'Fitosanitarios')], max_length=20)),
                ('numero_certificado', models.CharField(blank=True, max_length=20, null=True)),
                ('periodo', models.DateField(auto_now_add=True)),
                ('numero_guia', models.CharField(default='S/G', max_length=50)),
                ('destino_final', models.CharField(blank=True, max_length=255, null=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clients.clients')),
            ],
        ),
        migrations.CreateModel(
            name='FitosanitarioDetalle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad_01_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_025_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_05_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_1_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_2_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_3_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_4_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_5_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_10_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_15_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_20_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_25_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_30_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_60_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_100_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_200_l', models.IntegerField(blank=True, null=True)),
                ('cantidad_tapas_l', models.IntegerField(blank=True, null=True)),
                ('certificado', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='fitosanitario_detalle', to='destinofinal.certificado')),
            ],
        ),
        migrations.CreateModel(
            name='MaterialDetalle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('material', models.CharField(max_length=255)),
                ('cantidad_kg', models.FloatField()),
                ('certificado', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='material_detalle', to='destinofinal.certificado')),
            ],
        ),
        migrations.CreateModel(
            name='PlasticoDetalle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clasificacion_resinas', models.CharField(max_length=255)),
                ('certificado', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='plastico_detalle', to='destinofinal.certificado')),
            ],
        ),
    ]

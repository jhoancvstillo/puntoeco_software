# Generated by Django 5.1.3 on 2024-12-25 23:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0002_rename_cliente_clients'),
    ]

    operations = [
        migrations.AddField(
            model_name='clients',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='clients',
            name='delivery_frequency',
            field=models.CharField(choices=[('daily', 'Diario'), ('weekly', 'Semanal'), ('monthly', 'Mensual'), ('occasional', 'Ocasional')], default='occasional', max_length=50),
        ),
        migrations.AddField(
            model_name='clients',
            name='last_delivery_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='clients',
            name='preferred_materials',
            field=models.TextField(blank=True, help_text='Lista de materiales entregados comúnmente, separados por comas', null=True),
        ),
        migrations.AddField(
            model_name='clients',
            name='rut',
            field=models.CharField(default='99999999-9', help_text='Formato esperado: 12345678-9', max_length=12, unique=True),
        ),
        migrations.AddField(
            model_name='clients',
            name='total_earnings',
            field=models.DecimalField(decimal_places=0, default=0, help_text='Total pagado al cliente en pesos chilenos', max_digits=12),
        ),
        migrations.AddField(
            model_name='clients',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

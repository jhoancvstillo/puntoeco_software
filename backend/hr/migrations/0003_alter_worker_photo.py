# Generated by Django 5.1.3 on 2025-01-07 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0002_alter_worker_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worker',
            name='photo',
            field=models.URLField(blank=True, null=True),
        ),
    ]

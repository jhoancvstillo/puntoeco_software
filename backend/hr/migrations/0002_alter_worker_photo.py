# Generated by Django 5.1.3 on 2025-01-07 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worker',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='workers/photos/'),
        ),
    ]

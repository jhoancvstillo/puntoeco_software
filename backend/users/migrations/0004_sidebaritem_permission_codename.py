# Generated by Django 5.1.2 on 2025-01-12 05:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_sidebaritem_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='sidebaritem',
            name='permission_codename',
            field=models.CharField(blank=True, help_text='Codename del permiso que habilita este SidebarItem.', max_length=100, null=True, unique=True),
        ),
    ]
# Generated by Django 4.1.7 on 2023-09-16 18:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userauth', '0002_user_theme'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='theme',
        ),
    ]

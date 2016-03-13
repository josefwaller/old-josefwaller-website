# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-13 20:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainsite', '0003_auto_20151223_0021'),
    ]

    operations = [
        migrations.CreateModel(
            name='DialogSave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dialogJSON', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='GameSave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spritesID', models.IntegerField()),
                ('musicID', models.IntegerField()),
                ('dialogID', models.IntegerField()),
                ('levelID', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='LevelSave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('levelJSON', models.CharField(max_length=2500)),
            ],
        ),
        migrations.CreateModel(
            name='MusicSave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notesJSON', models.CharField(max_length=1000)),
                ('settingsJSON', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='SpriteSetSave',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('spritesJSON', models.CharField(max_length=68000)),
                ('colorsJSON', models.CharField(max_length=800)),
            ],
        ),
        migrations.AlterField(
            model_name='evolutionsave',
            name='asteroids',
            field=models.CharField(max_length=2500),
        ),
        migrations.AlterField(
            model_name='evolutionsave',
            name='genes',
            field=models.CharField(max_length=2000),
        ),
        migrations.AlterField(
            model_name='evolutionsave',
            name='starting_coords',
            field=models.CharField(max_length=30),
        ),
    ]

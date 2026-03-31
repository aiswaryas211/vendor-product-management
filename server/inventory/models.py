# server/inventory/models.py

from django.db import models
from django.contrib.auth.models import User

class Item(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    details = models.TextField()
    price = models.FloatField()
    stock = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
from django.db import models

class Clients(models.Model):
    name = models.CharField(max_length=100)
    mail = models.EmailField(unique=True)
    phoneNumber = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return self.name
    


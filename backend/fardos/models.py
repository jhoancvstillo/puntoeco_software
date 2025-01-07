from django.db import models

class Production(models.Model):
    date = models.DateField()
    bales = models.PositiveIntegerField()
    estimated_weight = models.FloatField()

    def save(self, *args, **kwargs):
        # Calculate estimated weight on save
        self.estimated_weight = self.bales * 230  # Assuming BALE_WEIGHT = 230
        super().save(*args, **kwargs)

class Dispatch(models.Model):
    date = models.DateField()
    bales = models.PositiveIntegerField()
    weight = models.FloatField()
    destination = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # Calculate weight on save
        self.weight = self.bales * 230  # Assuming BALE_WEIGHT = 230
        super().save(*args, **kwargs)

class Debt(models.Model):
    date = models.DateField()
    reported_weight = models.FloatField()
    accepted_weight = models.FloatField()
    pending_weight = models.FloatField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Calculate pending weight on save
        self.pending_weight = self.reported_weight - self.accepted_weight
        super().save(*args, **kwargs)
    
    
    @classmethod
    def get_total_pending_weight(cls):
        """Calculate the total pending weight across all Debt records."""
        return cls.objects.aggregate(total=models.Sum('pending_weight'))['total'] or 0


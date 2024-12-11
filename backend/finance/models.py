from django.db import models

#Model for transaction (Income/Expense)
class TransactionType(models.TextChoices):
    EXPENSE = 'Expense', 'Expense'
    INCOME = 'Income', 'Income'


#Model for classification of transaction
class Classification(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# Model for subcategories, which are related to a main classification
class Subcategory(models.Model):
    classification = models.ForeignKey(Classification, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.classification.name} - {self.name}"

# Model for the transaction frequency
class Frequency(models.TextChoices):
    REGULAR = 'Regular', 'Regular'
    EXTRAORDINARY = 'Extraordinary', 'Extraordinary'

# Main Transaction model
class Transaction(models.Model):
    date_time = models.DateTimeField()
    transaction_type = models.CharField(
        max_length=7, 
        choices=TransactionType.choices
    )
    classification = models.ForeignKey(Classification, on_delete=models.PROTECT)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.PROTECT)
    frequency = models.CharField(
        max_length=13, 
        choices=Frequency.choices
    )
    comment = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.date_time} - {self.transaction_type} - {self.classification} - {self.subcategory} - ${self.price}"

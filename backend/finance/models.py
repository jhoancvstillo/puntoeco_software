from django.db import models

# Model for classification of transactions
class Classification(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Model for subcategories, which are related to a main classification
class Subcategory(models.Model):
    name = models.CharField(max_length=100)
    classification = models.ForeignKey(Classification, on_delete=models.CASCADE, related_name="subcategories")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.classification.name} - {self.name}"

# Model for transaction type
class TransactionType(models.TextChoices):
    EXPENSE = 'Expense', 'Expense'
    INCOME = 'Income', 'Income'

# Main Transaction model
class Transaction(models.Model):
    date_time = models.DateTimeField()
    transaction_type = models.CharField(
        max_length=7, 
        choices=TransactionType.choices
    )
    classification = models.ForeignKey(Classification, on_delete=models.PROTECT, related_name="transactions")
    subcategory = models.ForeignKey(Subcategory, on_delete=models.PROTECT, related_name="transactions")
    comment = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.date_time} - {self.transaction_type} - {self.classification.name} - {self.subcategory.name} - ${self.price}"

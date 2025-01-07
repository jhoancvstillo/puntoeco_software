from rest_framework import serializers
from .models import Transaction, Classification, Subcategory

class ClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classification
        fields = '__all__'

class SubcategorySerializer(serializers.ModelSerializer):
    classification = serializers.PrimaryKeyRelatedField(queryset=Classification.objects.all())

    class Meta:
        model = Subcategory
        fields = '__all__'


class TransactionSerializer(serializers.ModelSerializer):
    classification = ClassificationSerializer(read_only=True)
    subcategory = SubcategorySerializer(read_only=True)
    
    classification_id = serializers.PrimaryKeyRelatedField(
        queryset=Classification.objects.all(),
        source='classification',
        write_only=True
    )
    subcategory_id = serializers.PrimaryKeyRelatedField(
        queryset=Subcategory.objects.all(),
        source='subcategory',
        write_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            'id', 'date_time', 'transaction_type', 'classification', 'subcategory', 
            'classification_id', 'subcategory_id', 'comment', 'price'
        ]

    def validate(self, data):
        # Ensure the subcategory belongs to the selected classification
        if data.get('subcategory') and data.get('classification'):
            if data['subcategory'].classification != data['classification']:
                raise serializers.ValidationError({
                    "subcategory_id": "The subcategory does not belong to the selected classification."
                })
        return data

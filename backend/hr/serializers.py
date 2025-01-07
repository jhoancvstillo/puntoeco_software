from rest_framework import serializers
from .models import Worker, AttendanceRecord, Document, Incident, Evaluation, Payment, Training, VacationOrPermission

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    total_paid = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = '__all__'

class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = '__all__'

class VacationOrPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacationOrPermission
        fields = '__all__'

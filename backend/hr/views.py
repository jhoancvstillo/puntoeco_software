from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Worker, AttendanceRecord, Document, Incident, Evaluation, Payment, Training, VacationOrPermission
from .serializers import (
    WorkerSerializer, AttendanceRecordSerializer, DocumentSerializer, 
    IncidentSerializer, EvaluationSerializer, PaymentSerializer, 
    TrainingSerializer, VacationOrPermissionSerializer
)

from .permissions import HasHRAccess

class WorkerViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

    @action(detail=True, methods=['get'])
    def attendances(self, request, pk=None):
        """
        Retorna todas las asistencias de este trabajador
        en /hr/workers/<pk>/attendances/
        """
        worker = self.get_object()
        attendances = worker.attendances.all()
        serializer = AttendanceRecordSerializer(attendances, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def evaluations(self, request, pk=None):
        """
        Retorna todas las evaluaciones (notas) de este trabajador
        en /hr/workers/<pk>/evaluations/
        """
        worker = self.get_object()
        evaluations = worker.evaluations.all()
        serializer = EvaluationSerializer(evaluations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def documents(self, request, pk=None):
        """
        Retorna todos los documentos de este trabajador
        en /hr/workers/<pk>/documents/
        """
        worker = self.get_object()
        documents = worker.documents.all()
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def incidents(self, request, pk=None):
        """
        Retorna todos los incidentes de este trabajador
        en /hr/workers/<pk>/incidents/
        """
        worker = self.get_object()
        incidents = worker.incidents.all()
        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        """
        Retorna todos los pagos de este trabajador
        en /hr/workers/<pk>/payments/
        """
        worker = self.get_object()
        payments = worker.payments.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def trainings(self, request, pk=None):
        """
        Retorna todos los entrenamientos de este trabajador
        en /hr/workers/<pk>/trainings/
        """
        worker = self.get_object()
        trainings = worker.trainings.all()
        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def vacations_permissions(self, request, pk=None):
        """
        Retorna todas las vacaciones o permisos de este trabajador
        en /hr/workers/<pk>/vacations_permissions/
        """
        worker = self.get_object()
        vacations_permissions = worker.vacations_permissions.all()
        serializer = VacationOrPermissionSerializer(vacations_permissions, many=True)
        return Response(serializer.data)


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

class DocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

class IncidentViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer

class EvaluationViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer

class VacationOrPermissionViewSet(viewsets.ModelViewSet):
    permission_classes = [HasHRAccess]  
    queryset = VacationOrPermission.objects.all()
    serializer_class = VacationOrPermissionSerializer


from rest_framework.viewsets import ModelViewSet
from .models import (
    Trabajador, Asistencia, PagoBeneficio, Nota, Documento,
    VacacionPermiso, Capacitacion, Incidente
)
from .serializers import (
    TrabajadorSerializer, AsistenciaSerializer, PagoBeneficioSerializer, NotaSerializer, 
    DocumentoSerializer, VacacionPermisoSerializer, CapacitacionSerializer, IncidenteSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


# Trabajador ViewSet
class TrabajadorViewSet(ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer

# Asistencia ViewSet
class AsistenciaViewSet(ModelViewSet):
    queryset = Asistencia.objects.all()
    serializer_class = AsistenciaSerializer

    @action(detail=False, methods=['get'], url_path='worker/(?P<worker_id>[^/.]+)')
    def get_worker_attendance(self, request, worker_id=None):
        """
        Retorna todas las asistencias de un trabajador específico.
        """
        asistencias = self.queryset.filter(worker_id=worker_id)
        serializer = self.get_serializer(asistencias, many=True)
        return Response(serializer.data)


# PagoBeneficio ViewSet
class PagoBeneficioViewSet(ModelViewSet):
    queryset = PagoBeneficio.objects.all()
    serializer_class = PagoBeneficioSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_payments(self, request, worker_id=None):
        if request.method == 'GET':
            pagos = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(pagos, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            pagos = self.queryset.filter(worker_id=worker_id)
            if not pagos.exists():
                return Response({"detail": "No se encontraron pagos para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for payment_data in data:
                payment_id = payment_data.get('id')
                if not payment_id:
                    return Response({"detail": "Cada pago debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                pago = pagos.filter(id=payment_id).first()
                if not pago:
                    return Response({"detail": f"El pago con ID {payment_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(pago, data=payment_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Pagos actualizados correctamente."}, status=status.HTTP_200_OK)

# Nota ViewSet
class NotaViewSet(ModelViewSet):
    queryset = Nota.objects.all()
    serializer_class = NotaSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_notes(self, request, worker_id=None):
        if request.method == 'GET':
            notas = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(notas, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            notas = self.queryset.filter(worker_id=worker_id)
            if not notas.exists():
                return Response({"detail": "No se encontraron notas para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for note_data in data:
                note_id = note_data.get('id')
                if not note_id:
                    return Response({"detail": "Cada nota debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                nota = notas.filter(id=note_id).first()
                if not nota:
                    return Response({"detail": f"La nota con ID {note_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(nota, data=note_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Notas actualizadas correctamente."}, status=status.HTTP_200_OK)

# Documento ViewSet
class DocumentoViewSet(ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_documents(self, request, worker_id=None):
        if request.method == 'GET':
            documentos = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(documentos, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            documentos = self.queryset.filter(worker_id=worker_id)
            if not documentos.exists():
                return Response({"detail": "No se encontraron documentos para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for document_data in data:
                document_id = document_data.get('id')
                if not document_id:
                    return Response({"detail": "Cada documento debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                documento = documentos.filter(id=document_id).first()
                if not documento:
                    return Response({"detail": f"El documento con ID {document_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(documento, data=document_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Documentos actualizados correctamente."}, status=status.HTTP_200_OK)

# VacacionPermiso ViewSet
class VacacionPermisoViewSet(ModelViewSet):
    queryset = VacacionPermiso.objects.all()
    serializer_class = VacacionPermisoSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_vacations(self, request, worker_id=None):
        if request.method == 'GET':
            vacaciones = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(vacaciones, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            vacaciones = self.queryset.filter(worker_id=worker_id)
            if not vacaciones.exists():
                return Response({"detail": "No se encontraron vacaciones/permisos para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for vacation_data in data:
                vacation_id = vacation_data.get('id')
                if not vacation_id:
                    return Response({"detail": "Cada vacación/permiso debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                vacacion = vacaciones.filter(id=vacation_id).first()
                if not vacacion:
                    return Response({"detail": f"La vacación/permiso con ID {vacation_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(vacacion, data=vacation_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Vacaciones/Permisos actualizados correctamente."}, status=status.HTTP_200_OK)

# Capacitacion ViewSet
class CapacitacionViewSet(ModelViewSet):
    queryset = Capacitacion.objects.all()
    serializer_class = CapacitacionSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_trainings(self, request, worker_id=None):
        if request.method == 'GET':
            capacitaciones = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(capacitaciones, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            capacitaciones = self.queryset.filter(worker_id=worker_id)
            if not capacitaciones.exists():
                return Response({"detail": "No se encontraron capacitaciones para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for training_data in data:
                training_id = training_data.get('id')
                if not training_id:
                    return Response({"detail": "Cada capacitación debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                capacitacion = capacitaciones.filter(id=training_id).first()
                if not capacitacion:
                    return Response({"detail": f"La capacitación con ID {training_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(capacitacion, data=training_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Capacitaciones actualizadas correctamente."}, status=status.HTTP_200_OK)

# Incidente ViewSet
class IncidenteViewSet(ModelViewSet):
    queryset = Incidente.objects.all()
    serializer_class = IncidenteSerializer

    @action(detail=False, methods=['get', 'post', 'put'], url_path='worker/(?P<worker_id>[^/.]+)')
    def manage_worker_incidents(self, request, worker_id=None):
        if request.method == 'GET':
            incidentes = self.queryset.filter(worker_id=worker_id)
            serializer = self.get_serializer(incidentes, many=True)
            return Response(serializer.data)

        if request.method == 'POST':
            data = request.data
            data['worker'] = worker_id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if request.method == 'PUT':
            incidentes = self.queryset.filter(worker_id=worker_id)
            if not incidentes.exists():
                return Response({"detail": "No se encontraron incidentes para este trabajador."}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            for incident_data in data:
                incident_id = incident_data.get('id')
                if not incident_id:
                    return Response({"detail": "Cada incidente debe incluir un ID."}, status=status.HTTP_400_BAD_REQUEST)

                incidente = incidentes.filter(id=incident_id).first()
                if not incidente:
                    return Response({"detail": f"El incidente con ID {incident_id} no pertenece al trabajador {worker_id}."}, status=status.HTTP_404_NOT_FOUND)

                serializer = self.get_serializer(incidente, data=incident_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"detail": "Incidentes actualizados correctamente."}, status=status.HTTP_200_OK)

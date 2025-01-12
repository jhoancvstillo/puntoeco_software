from rest_framework.viewsets import ModelViewSet
from .models import Conductor, Certificado
from .serializers import ConductorSerializer, CertificadoPesajeSerializer
from .utils import generate_pdf_ticket
from django.core.files.base import ContentFile
from .permissions import HasPesajesAccess

# ViewSet para Conductores
class ConductorViewSet(ModelViewSet):
    permission_classes = [HasPesajesAccess]
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer

class CertificadoPesajeViewSet(ModelViewSet):
    permission_classes = [HasPesajesAccess]
    queryset = Certificado.objects.all()
    serializer_class = CertificadoPesajeSerializer

    def perform_create(self, serializer):
        # 1) Guardar el certificado primero
        instance = serializer.save()

        # 2) Generar el PDF en memoria
        pdf_file = generate_pdf_ticket(instance)  # Asumimos que esta función devuelve un BytesIO

        # 3) Subir el PDF como FileField (pdf_ticket)
        instance.pdf_ticket.save(
            f"ticket_{instance.id}.pdf",
            ContentFile(pdf_file.getvalue()),
            save=True
        )
        # Con esto queda asociado el PDF generado al certificado.

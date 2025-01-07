from rest_framework.viewsets import ModelViewSet
from django.core.files.base import ContentFile
from .models import Cotizacion
from .serializers import CotizacionSerializer
from .utils import generate_pdf_cotizacion  # Importa la función que creaste

class CotizacionViewSet(ModelViewSet):
    queryset = Cotizacion.objects.prefetch_related('detalles').all()
    serializer_class = CotizacionSerializer

    def perform_create(self, serializer):
        # Guardar la cotización primero
        instance = serializer.save()
        
        # Generar el PDF con la función utilitaria
        pdf_file = generate_pdf_cotizacion(instance)
        
        # Guardar el PDF en el campo 'pdf_cotizacion'
        instance.pdf_cotizacion.save(
            f"cotizacion_{instance.id}.pdf",
            ContentFile(pdf_file.getvalue()),
            save=True
        )

from rest_framework.viewsets import ModelViewSet
from django.core.files.base import ContentFile
from .models import Certificado, PlasticoDetalle, FitosanitarioDetalle, MaterialDetalle
from .serializers import CertificadoSerializer, PlasticoDetalleSerializer, FitosanitarioDetalleSerializer, MaterialDetalleSerializer
from .utils import generate_pdf_certificado  # Función para generar PDF

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse

import io
import zipfile


class CertificadoViewSet(ModelViewSet):
    queryset = Certificado.objects.all()
    serializer_class = CertificadoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores del serializer:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def generate_pdf(self, request, pk=None):
        """
        Genera el PDF del certificado después de que se hayan agregado los detalles.
        """
        try:
            certificado = self.get_object()
            
            # Verifica si tiene un detalle asociado
            if not (
                hasattr(certificado, "material_detalle")
                or hasattr(certificado, "plastico_detalle")
                or hasattr(certificado, "fitosanitario_detalle")
            ):
                return Response(
                    {"error": "El certificado no tiene detalles asociados."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Genera el PDF
            pdf_file = generate_pdf_certificado(certificado)
            certificado.file.save(
                f"certificado_{certificado.id}.pdf",
                ContentFile(pdf_file.getvalue()),
                save=True,
            )
            
            serializer = self.get_serializer(certificado)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"No se pudo generar el PDF: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['post'])
    def generate_zip(self, request):
        fecha_inicio = request.data.get('fecha_inicio')
        fecha_final = request.data.get('fecha_final')
        client_id = request.data.get('client_id')

        if not (fecha_inicio and fecha_final and client_id):
            return Response({'error': 'Faltan datos'}, status=status.HTTP_400_BAD_REQUEST)

        certificados = Certificado.objects.filter(
            client_id=client_id,
            fecha__range=[fecha_inicio, fecha_final],
            file__isnull=False,
        )

        if not certificados.exists():
            return Response({'error': 'No se encontraron certificados'}, status=status.HTTP_404_NOT_FOUND)

        # Crear el archivo ZIP en memoria
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w') as zip_file:
            for certificado in certificados:
                if certificado.file and certificado.file.path:
                    try:
                        zip_file.write(
                            certificado.file.path,
                            arcname=f'certificado_{certificado.folio}_{certificado.categoria}.pdf'
                        )
                    except FileNotFoundError:
                        continue

        buffer.seek(0)

        response = HttpResponse(buffer, content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename=certificados.zip'
        return response


class PlasticoDetalleViewSet(ModelViewSet):
    queryset = PlasticoDetalle.objects.all()
    serializer_class = PlasticoDetalleSerializer


class FitosanitarioDetalleViewSet(ModelViewSet):
    queryset = FitosanitarioDetalle.objects.all()
    serializer_class = FitosanitarioDetalleSerializer


class MaterialDetalleViewSet(ModelViewSet):
    queryset = MaterialDetalle.objects.all()
    serializer_class = MaterialDetalleSerializer

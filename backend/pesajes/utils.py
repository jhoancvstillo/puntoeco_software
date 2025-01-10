from io import BytesIO
from django.template.loader import render_to_string
from weasyprint import HTML
from django.conf import settings
import os

def generate_pdf_ticket(certificado):
    
    image_path = os.path.join(settings.BASE_DIR, 'static/images/logo_nbg.png')
    absolute_path = f"file:///{image_path}"
    print("image_path", absolute_path)
    fecha = certificado.fecha.strftime("%d/%m/%Y")
    hora_ingreso = certificado.hora_ingreso.strftime("%H:%M")
    hora_salida = certificado.hora_salida.strftime("%H:%M")
    peso_1 = certificado.peso_1
    peso_2 = certificado.peso_2
    diff = peso_1 - peso_2
    print("fecha", fecha)


    
    context = {'certificado': certificado, 'fecha': fecha, 'hora_ingreso': hora_ingreso, 'hora_salida': hora_salida, 'peso_1': peso_1, 'peso_2': peso_2, 'diff': diff, 'image_path': absolute_path}
    
    template = render_to_string('pesajes.html', context=context)
    pdf_file = BytesIO()
    HTML(string=template).write_pdf(pdf_file)
    pdf_file.seek(0)
    return pdf_file  # Devuelve el PDF como BytesIO


    # dispatch_guide = models.CharField(max_length=20, null=True, blank=True)  # Guía de despacho
    # transaction = models.CharField(max_length=50, null=True, blank=True)    # Tipo de transacción
    # transaction_other = models.CharField(max_length=50, null=True, blank=True)  # Otra transacción opcional
    # tipo_camion = models.CharField(max_length=50)
    # cliente = models.ForeignKey(
    #     Clients,
    #     on_delete=models.CASCADE,
    #     related_name="certificados"
    # )
    # codigo_producto = models.CharField(max_length=50)
    # # Reemplazamos la FK a Vehiculo por un simple CharField (patente):
    # patente = models.CharField(max_length=10, blank=True, null=True)
    # conductor = models.ForeignKey(
    #     Conductor,
    #     on_delete=models.CASCADE,
    #     related_name="certificados"
    # )
    # fecha = models.DateField()
    # hora_ingreso = models.TimeField()
    # hora_salida = models.TimeField()
    # peso_1 = models.DecimalField(max_digits=10, decimal_places=2)
    # peso_2 = models.DecimalField(max_digits=10, decimal_places=2)
    # pdf_ticket = models.FileField(upload_to="tickets/", null=True, blank=True)


    # def __str__(self):
    #     return f"Certificado {self.codigo_producto} - {self.cliente.name}"

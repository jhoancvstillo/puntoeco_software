from io import BytesIO
from django.template.loader import render_to_string
from weasyprint import HTML
from django.conf import settings
import os

def generate_pdf_ticket(certificado):
    
    image_path_logo = os.path.join(settings.BASE_DIR, 'static/images/logo_nbg.png')
    absolute_path = f"file:///{image_path_logo}"
    timbre_1 = os.path.join(settings.BASE_DIR, 'static/images/timbre1.jpg')
    timbre_2 = os.path.join(settings.BASE_DIR, 'static/images/timbre2.jpg')
    timbre_3 = os.path.join(settings.BASE_DIR, 'static/images/timbre3.jpg')
    absolute_path_timbre_1 = f"file:///{timbre_1}"
    absolute_path_timbre_2 = f"file:///{timbre_2}"
    absolute_path_timbre_3 = f"file:///{timbre_3}"
    
    
    fecha = certificado.fecha.strftime("%d/%m/%Y")
    hora_ingreso = certificado.hora_ingreso.strftime("%H:%M")
    hora_salida = certificado.hora_salida.strftime("%H:%M")
    peso_1 = certificado.peso_1
    peso_2 = certificado.peso_2
    diff = peso_1 - peso_2
    print("fecha", fecha)


    
    context = {'certificado': certificado, 'fecha': fecha, 'hora_ingreso': hora_ingreso, 'hora_salida': hora_salida, 'peso_1': peso_1, 'peso_2': peso_2, 'diff': diff, 'image_path': absolute_path, 'timbre_1': absolute_path_timbre_1, 'timbre_2': absolute_path_timbre_2, 'timbre_3': absolute_path_timbre_3}
    
    template = render_to_string('pesajes.html', context=context)
    pdf_file = BytesIO()
    HTML(string=template).write_pdf(pdf_file)
    pdf_file.seek(0)
    return pdf_file  # Devuelve el PDF como BytesIO


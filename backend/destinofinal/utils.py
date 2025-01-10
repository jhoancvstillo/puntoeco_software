from io import BytesIO
from django.template.loader import render_to_string
from weasyprint import HTML
from destinofinal.models import FitosanitarioDetalle, MaterialDetalle,PlasticoDetalle
import os
from django.conf import settings
# imoprt base_dir



def convertir_numero_a_miles(numero): 
    return f"{numero:,.2f}".replace(',', '#').replace('.', ',').replace('#', '.')

# formatear rut chileno
def format_rut(rut):
    rut = rut.replace('.', '').replace('-', '')
    if len(rut) < 8:
        return rut  # Retorna sin formato si no tiene la longitud mínima
    rut_digits = rut[:-1]  # Todos menos el último carácter
    rut_verification = rut[-1].upper()  # Último carácter en mayúsculas
    rut_digits_formatted = f"{int(rut_digits):,}".replace(',', '.')
    formatted_rut = f"{rut_digits_formatted}-{rut_verification}"
    return formatted_rut

def toUpperCase(string):
    return string.upper()

def only_month(date):
    return date.strftime("%m/%Y")


def toInteger(string):
    return int(string.replace('.', '')).replace(',', '')

def toString(string):
    return str(string).replace('.', '').replace(',', '')

def generate_pdf_certificado(certificado):
    try:
        categoria = certificado.categoria if certificado.categoria else "Desconocida"
        folio = certificado.folio if certificado.folio else "Sin folio"
        numero_certificado = certificado.numero_certificado if certificado.numero_certificado else "Sin número"
        client = certificado.client.name if certificado.client and certificado.client.name else "Cliente desconocido"
        fecha = certificado.fecha if certificado.fecha else "Fecha no disponible"
        numero_guia = certificado.numero_guia if certificado.numero_guia else "S/G"
        destino_final = certificado.destino_final if certificado.destino_final else "Destino no especificado"
        id = certificado.id if certificado.id else 0

        rut = certificado.client.rut
        domicilio = certificado.client.address

        image_path = os.path.join(settings.BASE_DIR, 'static/images/logo_nbg.png')
        absolute_path = f"file:///{image_path}"

        template = None
        if certificado.categoria == 'Plásticos':
            detalle = PlasticoDetalle.objects.filter(certificado=certificado).first()
            if not detalle:
                return None

            cantidad_kg = detalle.cantidad_kg or 0
            clasificacion = detalle.clasificacion_resinas or "Sin clasificación"
            template = render_to_string('certificadoDF_plasticos.html', {
                'categoria': toUpperCase(categoria),
                'folio': folio,
                'numero_certificado': numero_certificado,
                'client': client,
                'fecha': only_month(fecha),
                'numero_guia': numero_guia,
                'destino_final': destino_final,
                'id': id,
                'cantidad_kg': convertir_numero_a_miles(cantidad_kg),
                'rut': format_rut(rut),
                'domicilio': domicilio,
                'clasificacion': clasificacion,
                'image': absolute_path
            })

        elif certificado.categoria == 'Fitosanitarios':
            detalle = FitosanitarioDetalle.objects.filter(certificado=certificado).first()
            if not detalle:
                return None

            context =  {
                'categoria': "FITOS SANITARIOS",
                'folio': folio,
                'numero_certificado': numero_certificado,
                'client': client,
                'fecha': only_month(fecha),
                'numero_guia': numero_guia,
                'destino_final': destino_final,
                'id': id,
                '01l': detalle.cantidad_01_l if detalle.cantidad_01_l else 0,
                '025l': detalle.cantidad_025_l if detalle.cantidad_025_l else 0,
                '05l': detalle.cantidad_05_l if detalle.cantidad_05_l else 0,
                '1l': detalle.cantidad_1_l if detalle.cantidad_1_l else 0,
                '2l': detalle.cantidad_2_l if detalle.cantidad_2_l else 0,
                '3l': detalle.cantidad_3_l if detalle.cantidad_3_l else 0,
                '4l': detalle.cantidad_4_l if detalle.cantidad_4_l else 0,
                '5l': detalle.cantidad_5_l if detalle.cantidad_5_l else 0,
                '10l': detalle.cantidad_10_l if detalle.cantidad_10_l else 0,
                '15l': detalle.cantidad_15_l if detalle.cantidad_15_l else 0,
                '20l': detalle.cantidad_20_l if detalle.cantidad_20_l else 0,
                '25l': detalle.cantidad_25_l if detalle.cantidad_25_l else 0,
                '30l': detalle.cantidad_30_l if detalle.cantidad_30_l else 0,
                '60l': detalle.cantidad_60_l if detalle.cantidad_60_l else 0,
                '100l': detalle.cantidad_100_l if detalle.cantidad_100_l else 0,
                '200l': detalle.cantidad_200_l if detalle.cantidad_200_l else 0,
                'tapas': detalle.cantidad_tapas_l if detalle.cantidad_tapas_l else 0,

                'rut': format_rut(rut),
                'domicilio': domicilio,
                'image': absolute_path
            }
            
            template = render_to_string('certificadoDF_fitos.html',context)

        elif certificado.categoria in ['Metales', 'Fibras']:
            detalle = MaterialDetalle.objects.filter(certificado=certificado).first()
            if not detalle:
                return None

            cantidad_kg = detalle.cantidad_kg or 0
            template = render_to_string('certificadoDF.html', {
                'categoria': toUpperCase(categoria),
                'folio': folio,
                'numero_certificado': numero_certificado,
                'client': client,
                'fecha': only_month(fecha),
                'numero_guia': numero_guia,
                'destino_final': destino_final,
                'id': id,
                'cantidad_kg': convertir_numero_a_miles(cantidad_kg),
                'rut': format_rut(rut),
                'domicilio': domicilio,
                'image': absolute_path
            })

        else:
            print(f"Categoría '{certificado.categoria}' no reconocida.")
            raise ValueError(f"La categoría '{certificado.categoria}' no está soportada.")


        # Generar el PDF
        pdf_file = BytesIO()
        HTML(string=template).write_pdf(pdf_file)
        pdf_file.seek(0)
        return pdf_file

    except Exception as e:
        print(f"Error al generar PDF: {e}")
        return None

from io import BytesIO
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from decimal import Decimal, InvalidOperation
from weasyprint.text.fonts import FontConfiguration
from django.conf import settings
from pathlib import Path
from babel.numbers import format_currency
import os


def generate_pdf_cotizacion(cotizacion):
    # Obtener los detalles como una lista
    detalles = list(cotizacion.detalles.all())
    image_path = os.path.join(settings.BASE_DIR, 'static/images/logo_nbg.png')
    absolute_path = f"file:///{image_path}"

    # Calcular subtotales, IVA y total
    try:
        subtotal = sum(Decimal(detalle.value) for detalle in detalles)
    except (TypeError, InvalidOperation):
        subtotal = Decimal('0.00')

    iva = subtotal * Decimal('0.19')
    total = subtotal + iva
    cantidad = 1

    # Formatear valores en peso chileno
    # formatted_precio = format_currency(detalles.value, 'CLP', locale='es_CL', format=u'¤#,##0')
    formatted_subtotal = format_currency(subtotal, 'CLP', locale='es_CL', format=u'¤#,##0')
    formatted_iva = format_currency(iva, 'CLP', locale='es_CL', format=u'¤#,##0')
    formatted_total = format_currency(total, 'CLP', locale='es_CL', format=u'¤#,##0')
    # Formatear los valores de cada detalle
    detalles_formateados = []
    for detalle in detalles:
        detalles_formateados.append({
            'description': detalle.description,  # Cambié "descripcion" por "description"
            'value': format_currency(Decimal(detalle.value), 'CLP', locale='es_CL', format=u'¤#,##0'),
            'total': format_currency(Decimal(detalle.value*cantidad), 'CLP', locale='es_CL', format=u'¤#,##0')
        })

    # Asegurar que haya siempre 8 filas
    max_filas = 8
    filas_vacias = max_filas - len(detalles)

    # Configurar la fuente
    font_config = FontConfiguration()

    # Rutas a las fuentes en la carpeta static/fonts
    font_path = Path(settings.STATICFILES_DIRS[0]) / 'fonts'
    css_styles = f"""
    @font-face {{
        font-family: 'Geneva';
        src: url('{font_path}/GENEVA.TTF') format('truetype');
    }}
    @font-face {{
        font-family: 'SegoeUIBold';
        src: url('{font_path}/segoeuihibd.ttf') format('truetype');
    }}
    @font-face {{
        font-family: 'SegoeUIThin';
        src: url('{font_path}/segoeuihithis.ttf') format('truetype');
    }}
    @font-face {{
        font-family: 'SegoeUIItalic';
        src: url('{font_path}/segoeuihisi.ttf') format('truetype');
    }}
    @font-face {{
        font-family: 'SegoeUISemiBold';
        src: url('{font_path}/segoeuihisz.ttf') format('truetype');
    }}
    @font-face {{
        font-family: 'Tahoma';
        src: url('{font_path}/tahoma.ttf') format('truetype');
    }}
    @font-face {{
        font-family: 'Verdana';
        src: url('{font_path}/VERDANAI.TTF') format('truetype');
    }}

    body {{
        font-family: 'SegoeUIBold', 'Geneva', 'Tahoma', 'Verdana', sans-serif;
    }}
    """

    # Preparar el contexto para la plantilla
    context = {
        'cotizacion': cotizacion,
        'detalles': detalles_formateados,
        'filas_vacias': range(filas_vacias),  # Generar filas vacías
        'subtotal': formatted_subtotal,
        'iva': formatted_iva,
        'total': formatted_total,
        'image': absolute_path,
    }

    # Renderizar la plantilla
    template = render_to_string('cotizacion.html', context)
    #print route to static logo file
    #             <img src="{% static 'images/logo2.jpg' %}" alt="Logo Punto Eco" />

    base_url = os.path.dirname(os.path.realpath(__file__))


    # Generar el PDF con los estilos personalizados
    pdf_file = BytesIO()
    HTML(string=template, base_url=base_url).write_pdf(pdf_file, stylesheets=[CSS(string=css_styles, font_config=font_config)])
    pdf_file.seek(0)

    return pdf_file

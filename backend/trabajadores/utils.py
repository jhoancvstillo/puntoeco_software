import re

def format_rut(rut):
    # Elimina cualquier punto o guion
    clean_rut = re.sub(r"[^\dKk]", "", rut)
    # Asegúrate de que el RUT tiene al menos 2 caracteres
    if len(clean_rut) < 2:
        return rut

    # Separa el dígito verificador
    body = clean_rut[:-1]
    dv = clean_rut[-1].upper()

    # Agrega los puntos
    formatted_body = f"{int(body):,}".replace(",", ".")
    
    # Retorna el RUT formateado
    return f"{formatted_body}-{dv}"

def format_phone_number(phone):
    """
    Formatea un número de teléfono al formato +56 9 XXXX XXXX.
    """
    # Elimina todos los caracteres no numéricos
    clean_phone = re.sub(r"[^\d]", "", phone)

    # Valida que tenga la longitud mínima esperada
    if len(clean_phone) < 8:
        return phone  # Devuelve el valor original si no cumple con la longitud mínima

    # Asume que el prefijo +56 y el 9 son obligatorios si no están presentes
    if not clean_phone.startswith("56"):
        clean_phone = "56" + clean_phone
    if not clean_phone.startswith("569"):
        clean_phone = clean_phone[:2] + "9" + clean_phone[2:]

    # Divide el número en partes: +56 9 XXXX XXXX
    formatted_phone = f"+{clean_phone[:2]} {clean_phone[2]} {clean_phone[3:7]} {clean_phone[7:]}"
    return formatted_phone

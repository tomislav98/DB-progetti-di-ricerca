from datetime import datetime

def str2date(date):
    # Supponiamo che d_end sia una stringa nel formato "01/01/01", "01-01-01", o "01/1/1"
    date_formats = ["%d/%m/%y", "%d-%m-%y", "%d/%-m/%y"]

    # Prova a convertire la stringa in un oggetto datetime
    for date_format in date_formats:
        try:
            datetime_parsed = datetime.strptime(date, date_format)
            break
        except ValueError:
            pass
    else:
        # Nessun formato valido trovato
        raise ValueError("Formato data non valido")
    
    return datetime_parsed.date()
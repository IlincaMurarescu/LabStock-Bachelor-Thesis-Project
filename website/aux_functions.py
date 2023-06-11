from datetime import datetime


def is_valid_date(date_string):
    try:
        date_sent=datetime.strptime(date_string, "%d/%m/%Y")
        current_date = datetime.now().date()
        if date_sent.date() < current_date:
            return 0
        return 1
    except ValueError:
        return -1
    

def is_number(input_string):
    try:
        float(input_string.replace(',', '.'))
        return True
    except ValueError:
        return False
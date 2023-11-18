def find_json_by_value(array_of_json, key_name ,target_filename):
    for json_object in array_of_json:
        if key_name in json_object and json_object[key_name] == target_filename:
            return json_object
    return None
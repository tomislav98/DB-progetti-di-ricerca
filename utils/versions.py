def get_incremented_version(version):
    new_version = version[1:].split('.')
    major, minor, patch = map(int,new_version ) 
    patch += 1 
    new_version = f'v{major}.{minor}.{patch}'
    return new_version
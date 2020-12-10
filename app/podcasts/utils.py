import os
from flask import current_app as app


def get_chunk(podcast_file_name, byte1=None, byte2=None):
    full_path = os.path.abspath(os.path.join(app.root_path, 'static', 'podcasts', podcast_file_name))
    file_size = os.stat(full_path).st_size
    start = 0
    length = 102400

    if byte1 < file_size:
        start = byte1
    if byte2:
        length = byte2 + 1 - byte1
    else:
        length = file_size - start

    with open(full_path, 'rb') as f:
        f.seek(start)
        chunk = f.read(length)
    return chunk, start, length, file_size

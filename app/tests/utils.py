from os import listdir, remove
from os.path import join, isfile
from flask import current_app as app


def get_real_podcasts():
    podcasts_dir = join(app.root_path, 'static', 'podcasts')
    podcast_files = [f for f in listdir(podcasts_dir) if isfile(join(podcasts_dir, f))]
    return podcast_files


def delete_dummy_podcasts(real_files):
    podcasts_dir = join(app.root_path, 'static', 'podcasts')
    current_podcasts = [f for f in listdir(podcasts_dir) if isfile(join(podcasts_dir, f))]
    for file in current_podcasts:
        if file not in real_files:
            remove(join(podcasts_dir, file))


def delete_dummy_avatars(real_files):
    podcasts_dir = join(app.root_path, 'static', 'avatars')
    current_podcasts = [f for f in listdir(podcasts_dir) if isfile(join(podcasts_dir, f))]
    for file in current_podcasts:
        if file not in real_files:
            remove(join(podcasts_dir, file))

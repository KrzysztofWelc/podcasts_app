from itertools import groupby
from datetime import date, timedelta
from app import db
from app.podcasts.models import PopularPodcast, View


def _set_most_popular():
    views_from_yesterday = db.session.query(View).filter(View.timestamp == date.today() - timedelta(days=1)).all()
    viewed_podcast_id = [v.podcast_id for v in views_from_yesterday]
    sorted_ids = sorted(viewed_podcast_id)
    views_count = {key: len(list(group)) for key, group in groupby(sorted_ids)}

    # 10 the most viewed podcasts of previous day
    most_popular_podcast_ids = []

    for _ in range(10):
        max_key = max(views_count, key=lambda i: views_count[i])
        views_count.pop(max_key)
        most_popular_podcast_ids.append(max_key)

    # truncate popular podcast table
    db.session.query(PopularPodcast).delete()

    for pid in most_popular_podcast_ids:
        pp = PopularPodcast(podcast_id=pid)
        db.session.add(pp)

    db.session.commit()

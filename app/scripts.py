import pdb
from itertools import groupby
from datetime import date, timedelta
from app import db
from app.podcasts.models import PopularPodcast, View


def _set_most_popular():
    views_from_yesterday = db.session.query(View).filter(View.timestamp == date.today() - timedelta(days=1)).all()
    if len(views_from_yesterday) == 0:
        return 0

    viewed_podcast_id = [v.podcast_id for v in views_from_yesterday]
    sorted_ids = sorted(viewed_podcast_id)
    views_count = {key: len(list(group)) for key, group in groupby(sorted_ids)}

    # 10 the most viewed podcasts of previous day
    most_popular_podcast_ids = {}

    try:
        for _ in range(10):
            max_key = max(views_count, key=lambda i: views_count[i])
            # most_popular_podcast_ids.append(max_key)
            most_popular_podcast_ids[max_key] = views_count[max_key]
            views_count.pop(max_key)
    except ValueError:
        pass

    # truncate popular podcast table
    if len(most_popular_podcast_ids) == 10:
        db.session.query(PopularPodcast).delete()
    elif len(most_popular_podcast_ids) < 10:
        pps = PopularPodcast.query.all()
        if len(pps) == 0:
            return 0

        limit = 10 - len(most_popular_podcast_ids)
        pps = db.session.query(PopularPodcast).order_by(PopularPodcast.views.asc()).limit(limit).all()
        for pp in pps:
            db.session.delete(pp)

    for pid in most_popular_podcast_ids:
        pp = PopularPodcast(podcast_id=pid, views=most_popular_podcast_ids[pid])
        db.session.add(pp)

    db.session.commit()

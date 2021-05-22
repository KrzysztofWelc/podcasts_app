from random import randint
from itertools import groupby
from datetime import date, timedelta
from app import db
from app.podcasts.models import PopularPodcast, View, Podcast
from faker import Faker


def set_most_popular_script():
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
        print(2)
        pps = PopularPodcast.query.all()

        limit = 10 - len(most_popular_podcast_ids)
        pps = db.session.query(PopularPodcast).order_by(PopularPodcast.views.asc()).limit(limit).all()
        for pp in pps:
            db.session.delete(pp)

        db.session.commit()
    print(most_popular_podcast_ids)

    for pid in most_popular_podcast_ids:
        pp = PopularPodcast(podcast_id=pid, views=most_popular_podcast_ids[pid])
        print(pp)
        db.session.add(pp)

    db.session.commit()


def generate_fake_views_script():
    faker = Faker()
    podcasts = db.session.query(Podcast).all()
    views = db.session.query(View).all()

    for v in views:
        db.session.delete(v)

    db.session.commit()

    for p in podcasts:
        for _ in range(0, randint(10, 40)):
            v = View(podcast_id=p.id, timestamp=faker.date_between(start_date='-3d', end_date='today'))
            db.session.add(v)

    db.session.commit()
    print('Done')

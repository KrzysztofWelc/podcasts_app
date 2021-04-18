import unittest
import os
from app import create_app, db, models
from app.scripts import _set_most_popular

app = create_app()


@app.cli.command('set_most_popular')
def set_most_popular():
    _set_most_popular()


@app.cli.command('test')
def test():
    tests = unittest.TestLoader().discover('app/tests/endpoints')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@app.cli.command('test_e2e')
def test():
    tests = unittest.TestLoader().discover('app/tests/e2e')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@app.cli.command('create_db')
def create_db():
    db.create_all()


@app.cli.command('drop_db')
def drop_db():
    podcasts_path = os.getcwd() + '/app/static/podcasts'
    podcasts = os.listdir(podcasts_path)
    for p in podcasts:
        if p != '.gitkeep' and p != 'fixture.mp3':
            os.remove(podcasts_path + '/' + p)
    db.drop_all()


if __name__ == '__main__':
    app.run()

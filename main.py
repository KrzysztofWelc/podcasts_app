import unittest
from app import create_app, db, models

app = create_app()


@app.cli.command('test')
def test():
    tests = unittest.TestLoader().discover('app/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@app.cli.command('create_db')
def create_db():
    db.create_all()


@app.cli.command('drop_db')
def drop_db():
    db.drop_all()


if __name__ == '__main__':
    app.run()

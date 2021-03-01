from flask import Blueprint, render_template


frontend = Blueprint('frontend', __name__, template_folder='./templates')


@frontend.route('/')
def main():
    return render_template('index.html')
from flask import Blueprint, render_template, send_from_directory


frontend = Blueprint('frontend', __name__, template_folder='./templates')


@frontend.route('/')
def main():
    return render_template('index.html')


@frontend.route('/assets/<filename>')
def get_assets(filename):
    return send_from_directory('static/assets', filename)

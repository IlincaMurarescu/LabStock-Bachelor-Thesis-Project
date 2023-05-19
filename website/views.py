from flask import Blueprint, render_template


views = Blueprint('views', __name__)

@views.route('/aboutus')
def home():
     return render_template('about_us.html')


@views.route('/products')
def prod():
     return render_template('products.html')

from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
from website.model_entities import delete_expired_stocks, get_backup_csv
from website.model_auth import delete_blacklist
from credentials import secret_key

def create_app():
    app=Flask(__name__)
    app.config['SECRET_KEY'] = secret_key
    from .views import views
    from .auth import  auth
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_stocks, 'interval', days=1)
    scheduler.add_job(delete_blacklist, 'interval', hours=8)
    scheduler.add_job(get_backup_csv, 'interval', days=1)

    scheduler.start()

    return app
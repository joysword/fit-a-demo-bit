from flask import Flask, url_for, render_template, redirect, flash, session, request, g
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required

from oauth import OAuthSignIn

from fitbit import Fitbit


app = Flask(__name__)

app.config['SECRET_KEY'] = 'I will not tell you how hard it is'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['OAUTH_CREDENTIALS'] = {
    'fitbit': {
        'id': '227NBQ',
        'secret': '08d4e866b41581ba488179a1e9dd626c'
    }
}

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'index'


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    full_name = db.Column(db.String(64), nullable=True)
    nickname = db.Column(db.String(64), nullable=True)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.before_request
def before_request():
    next_page = request.args.get('next')
    if next_page is not None:
        session['next_page'] = next_page


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/summary')
def show_summary():
    fitbit = Fitbit(app.config['OAUTH_CREDENTIALS']['fitbit']['id'],
                    app.config['OAUTH_CREDENTIALS']['fitbit']['secret'],
                    access_token=session['token']['access_token'],
                    refresh_token=session['token']['refresh_token'])
    return render_template('summary.html')


@app.route('/details')
def show_details():
    return render_template('details.html')


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for(session['next_page']))


@app.route('/authorize/<provider>')
def oauth_authorize(provider):
    if not current_user.is_anonymous:
        return redirect(url_for('index'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@app.route('/callback/<provider>')
def oauth_callback(provider):
    next_page = session.get('next_page', 'index')
    if not current_user.is_anonymous:
        return redirect(url_for(next_page))
    oauth = OAuthSignIn.get_provider(provider)
    token = oauth.callback()

    session['token'] = token

    client = Fitbit(app.config['OAUTH_CREDENTIALS'][provider]['id'],
                    app.config['OAUTH_CREDENTIALS'][provider]['secret'],
                    access_token=token['access_token'], refresh_token=token['refresh_token'])

    fitbit_client = None
    if provider == 'fitbit':
        fitbit_client = client

    if fitbit_client is not None:
        me = fitbit_client.get_user_profile()

        social_id = 'fitbit_' + me['user']['encodedId']
        full_name = me['user']['fullName']
        nickname = me['user'].get('nickname')

        if social_id is None:
            flash('Authentication failed.')
            return redirect(url_for(next_page))
        user = User.query.filter_by(social_id=social_id).first()
        if not user:
            user = User(social_id=social_id, full_name=full_name, nickname=nickname)
            db.session.add(user)
            db.session.commit()
        login_user(user, remember=True)
        return redirect(url_for(next_page))


@app.route('/about')
def about():
    return render_template('about.html')


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

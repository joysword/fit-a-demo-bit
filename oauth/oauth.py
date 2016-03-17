from rauth import OAuth2Service
from flask import current_app, url_for, request, redirect, session
import json
from base64 import b64encode

from fitbit import Fitbit, FitbitOauth2Client

class OAuthSignIn(object):
    providers = None

    def __init__(self, provider_name):
        self.provider_name = provider_name
        credentials = current_app.config['OAUTH_CREDENTIALS'][provider_name]
        self.consumer_id = credentials['id']
        self.consumer_secret = credentials['secret']

    def authorize(self):
        pass

    def callback(self):
        pass

    def get_callback_url(self):
        return url_for('oauth_callback', provider=self.provider_name,
                       _external=True)

    @classmethod
    def get_provider(cls, provider_name):
        if cls.providers is None:
            cls.providers = {}
            for provider_class in cls.__subclasses__():
                provider = provider_class()
                cls.providers[provider.provider_name] = provider
        return cls.providers[provider_name]


class FitbitSignIn(OAuthSignIn):
    def __init__(self):
        super(FitbitSignIn, self).__init__('fitbit')
        self.service = OAuth2Service(
            name='fitbit',
            client_id=self.consumer_id,
            client_secret=self.consumer_secret,
            authorize_url='https://www.fitbit.com/oauth2/authorize',
            access_token_url='https://api.fitbit.com/oauth2/token',
            base_url='https://api.fitbit.com'
        )
        self.token = {}

    def authorize(self):
        return redirect(self.service.get_authorize_url(
            response_type='code',
            scope='activity location profile sleep',
            redirect_uri=self.get_callback_url(),
            expires_in='604800')
        )

    def _build_header(self):
        base64 = b64encode(self.consumer_id+':'+self.consumer_secret)
        # print 'base64:', base64
        return 'Basic ' + base64

    def callback(self):

        oauth = FitbitOauth2Client(self.consumer_id, self.consumer_secret)

        token = oauth.fetch_access_token(request.args['code'], self.get_callback_url())
        # oauth_session = self.service.get_auth_session(
        #     decoder=json.loads,
        #     headers={'Authorization': self._build_header()},
        #     data={'code': request.args['code'],
        #           'grant_type': 'authorization_code',
        #           'redirect_uri': self.get_callback_url()}
        # )
        # fitbit = Fitbit(self.consumer_id, self.consumer_secret, client=oauth,
        #                 access_token=token['access_token'], refresh_token=token['refresh_token'])
        return token
        # print 'oauth_session:', oauth_session.access_token
        # return oauth_session

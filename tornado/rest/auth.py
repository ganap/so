
import tornado.web
import models
import settings


class Auth(tornado.web.RequestHandler):

    def get_current_user(self):
        return self.get_secure_cookie("hermes_user_chat_oid")
    """
    def get(self):
        self.set_header('Content-Type', 'application/json')
        self.set_header("Access-Control-Allow-Origin", settings.PARENT_DOMAIN)
        self.set_header("Access-Control-Allow-Credentials", "true")

        user = self.get_cookie("chat_username")
        oid = self.get_cookie("chat_oid")
        print(user, oid)
        if self.current_user:
            self.write({'login': True})
        else:
            self.write({'login': False})
    """

    def post(self):
        """
            POST /api/v1/login   {"oid":<models.HermesUser.oid>,
                                  "username":<model.HermesUser.username>}
        """
        self.set_header('Content-Type', 'application/json')
        self.set_header("Access-Control-Allow-Origin", settings.PARENT_DOMAIN)
        self.set_header("Access-Control-Allow-Credentials", "true")
        models.connect()

        pk = self.get_argument("oid")
        username = self.get_argument("username")
        user = models.HermesUser.objects(pk=pk)
        if not user:
            self.write({'login': False})
        user = user[0]
        if user.username == username:
            self.write({'login': True})
        else:
            self.write({'login': False})

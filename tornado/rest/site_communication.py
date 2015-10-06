import settings
import tornado.web

import models


class HermesUser(tornado.web.RequestHandler):

    def get(self):
        models.connect()
        users = {
            "users": models.HermesUser.objects().to_json()
        }
        self.set_header('Content-Type', 'application/json')
        self.set_header("Access-Control-Allow-Origin", settings.PARENT_DOMAIN)
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.write(users)

    def post(self):
        """
            creates new HermesUser object
            >>> POST /api/v1/users      {"api_key":<settings.HERMES_API_KEY>,
                                         "owner":<model.HermesUser.pk>,
                                         "username":<model.HermesUser.username>,
                                         "i_am": <profile_type>
                                         }

            <<< {
                    "oid":"XXXXXXXXXXXXXXX",
                    "user": <models.HermesUser>
                }

            On errors:
            <<< {}

        """
        api_key = self.get_argument("api_key")
        if api_key != settings.HERMES_API_KEY:
            self.write({})

        owner = self.get_argument("owner")
        username = self.get_argument("username")
        is_admin = eval(self.get_argument('is_admin'))
        is_moderator = eval(self.get_argument('is_moderator'))
        is_expert = eval(self.get_argument('is_expert'))
        print(is_admin, is_moderator, is_admin)
        models.connect()
        models.User.objects(owner=owner).delete()
        user = models.User(owner=owner, username=username,
                           is_admin=is_admin, is_expert=is_expert, is_moderator=is_moderator)
        user.save()
        output = {
            "oid": str(user.pk),
            "user": user.to_json()
        }
        print("Created" + user.to_json())
        self.set_header('Content-Type', 'application/json')
        self.set_header("Access-Control-Allow-Origin", settings.PARENT_DOMAIN)
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.write(output)

from flask import session

##THIS IS SKELETON NEED TO VERIFY

class sessionDriver:
    def create_session(self, user_info: dict) -> None:
        # print("Creating session for user:", user_info)
        if not 'user_info' in session:
            session['user_info'] = user_info
            print("Session created")
        else:
            print("Session already exists")

    def remove_session(self) -> None:
        session.clear()

    def get_session_user_info(self) -> dict | None:
        user_info = session.get('user_info')
        # print("Retrieved session user info:", user_info)
        return user_info

    def get_session_user_name(self) -> str | None:
        user_info = self.get_session_user_info()
        if user_info:
            return user_info.get('email')
        return None
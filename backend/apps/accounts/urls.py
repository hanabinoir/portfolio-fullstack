from django.urls import path

from apps.accounts.views import login_view, logout_view, session_view

urlpatterns = [
    path("login/", login_view, name="admin-login"),
    path("logout/", logout_view, name="admin-logout"),
    path("session/", session_view, name="admin-session"),
]

from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


ADMIN_SESSION_FIELDS = ("id", "username", "email", "is_staff", "is_superuser")


@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def session_view(request):
    if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
        payload = {
            "authenticated": True,
            "user": {
                field: getattr(request.user, field)
                for field in ADMIN_SESSION_FIELDS
            },
        }
        return Response(payload)

    return Response({"authenticated": False, "user": None})


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    if user is None or not user.is_active:
        return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_staff and not user.is_superuser:
        return Response({"detail": "Admin access is required."}, status=status.HTTP_403_FORBIDDEN)

    login(request, user)
    return Response({
        "authenticated": True,
        "user": {
            field: getattr(user, field)
            for field in ADMIN_SESSION_FIELDS
        },
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response({"authenticated": False, "user": None})

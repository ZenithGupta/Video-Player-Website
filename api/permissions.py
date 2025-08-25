from rest_framework.permissions import BasePermission
from django.conf import settings

class HasGoogleAppsScriptSecret(BasePermission):
    """
    Allows access only if the request includes the valid secret key in the header.
    """
    def has_permission(self, request, view):
        # The header should be in the format: 'Authorization: Secret YOUR_SECRET_KEY'
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return False

        try:
            # Split the header into 'Secret' and the key itself
            _, secret_key = auth_header.split()
            # Compare with the secret key from settings
            return secret_key == settings.GOOGLE_APPS_SCRIPT_SECRET
        except ValueError:
            # This happens if the header is malformed (e.g., doesn't have two parts)
            return False
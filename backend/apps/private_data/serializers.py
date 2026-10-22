from rest_framework import serializers

from apps.private_data.models import PrivateProfile


class PrivateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateProfile
        fields = ["id", "profile", "address", "phone_number", "citizenship", "visa_type", "visa_expiry_date"]
        read_only_fields = ["id", "profile"]

from django.db import models

from apps.common.models import UUIDModel


class PrivateProfile(UUIDModel):
    profile = models.OneToOneField("profile.Profile", on_delete=models.CASCADE, related_name="private_profile")
    address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=60, blank=True)
    citizenship = models.CharField(max_length=120, blank=True)
    visa_type = models.CharField(max_length=120, blank=True)
    visa_expiry_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["profile__id"]

    def __str__(self):
        return f"Private profile for {self.profile_id}"

from django.contrib import admin

from .models import PrivateProfile


@admin.register(PrivateProfile)
class PrivateProfileAdmin(admin.ModelAdmin):
    list_display = ("profile", "phone_number", "citizenship", "visa_type", "visa_expiry_date")
    search_fields = ("phone_number", "citizenship", "visa_type")

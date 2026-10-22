from django.contrib import admin

from .models import Organization, OrganizationTranslation


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "website_url")
    search_fields = ("name",)


@admin.register(OrganizationTranslation)
class OrganizationTranslationAdmin(admin.ModelAdmin):
    list_display = ("organization", "language_code", "display_name")
    list_filter = ("language_code",)

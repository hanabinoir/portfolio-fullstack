from django.contrib import admin

from .models import Profile, ProfileLink, ProfileSpokenLanguage, ProfileTranslation, SpokenLanguage, SpokenLanguageTranslation


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "get_default_name", "is_active")
    search_fields = ("translations__display_name",)

    @admin.display(description="Name")
    def get_default_name(self, obj):
        return obj.get_default_name() or str(obj.pk)


@admin.register(ProfileTranslation)
class ProfileTranslationAdmin(admin.ModelAdmin):
    list_display = ("profile", "language_code", "display_name")
    list_filter = ("language_code",)


@admin.register(ProfileLink)
class ProfileLinkAdmin(admin.ModelAdmin):
    list_display = ("profile", "label", "link_type", "order")


@admin.register(SpokenLanguage)
class SpokenLanguageAdmin(admin.ModelAdmin):
    list_display = ("canonical_name", "code", "is_default")


@admin.register(SpokenLanguageTranslation)
class SpokenLanguageTranslationAdmin(admin.ModelAdmin):
    list_display = ("spoken_language", "language_code", "label")


@admin.register(ProfileSpokenLanguage)
class ProfileSpokenLanguageAdmin(admin.ModelAdmin):
    list_display = ("profile", "spoken_language", "proficiency_level")

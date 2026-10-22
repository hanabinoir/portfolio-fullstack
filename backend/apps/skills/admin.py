from django.contrib import admin

from .models import Skill, SkillSourceClaim, SkillTranslation


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "duration_months", "is_featured")
    search_fields = ("name", "slug")


@admin.register(SkillTranslation)
class SkillTranslationAdmin(admin.ModelAdmin):
    list_display = ("skill", "language_code", "display_name")
    list_filter = ("language_code",)


@admin.register(SkillSourceClaim)
class SkillSourceClaimAdmin(admin.ModelAdmin):
    list_display = ("skill", "source_document", "original_name", "review_status")
    list_filter = ("source_document", "review_status")

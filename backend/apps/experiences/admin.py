from django.contrib import admin

from .models import Employment, Experience, ExperiencePhase, ExperienceSkill, ExperienceTranslation, ExperienceURL


@admin.register(Employment)
class EmploymentAdmin(admin.ModelAdmin):
    list_display = ("employer", "client", "start_date", "end_date", "employment_type")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "employment", "slug", "is_published", "start_date", "end_date")
    search_fields = ("role", "slug")


@admin.register(ExperienceTranslation)
class ExperienceTranslationAdmin(admin.ModelAdmin):
    list_display = ("experience", "language_code", "title")
    list_filter = ("language_code",)


@admin.register(ExperienceURL)
class ExperienceURLAdmin(admin.ModelAdmin):
    list_display = ("experience", "url_type", "label", "url")


@admin.register(ExperiencePhase)
class ExperiencePhaseAdmin(admin.ModelAdmin):
    list_display = ("experience", "phase_name", "phase_order")


@admin.register(ExperienceSkill)
class ExperienceSkillAdmin(admin.ModelAdmin):
    list_display = ("experience", "skill", "order")

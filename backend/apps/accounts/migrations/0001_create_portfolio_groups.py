from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import migrations


PUBLIC_MODELS = [
    "profile.Profile",
    "profile.ProfileTranslation",
    "profile.ProfileLink",
    "profile.SpokenLanguage",
    "profile.SpokenLanguageTranslation",
    "profile.ProfileSpokenLanguage",
    "organizations.Organization",
    "organizations.OrganizationTranslation",
    "experiences.Employment",
    "experiences.Experience",
    "experiences.ExperienceTranslation",
    "experiences.ExperienceURL",
    "experiences.ExperiencePhase",
    "experiences.ExperienceSkill",
    "skills.Skill",
    "skills.SkillTranslation",
    "skills.SkillSourceClaim",
]

PRIVATE_MODELS = [
    "private_data.PrivateProfile",
]


def create_groups(apps, schema_editor):
    admin_group, _ = Group.objects.get_or_create(name="admin")
    guest_group, _ = Group.objects.get_or_create(name="guest")

    all_permissions = set()
    for model_path in PUBLIC_MODELS + PRIVATE_MODELS:
        app_label, model_name = model_path.split(".")
        ct, _ = ContentType.objects.get_or_create(app_label=app_label, model=model_name.lower())
        all_permissions.update(Permission.objects.filter(content_type=ct))

    admin_group.permissions.set(all_permissions)

    public_permissions = set()
    for model_path in PUBLIC_MODELS:
        app_label, model_name = model_path.split(".")
        ct, _ = ContentType.objects.get_or_create(app_label=app_label, model=model_name.lower())
        public_permissions.update(
            Permission.objects.filter(content_type=ct, codename__in={"view_profile", "view_profiletranslation", "view_profilelink", "view_spokenlanguage", "view_spokenlanguagetranslation", "view_profilespokenlanguage", "view_organization", "view_organizationtranslation", "view_employment", "view_experience", "view_experiencetranslation", "view_experienceurl", "view_experiencephase", "view_experienceskill", "view_skill", "view_skilltranslation", "view_skillsourceclaim"})
        )

    guest_group.permissions.set(public_permissions)


def reverse_groups(apps, schema_editor):
    Group.objects.filter(name__in={"admin", "guest"}).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("contenttypes", "0002_remove_content_type_name"),
        ("profile", "0001_initial"),
        ("organizations", "0001_initial"),
        ("experiences", "0001_initial"),
        ("skills", "0001_initial"),
        ("private_data", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_groups, reverse_groups),
    ]

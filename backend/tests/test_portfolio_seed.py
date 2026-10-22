from django.core.management import call_command
from django.test import TestCase

from apps.experiences.models import Experience
from apps.organizations.models import Organization
from apps.private_data.models import PrivateProfile
from apps.profile.models import Profile
from apps.skills.models import Skill, SkillSourceClaim


class PortfolioSeedFixtureTests(TestCase):
    def test_seed_fixture_populates_portfolio_data(self):
        call_command("loaddata", "portfolio_seed")

        self.assertTrue(Profile.objects.exists())
        self.assertTrue(PrivateProfile.objects.exists())
        self.assertGreater(Organization.objects.count(), 5)
        self.assertGreater(Experience.objects.count(), 5)
        self.assertGreater(Skill.objects.count(), 10)
        self.assertGreater(SkillSourceClaim.objects.count(), 0)

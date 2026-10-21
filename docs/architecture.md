# Architecture Notes

## Main domains

- Profile: public identity, profile picture URL, profile links, spoken languages.
- Organization: company/client identity and optional company website URL.
- Employment: employment period and organization relationships.
- Experience: project under an employment period, with multiple project URLs.
- Skills: canonical skill list, localized labels, project association and source CV claims.
- Private data: isolated admin-only personal details.

## URL fields

- `Profile.profile_picture_url`: nullable URL for the profile image.
- `Organization.website_url`: nullable company website.
- `ProfileLink.url`: multiple profile/social/professional links per profile.
- `ExperienceURL.url`: multiple URLs per project, classified by link type.

Do not store binary image content in these URL fields. For production uploads, use object storage and persist the resulting URL.

## Security boundary

Public serializers must never include private profile data. Admin permissions must be enforced on the server for every private endpoint and write operation.

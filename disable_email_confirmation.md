# How to Disable Supabase Email Confirmation

By default, Supabase requires users to confirm their email address before they can log in. Since we want users to be able to immediately log in and use SubsTrack after signing up, we need to disable this setting in the Supabase Dashboard.

## Steps to Disable:

1. Go to your **Supabase Dashboard** online.
2. Select your `SubsTrack` project.
3. On the left-hand sidebar, click on the **Authentication** tab (the icon looks like a group of people).
4. Under the Authentication menu, click on **Providers**.
5. Click on the **Email** provider box to expand its settings.
6. Look for the toggle switch labeled **Confirm email**.
7. **Toggle it OFF** (so it is no longer green).
8. Scroll down to the bottom of that section and click the green **Save** button.

### Result:
Once saved, any user who fills out the "Initialize Account" form on your website will be *instantly* logged in, and their data will immediately start saving to the database. They will no longer receive a confirmation email or need to click a link.

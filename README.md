# Monsta Melodic website

Static website ready for GitHub Pages. Keep `CNAME` and `Logo.png` in the root. Upload all files together.

## Add a news post

Edit `posts.json`. Add an object at the top of the array with a unique `slug`, an ISO date (`YYYY-MM-DD`), `category`, `title`, `excerpt`, and `body` (an array of paragraph strings). The homepage shows the newest three posts and `news.html` shows the full archive. Example:

```json
{
  "slug": "new-song",
  "date": "2026-10-01",
  "category": "Music",
  "title": "A new song is on the way",
  "excerpt": "A short preview for the news page.",
  "body": ["First paragraph.", "Second paragraph."]
}
```

Keep commas between entries and valid JSON syntax. On GitHub Pages, commit `posts.json` to publish the change. Individual post links use `news.html?post=slug`.

## Complete the profiles

The Members and Staff pages intentionally display placeholders. For member photos, add `member1.jpg` through `member5.jpg` and replace the placeholder element in each `.member-toggle` with an `<img>` tag. Edit names, birthdays, oshi marks, positions, quotes and staff text in the corresponding HTML files. Group social links are labeled as group accounts; replace them when individual accounts are ready. For staff portraits, replace the symbol inside `.staff-avatar` with an image.

## Volunteer forms

The six existing Google Form IDs are retained in `applications.html`; their links use `/viewform` for applicants. Confirm each form is published and accepting responses in Google Forms before sharing this site.

The former idol applications page and all links to it were removed.

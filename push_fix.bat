git add .
git commit -m "Fix: Disable npm cache and use npm install

- Disabled npm cache (requires package-lock.json)
- Changed npm ci to npm install (works without lock file)
- Added BUILD_INSTRUCTIONS.md with setup guide"
git push

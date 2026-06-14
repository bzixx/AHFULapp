## Troubleshooting

- If the backend fails to connect to the database, verify your .env is Updated with the current SECRETS
- If the Frontend fails to connect to the Google Or Firebase, verify your .env is Updated with the current SECRETS
- If the frontend fails to compile, remove `node_modules/` and run `npm install` again. Ensure your Node version matches the one required by `Frontend/package.json`.
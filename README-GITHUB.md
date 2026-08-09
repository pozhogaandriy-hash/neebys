# Gymfriends — GitHub + Vercel

## Upload this project to GitHub

Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial Gymfriends project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gymfriends.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Important

Do NOT commit `.env`, `.env.local`, or any secret/API keys.
Use `.env.example` as a template for environment variables.

After connecting this GitHub repository to Vercel, every push to `main` can trigger a new deployment.

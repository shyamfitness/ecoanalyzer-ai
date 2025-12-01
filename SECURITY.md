# 🔒 Security Best Practices

## ⚠️ Never Commit Secrets

**IMPORTANT:** Never commit actual secrets, API keys, or connection strings to GitHub.

### What to Never Commit:
- ❌ Actual MongoDB connection strings
- ❌ Real OpenAI API keys (sk-...)
- ❌ JWT secrets
- ❌ Database passwords
- ❌ Any `.env` files with real values

### What is Safe to Commit:
- ✅ `.env.example` files with placeholders
- ✅ Documentation with placeholder examples
- ✅ Configuration templates

---

## 🛡️ Secret Management

### Use Environment Variables
All secrets should be stored as environment variables in your hosting platform:

**Vercel (Frontend):**
- Set in: Project Settings → Environment Variables
- Use: `VITE_API_URL`, etc.

**Render (Backend):**
- Set in: Service Settings → Environment
- Use: `MONGODB_URI`, `OPENAI_API_KEY`, `JWT_SECRET`, etc.

### Local Development
1. Copy `.env.example` to `.env`
2. Fill in your actual values in `.env`
3. **Never commit `.env`** (it's in `.gitignore`)

---

## 🔍 GitHub Secret Scanning

GitHub automatically scans for secrets. If you see warnings:

1. **If it's a false positive** (just documentation):
   - Update the file to use clearer placeholders like `<username>`, `<password>`
   - Use angle brackets to indicate placeholders

2. **If you accidentally committed a real secret:**
   - **IMMEDIATELY** rotate/regenerate the secret
   - Remove it from git history (if needed)
   - Update the secret in your hosting platform

---

## ✅ Safe Placeholder Formats

Use these formats in documentation:

```bash
# ✅ Safe - Clear placeholders
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecoanalyzer
OPENAI_API_KEY=<your-openai-api-key>
JWT_SECRET=<your-secure-random-string>

# ❌ Avoid - Looks like real secrets
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecoanalyzer
OPENAI_API_KEY=sk-1234567890abcdef
JWT_SECRET=my-secret-key-123
```

---

## 🔐 Generating Secure Secrets

### JWT Secret
```bash
# Generate a secure random string
openssl rand -base64 32
```

### Database Password
- Use MongoDB Atlas password generator
- Minimum 8 characters
- Mix of letters, numbers, symbols

---

## 📝 Checklist

Before committing:
- [ ] No `.env` files in commit
- [ ] No real API keys in code
- [ ] No real connection strings
- [ ] Documentation uses placeholders
- [ ] `.gitignore` includes `.env*`

---

**Remember:** When in doubt, use environment variables! 🔒


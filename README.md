# Yuzi Marketing Media — CRM (Free Setup Guide)

Ye guide bilkul shuru se hai — maan ke chal rahe hain aapne pehle kabhi
code deploy nahi kiya. Har step ko order mein follow karo, kisi ko skip
mat karo.

**Total time:** ~2-3 ghante pehli baar mein.
**Total cost:** ₹0, sirf domain lena ho to ~₹700-900/saal (optional, Step 10).

---

## Cheezein jo pehle install karni hain

1. **Node.js** install karo: https://nodejs.org (LTS version le lo, "Next Next Finish" karke install ho jayega)
2. **VS Code** install karo (code editor): https://code.visualstudio.com
3. **GitHub** par free account banao: https://github.com/signup
4. Confirm karo Node install hua: terminal/command prompt kholo aur likho:
   ```
   node -v
   ```
   Ek version number dikhna chahiye (jaise v20.x.x). Agar error aaye, Node.js dobara install karo.

---

## STEP 1 — Supabase account aur project banao

1. https://supabase.com par jaake "Start your project" dabao, GitHub se signup kar lo (free).
2. "New Project" par click karo.
3. Fields bharo:
   - **Name**: `yuzi-crm`
   - **Database Password**: ek strong password banao aur **kahin save kar lo** (notes app mein) — ye baad mein chahiye padega.
   - **Region**: Singapore ya Mumbai (jo bhi India ke paas ho) select karo.
4. "Create new project" dabao. 1-2 minute wait karo jab tak project ready ho.

---

## STEP 2 — Database tables banao (schema.sql chalao)

1. Left sidebar mein **SQL Editor** par click karo.
2. "New query" dabao.
3. Is project ke saath jo `schema.sql` file di gayi hai, uska poora content copy karo.
4. SQL Editor mein paste karo.
5. Right neeche **"Run"** button dabao.
6. Agar "Success. No rows returned" dikhe — matlab sab tables ban gaye. 🎉

Check karne ke liye: left sidebar mein **Table Editor** kholo — `profiles`, `clients`, `leads`, `tasks`, `leaves` tables dikhni chahiye.

---

## STEP 3 — Authentication (login) on karo

1. Left sidebar mein **Authentication** → **Providers** par jao.
2. "Email" provider already on hoga — usse chhed mat karo.
3. Agar aap testing kar rahe ho aur baar-baar email confirm karna time-waste lage, to **Authentication → Settings** mein "Confirm email" ko temporarily OFF kar sakte ho (baad mein production mein ON kar dena, security ke liye).

---

## STEP 4 — Employees/Clients ke liye login accounts banao

Har employee aur client ke liye ek account manually banayenge (aap owner ho, aap hi control karoge):

1. **Authentication → Users** → **"Add user"** dabao.
2. Employee ka email aur ek password daalo (unhe baad mein bata dena, ya unse khud signup karwao apni app ke Login screen se).
3. User create hote hi, humara trigger automatically ek row `profiles` table mein bana dega (role default "Employee" set hoga).
4. Ab **Table Editor → profiles** kholo, us naye user ki row dhundo, aur edit karo:
   - **role**: `Owner`, `Management`, `Employee`, ya `Client`
   - **employee_name**: agar Employee hai, to uska naam daalo (jaise "Aarav") — isi naam se tasks assign honge
   - **client_id**: agar Client hai, to `clients` table se uska ID copy karke yahan daalo
   - **full_name**: unka poora naam

Har naye employee/client ke liye ye 2 steps (Add user + profile edit) repeat karo.

> Tip: sabse pehle apna khud ka account banao aur role = `Owner` set karo, taaki aap sabse pehle test kar sako.

---

## STEP 5 — API keys copy karo

1. **Project Settings** (bottom-left gear icon) → **API** par jao.
2. Do cheezein copy karo:
   - **Project URL**
   - **anon public** key (ye "publishable" key hoti hai, safe hai frontend mein use karna)

Inhe kahin note kar lo, agle step mein chahiye.

---

## STEP 6 — Project ko apne computer par set up karo

1. Terminal/Command Prompt kholo.
2. Is CRM project ka folder jahan bhi extract kiya hai, wahan jao:
   ```
   cd yuzi-crm-supabase
   ```
3. Dependencies install karo:
   ```
   npm install
   ```
4. `.env.example` file ko copy karke `.env.local` naam se save karo, aur andar Step 5 wali values daalo:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. App ko local mein chalao:
   ```
   npm run dev
   ```
6. Terminal mein ek link milega (jaise `http://localhost:5173`) — usse browser mein kholo.
7. Login screen dikhega. Step 4 mein jo email/password banaya tha usse login karo.

Agar login ho gaya aur Dashboard dikha — **matlab sab connected hai!** 🎉

---

## STEP 7 — GitHub par code push karo (source code ownership)

1. GitHub par jaake ek naya repository banao (private rakh sakte ho): "New repository" → naam `yuzi-crm` → Create.
2. Terminal mein (project folder ke andar):
   ```
   git init
   git add .
   git commit -m "Yuzi CRM first version"
   git branch -M main
   git remote add origin https://github.com/<aapka-username>/yuzi-crm.git
   git push -u origin main
   ```
3. GitHub par repo refresh karo — aapki saari files dikhni chahiye (`.env.local` nahi dikhega, wo `.gitignore` mein hai — safe hai).

---

## STEP 8 — Vercel par free deploy karo

1. https://vercel.com par jaake GitHub se signup karo.
2. "Add New Project" → apna `yuzi-crm` GitHub repo select karo → "Import".
3. **Environment Variables** section mein wahi 2 values daalo jo `.env.local` mein hain:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. "Deploy" dabao. 1-2 minute mein live ho jayega.
5. Aapko ek free link milega: `yuzi-crm.vercel.app` — ye link kisi ko bhi bhej sakte ho, wo login karke apna panel use kar sakta hai.

Ab jab bhi aap code mein change karke GitHub par push karoge, Vercel automatically naya version live kar dega.

---

## STEP 9 — Test karo sab roles se

1. Apne "Owner" account se login karo — sab kuch dikhna chahiye.
2. Ek employee ka account bana ke (Step 4), uske email-password se ek doosre browser (ya incognito) mein login karo — dekho usko sirf apna kaam dikh raha hai.
3. Ek client account bana ke test karo — dekho wo sirf apna content/approvals dekh pa raha hai, baaki agency ka data nahi.

---

## STEP 10 — (Optional) Apna khud ka domain

Vercel ka free `.vercel.app` link professional lagta hai lekin agar apna naam chahiye (jaise `crm.yuzimarketing.com`):
1. Koi bhi domain registrar se domain kharido (Namecheap, GoDaddy — ~₹700-900/saal).
2. Vercel Project → Settings → Domains → apna domain add karo.
3. Registrar ke DNS settings mein Vercel ke diye hue records daal do (Vercel khud step-by-step batata hai).

---

## Free tier ki limits (dhyan rakhna)

| Cheez | Free limit | Kya hoga limit cross hone par |
|---|---|---|
| Supabase database | 500 MB | Naya data insert nahi hoga, upgrade karna padega ($25/month) |
| Supabase file storage | 1 GB | Naye files upload nahi honge |
| Supabase inactivity | 7 din koi use na ho to project **pause** ho jata hai | Dashboard se ek click mein resume kar sakte ho |
| Supabase backups | Free mein automatic backup nahi hai | Har kuch hafte mein khud "Table Editor → Export" se CSV nikaal ke rakh lo |
| Vercel bandwidth | Har mahine limit hai (chhoti agency ke liye kaafi hai) | Rare case mein hi hit hoga |

Jab agency badhegi (zyada clients/employees), Supabase Pro plan (~$25/month = ~₹2,100) lena best hoga — tab tak sab 100% free chalega.

---

## Aage kya add kar sakte hain (jab ready ho)

- **File uploads**: Supabase Storage bucket bana ke, client files (logo, raw shoot files) seedhe app se upload/download honge.
- **Email notifications**: Supabase Edge Functions + Resend (free tier) se automatic reminders.
- **WhatsApp**: Meta WhatsApp Cloud API (free tier limited messages/month).

Koi bhi step mein atak jao to bata dena — us exact jagah ka screenshot/error paste karo, main sahi karne mein madad karunga.

# 🛠️ IshTop — Ish va Xizmatlar Zamonaviy Marketplace Platformasi

**IshTop** — O'zbekistondagi ishchi, usta, freelancer, xizmat ko'rsatuvchi, buyurtmachi va ish beruvchilarni yagona interaktiv ekotizimda birlashtiruvchi zamonaviy marketplace ilovasi.

---

## 🌟 Asosiy Imkoniyatlar va Arxitektura

1. **Pixel-Perfect Home UI**:
   - Joylashuv va xizmat radiusi selektori (`Navoiy shahri`, `30 km radiusi`).
   - Xizmat qidiruv paneli va toifalar slayderi (`Barchasi`, `Qurilish`, `Mebel`, `Elektrik`, `Santexnik`, `Avto`, `Boshqa`).
   - Radar xarita banneri (radius doiralari, markaziy geolokatsiya va interaktiv pinlar).
   - "Yaqin hududdagi ishchilarni toping" hero banneri.
   - Tezkor amallar: `E'lon joylash`, `Xizmat ko'rsatish`, `Xaritadagi ustalar`.
   - Mutaxassis kartalari: Sardorbek (Mebel ustasi), Bekzod (Elektrik), Akmal (Santexnik) va boshqalar.

2. **Interaktiv Xarita va Radius (Leaflet / OpenStreetMap)**:
   - Tanlangan shahar markazida xizmat radiusi doirasi (1 km dan 100 km gacha va butun O'zbekiston).
   - Ustalar va ish vakansiyalari markerlari, mini-kartochkalar orqali profilga o'tish yoki to'g'ridan-to'g'ri bog'lanish.

3. **Ko'p Rolli Profil Tizimi**:
   - Bitta akkauntda bir vaqtning o'zida: `Usta`, `Ishchi`, `Freelancer`, `Xizmat ko'rsatuvchi`, `Buyurtmachi`, `Ish beruvchi`, `Kompaniya`.
   - Tasdiqlanganlik nishonlari: Telefon, Email, Shaxs (ID), Kasb, Kompaniya, Portfolio.
   - "Oldin va Keyin" rasmlarini solishtiruvchi portfolio galereyasi.
   - Narx tariflari jadvali, ish vaqti va mavjudlik statusi (Hozir mavjud).
   - Ijtimoiy tarmoqlar (Telegram, Instagram, YouTube, va h.k.).
   - Professional PDF Rezyume (CV) shakllantirish va chop etish.
   - QR-kod va ijtimoiy tarmoqlarga profil havolasini ulashish.

4. **Buyurtma va Ish E'lonlari**:
   - `Ish e'loni berish` — maosh diapazoni, tajriba, kerakli ko'nikmalar, manzil.
   - `Buyurtmaga ish` — muammo tavsifi, foto, byudjet va muddat asosida ustaga to'g'ridan-to'g'ri buyurtma berish.
   - 8 bosqichli buyurtma hayotiy sikli: `Yangi` → `Kelishilmoqda` → `Qabul qilindi` → `Ish boshlandi` → `Jarayonda` → `Bajarildi` → `Bekor qilindi` → `Baholandi`.
   - To'g'ridan-to'g'ri `Ishga taklifnoma` yuborish.

5. **Real-Time Chat**:
   - Matnli xabarlar, rasmlar, ovozli xabar simulyatori.
   - Chat ichida interaktiv Narx Taklifi kartochkasi (`Qabul qilish` / `Rad etish`).

6. **IshTop Smart AI Yordamchi**:
   - Tabiiy tildagi qidiruv: *"Menga Navoiyda 20 km ichida 5 milliongacha bo'lgan elektrik kerak"* deb yozilganda AI kategoriya, shahar, radius va byudjetni ajratib, mos mutaxassislarni filtrlash imkoniyati.
   - E'lon berishda qisqa so'zlarni professional vakansiya matniga aylantirib beruvchi AI generator.

7. **Boshqaruv Panellari (Dashboards)**:
   - Usta paneli (faol va tugallangan buyurtmalar, daromad, baholar).
   - Ishchi paneli (yuborilgan arizalar holati).
   - Ish beruvchi paneli (joylangan e'lonlar va nomzodlar).
   - Mijoz paneli (buyurtmalar monitoringi).

8. **Admin va Moderatsiya Markazi**:
   - Platforma statistikasi (Foydalanuvchilar, Ustalar, E'lonlar, Aylanma).
   - Shikoyatlar (Reports) ko'rib chiqish va noqonuniy kontentni nazorat qilish.
   - Foydalanuvchilarni verifikatsiyadan o'tkazish.

9. **Supabase Relational Database Schema**:
   - `supabase/schema.sql` faylida barcha 35 ta jadval (`users`, `profiles`, `roles`, `categories`, `services`, `portfolios`, `jobs`, `orders`, `messages`, `reviews`, `favorites`, `reports`, va boshqalar) hamda RLS (Row Level Security) xavfsizlik siyosatlari to'liq yozilgan.

10. **Android Native APK**:
    - `@capacitor/android` orqali Android native platformasi sozlangan.
    - Gradle bilan Java 17 muhitida `app-debug.apk` tayyorlab chiqilgan (hajmi ~4.3 MB).
    - Foydalanuvchilar veb-saytning yuqori o'ng burchagidagi **APK** tugmasini bosib, faylni to'g'ridan-to'g'ri telefonlariga yuklab olib o'rnatishlari mumkin!

---

## 🚀 Ishga Tushirish Qo'llanmasi

### 1. Web Ilovani Ishga Tushirish:
```bash
cd ishtop-marketplace
npm install
npm run dev
```
Ilova brauzerda `http://localhost:3000` manzilida ochiladi.

### 2. Android APK-ni Yuklab Olish:
- Tayyor APK fayli:
  `android/app/build/outputs/apk/debug/app-debug.apk`
  yoki brauzerda:
  `http://localhost:3000/app-debug.apk`

### 3. APK-ni Yangidan Yig'ish (Build APK):
```bash
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```
Yig'ilgan fayl: `android/app/build/outputs/apk/debug/app-debug.apk` manzilida paydo bo'ladi.

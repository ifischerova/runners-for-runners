# Běžci sobě - Technická dokumentace

**Semestrální práce pro předmět Tvorba webových aplikací**

## 1. Přehled projektu

Běžci sobě je moderní webová SPA aplikace pro sdílení dopravy mezi běžci, kteří jedou na různé závody. Aplikace je postavená na React frameworku s TypeScriptem a používá moderní nástroje pro vývoj webových aplikací.

### Technologie, které jsem použila

- **Frontend Framework**: React 18 s TypeScriptem
- **Build nástroj**: Vite 6 (rychlejší než Webpack)
- **Navigace**: React Router DOM v6
- **Styling**: Tailwind CSS + Bootstrap 5
- **Správa stavu**: React Context API
- **Ukládání dat**: LocalStorage (simuluje backend)
- **Testování**:
  - Unit testy: Vitest + React Testing Library
  - E2E testy: Playwright
- **Code quality**: ESLint s TypeScript pravidly

## 2. Architektura aplikace

### 2.1 Struktura projektu

```
src/
├── components/           # Komponenty co se používají víckrát
│   └── layout/          # Layout komponenty (Header, Footer, Layout)
├── pages/               # Jednotlivé stránky (views)
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── RacesPage.tsx
│   ├── OrganizersPage.tsx
│   ├── LoginPage.tsx
│   ├── RegistrationPage.tsx
│   ├── ProfilePage.tsx
│   ├── ForgottenPasswordPage.tsx
│   └── TermsPage.tsx
├── contexts/            # React Context pro přihlášení
│   └── AuthContext.tsx
├── services/            # API služby a business logika
│   └── apiService.ts
├── types/              # TypeScript definice typů
│   └── index.ts
├── routes/             # Nastavení cest
│   └── AppRouter.tsx
├── test/               # Testovací utils
│   └── setup.ts
├── App.tsx             # Hlavní komponenta
├── main.tsx            # Vstupní bod aplikace
└── index.css           # Globální styly a animace
```

### 2.2 Popis jednotlivých stránek

Aplikace má **9 různých stránek**:

1. **HomePage** (`/`) - Úvodní stránka s výhodami carpoolingu
2. **AboutPage** (`/about`) - O projektu, naše vize a hodnoty
3. **RacesPage** (`/races`) - Hlavní stránka - seznam závodů a správa jízd
4. **OrganizersPage** (`/organizers`) - Info pro pořadatele závodů
5. **LoginPage** (`/login`) - Přihlášení s validací
6. **RegistrationPage** (`/registration`) - Registrace nového účtu
7. **ProfilePage** (`/profile`) - Profil uživatele (jen pro přihlášené)
8. **ForgottenPasswordPage** (`/forgotten-password`) - Obnova hesla
9. **TermsPage** (`/terms`) - Obchodní podmínky

## 3. Správa stavu (State Management)

### 3.1 AuthContext

Pro správu přihlášení jsem použila React Context API:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
```

**Co to dělá:**

- Spravuje, kdo je přihlášený
- Ukládá přihlášení do LocalStorage (zůstane i po refreshi)
- Kontroluje při načtení stránky, jestli je někdo přihlášený
- Automaticky přesměruje na login, když se někdo snaží dostat na chráněnou stránku

### 3.2 LocalStorage jako "Backend"

Protože to je jen školní projekt, nepoužívám zatím reálný backend. Všechna data ukládám do LocalStorage prohlížeče:

- `bezci_sobe_users` - uživatelé
- `bezci_sobe_races` - závody
- `bezci_sobe_rides` - jízdy
- `bezci_sobe_calendars` - kalendáře závodů
- `bezci_sobe_track_lengths` - délky tratí (5K, 10K, půlmaraton, maraton...)
- `bezci_sobe_track_types` - typy tratí (silnice, trail, dráha)
- `bezci_sobe_certifications` - certifikace (IAAF, AIMS)
- `bezci_sobe_current_user` - právě přihlášený uživatel
- `bezci_sobe_auth_token` - přihlašovací token

## 4. Práce s daty

### 4.1 API Service

Soubor `apiService.ts` obsahuje všechny funkce pro práce s daty:

**Přihlášení a registrace:**

- `login(username, password)` - přihlásí uživatele
- `register(username, email, password)` - zaregistruje nového uživatele
- `logout()` - odhlásí uživatele
- `getCurrentUser()` - vrátí aktuálně přihlášeného uživatele

**Závody:**

- `getRaces()` - vrátí všechny závody
- `getRaceById(id)` - detail jednoho závodu

**Jízdy (rides):**

- `getRides()` - všechny jízdy
- `getRidesByRace(raceId)` - jízdy pro konkrétní závod
- `createRide(ride)` - vytvoří novou jízdu
- `updateRide(id, updates)` - upraví jízdu
- `deleteRide(id)` - smaže jízdu
- `acceptRide(rideId, passengerId)` - přijme nabídku jízdy
- `cancelRideAcceptance(rideId, passengerId)` - zruší přijetí jízdy

### 4.2 Validace dat

**Validace na frontendu** jsem implementovala na několika úrovních:

1. **HTML5 validace**: atributy jako `required`, `minLength`, `type="email"`
2. **Vlastní validace**: kontrola shody hesel, formátu emailu
3. **Validační pravidla**:
   - Uživatelské jméno: minimálně 3 znaky, jen písmena/čísla/podtržítka/pomlčky
   - Email: musí být validní email
   - Heslo: minimálně 6 znaků, musí obsahovat velké i malé písmeno nebo číslo

## 5. TypeScript typování

Všechny datové struktury mají definované typy v `src/types/index.ts`. Díky tomu mi TypeScript hlídá chyby už při psaní kódu.

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

interface Race {
  id: string;
  name: string;
  place: string;
  date: string;
  startTime: string;
  web?: string;
  trackLength: TrackLength;
  trackType: TrackType;
  certifications: Certification[];
  raceCalendarId: string;
}

interface Ride {
  id: string;
  raceId: string;
  userId: string;
  type: RideType;
  from: string;
  to?: string;
  car?: string;
  availableSeats: number;
  occupiedSeats: number;
  passengers: string[];
  notes?: string;
}

enum RideType {
  OFFER = "OFFER", // Nabídka (řidič nabízí místa)
  REQUEST = "REQUEST", // Poptávka (běžec hledá svezení)
}

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
```

## 6. Testování

### 6.1 Unit testy (Vitest)

**Kde jsou**: `src/**/*.test.ts(x)`

**Co testuji:**

- `apiService.test.ts` - všechny API funkce (31 testů)
- `validation.test.ts` - validační funkce pro email, heslo atd.
- `Footer.test.tsx` - footer komponenta
- `HomePage.test.tsx` - home page komponenta
- `LoginPage.test.tsx` - login page s validací

**Celkem 31 unit testů**

**Jak spustit:**

```bash
npm test              # Spustí testy
npm run test:ui       # UI pro testy (hezčí vizualizace)
npm run test:coverage # Zjistí, kolik kódu je pokryto testy
```

### 6.2 E2E testy (Playwright)

**Kde jsou**: `tests/*.spec.ts`

**Testované scénáře:**

1. **login.spec.ts** (6 testů)

   - Zobrazení formuláře
   - Validace prázdných polí
   - Chybné přihlašovací údaje
   - Úspěšné přihlášení
   - Přechod na registraci
   - Odhlášení

2. **registration.spec.ts** (7 testů)

   - Zobrazení formuláře
   - Validace prázdných polí
   - Neshoda hesel
   - Validace emailu
   - Povinné podmínky
   - Úspěšná registrace
   - Duplicitní uživatelské jméno

3. **navigation.spec.ts** (3 testy)

   - Navigace mezi stránkami
   - Mobilní menu
   - Obsah hlavní stránky

4. **races.spec.ts** (5 testů)
   - Zobrazení seznamu závodů
   - Výběr závodu a zobrazení detailu
   - Požadavek na přihlášení pro vytvoření jízdy
   - Zobrazení existujících jízd
   - Zrušení vytváření jízdy

**Celkem 21 E2E testů**

**Prohlížeče:**

- Chrome (Chromium)
- Firefox

**Jak spustit:**

```bash
npm run e2e          # Spustí všechny testy
npm run e2e:ui       # UI mód - doporučuju pro debugging
npm run e2e:headed   # Vidím prohlížeč při testování
npm run e2e:debug    # Debug mód - krok po kroku
```

## 7. Design a styling

### 7.1 Tailwind CSS konfigurace

Použila jsem vlastní barevnou paletu v běžeckém stylu:

**Primary barvy (oranžová)**: `#f97316` - hlavní barva pro CTA tlačítka
**Accent barvy (zelená)**: `#22c55e` - pro ekologické prvky
**Dark barvy**: Pro texty a pozadí

### 7.2 Moderní design prvky

V aplikaci jsem použila několik moderních design technik:

- **Glassmorphism**: Průhledné karty s blur efektem (vidět v Header)
- **Gradient texty**: Barevné přechody v nadpisech
- **Animace**: Fade-in, slide-up, bounce efekty
- **Rounded design**: Zaoblené rohy všude
- **Shadow effects**: Různé úrovně stínů pro hloubku

### 7.3 Responzivní design

Aplikace funguje na všech zařízeních:

- **Desktop**: Plný layout s bočním menu
- **Tablet**: Přizpůsobený layout
- **Mobil**: Hamburger menu, stack layout

## 8. Funkce aplikace

### 8.1 Hlavní funkce RacesPage

**Výběr závodu:**

- Testovací seznam závodů v roce 2026 (10 závodů celkem)
- Detail závodu po výběru (datum, čas startu, místo, web)

**Správa jízd:**

- **Vytvoření nabídky** (OFFER): Řidič nabídne volná místa v autě
  - Odkud jedu
  - Kam se vracím (volitelné)
  - Typ auta
  - Počet volných míst
  - Poznámka
- **Vytvoření poptávky** (REQUEST): Běžec hledá svezení
  - Odkud potřebuji jet
  - Počet potřebných míst
  - Poznámka

**Interakce s jízdami:**

- **Smazání vlastní jízdy**: Můžu smazat jen své jízdy
- **Přijetí nabídky**: Přihlášený uživatel může přijmout nabídku od jiného řidiče
- **Zrušení přijetí**: Můžu zrušit, že jedu s někým

### 8.2 Uživatelské účty

**Testovací účty:**

- Admin: `admin` / `admin123`
- Uživatel: `ivka` / `ivka123`

**Registrace nového účtu:**

- Uživatelské jméno (min 3 znaky)
- Email
- Heslo + potvrzení hesla
- Souhlas s podmínkami

**Zapomenuté heslo:**

- Stránka pro obnovu hesla
- Validace emailu
- Kontrola existence uživatele

### 8.3 Chráněné stránky

Některé stránky jsou dostupné jen po přihlášení:

- ProfilePage - profil uživatele
- Vytváření/mazání jízd
- Přijímání nabídek

Když se nepřihlášený uživatel pokusí dostat na chráněnou stránku, přesměruje se na login.

## 9. Optimalizace a výkon

### 9.1 Build optimalizace

- **Code splitting**: Vendor balíček oddělený od aplikačního kódu
- **Tree shaking**: Automaticky se odstraní nepoužitý kód
- **Minifikace**: Zmenšení JS/CSS souborů pro produkci
- **Source maps vypnuté v produkci**: Nikdo neuvidí zdrojový kód

### 9.2 React optimalizace

- **React.StrictMode**: Odhaluje potenciální problémy během vývoje
- **Správný state management**: Minimalizace zbytečných re-renderů
- **useEffect dependencies**: Správně nastavené závislosti

## 10. Bezpečnost

### 10.1 NPM bezpečnost

V `.npmrc` souboru mám nastaveno:

- `ignore-scripts=true` - zabraňuje spuštění nebezpečných post-install skriptů
- `save-exact=true` - používám přesné verze balíčků (ne `^` nebo `~`)
- `audit=true` - automatická kontrola bezpečnostních chyb

### 10.2 Bezpečnost aplikace

- **Client-side validace** všech vstupů
- **XSS ochrana**: React automaticky escapuje vstupy
- **TypeScript**: Pomáhá předcházet chybám už při psaní kódu
- **Hesla**: V reálné aplikaci by byla hashovaná (tady jen ukládám do LocalStorage)

## 11. Známé problémy a omezení

### 11.1 LocalStorage místo databáze

- Data se ukládají jen v prohlížeči
- Po vymazání cookies/storage se data ztratí
- Není synchronizace mezi zařízeními
- Není to škálovatelné pro reálný provoz

### 11.2 Chybějící funkce

Pro reálný provoz by byla potřeba:

- Real-time chat mezi uživateli
- Notifikace (email/push)
- Mapová integrace
- Hodnocení řidičů/spolujezdců
- Platební brána
- Reálný backend s databází
- Hashování hesel

## 12. Spuštění projektu

### 12.1 Instalace

```bash
# Naklonovat repozitář
git clone <repository-url>

# Přejít do složky
cd bezci-sobe-app

# Nainstalovat závislosti
npm install
```

### 12.2 Development

```bash
# Spustit dev server (http://localhost:5173)
npm run dev

# V jiném terminálu - unit testy
npm test

# E2E testy
npm run e2e
```

### 12.3 Production build

```bash
# Vytvořit produkční build
npm run build

# Náhled produkčního buildu
npm run preview

# Zkontrolovat kód
npm run lint
```

### 12.4 Testing

```bash
# Unit testy
npm test                  # Běží v watch módu
npm run test:ui          # S grafickým rozhraním
npm run test:coverage    # S code coverage

# E2E testy
npm run e2e              # Spustí všechny testy
npm run e2e:ui           # UI mód
npm run e2e:headed       # Vidím prohlížeč
npm run e2e:debug        # Debug mód
```

## 13. Závěr

Projekt splňuje všechny požadavky zadání:

- ✅ Minimálně 5 views (mám 9)
- ✅ React s TypeScriptem
- ✅ Routing (React Router)
- ✅ State management (Context API)
- ✅ Formuláře s validací
- ✅ LocalStorage pro perzistenci
- ✅ Responzivní design
- ✅ Unit testy (31 testů)
- ✅ E2E testy (21 testů)
- ✅ Moderní UI/UX
- ✅ TypeScript typování

### Co jsem se naučila

Během vývoje jsem se naučila:

- Práci s React hooks (useState, useEffect, useContext)
- TypeScript - typování, interfaces, enums
- React Router - navigace, protected routes
- Tailwind CSS - utility-first CSS
- Testování - unit i E2E testy
- Git - verzování, commity
- Playwright - moderní E2E testing framework

### Možná rozšíření do budoucna

Kdyby měl projekt pokračovat, přidala bych:

- Reálný backend (Node.js + Express + MongoDB)
- Autentizaci přes JWT tokeny
- Real-time chat (WebSockets)
- Mapovou integraci (Google Maps API)
- Push notifikace
- Hodnocení uživatelů
- Fotky profilů a aut
- Sdílení nákladů na cestu
- Mobilní aplikace (React Native)

---

**Autor**: Iva Fischerová  
**Datum**: Leden 2026  
**Předmět**: Tvorba webových aplikací  
**Verze**: 1.0

## 7. Optimalizace a výkon

### 7.1 Build optimalizace

- **Code splitting**: Vendor bundle oddělen od aplikačního kódu
- **Tree shaking**: Automatické odstranění nepoužitého kódu
- **Minifikace**: Terser pro minifikaci produkčního buildu
- **Source maps vypnuty**: Pro zabránění odhalení zdrojového kódu v produkci

### 7.2 Performance best practices

- React.StrictMode pro detekci problémů
- Lazy loading routes (možnost rozšíření)
- Memoizace komponent kde je to vhodné
- Optimalizované re-rendery pomocí správného state managementu

## 8. Bezpečnost

### 8.1 NPM bezpečnost

- `.npmrc` s `ignore-scripts=true` - zabraňuje spuštění post-install skriptů
- `save-exact=true` - používá přesné verze balíčků
- Pravidelné `npm audit` pro kontrolu zranitelností

### 8.2 Aplikační bezpečnost

- Client-side validace všech vstupů
- XSS ochrana díky React (automatické escapování)
- CSRF ochrana není potřeba (žádný real backend)
- Bezpečné ukládání hesel (v reálné aplikaci by byly hashované)

## 9. Spuštění projektu

```bash
# Instalace závislostí
npm install

# Development server
npm run dev

# Build pro produkci
npm run build

# Preview produkčního buildu
npm run preview

# Linting
npm run lint

# Testy
npm test
npm run e2e
```

## 10. Další rozvoj

Možná rozšíření aplikace:

- Real-time chat mezi uživateli
- Hodnoce2evatelů/jízd
- Push notifikace
- Integrace s mapovými službami
- Real backend API
- Pokročilé filtrování a vyhledávání závodů
- Platební brána pro sdílení nákladů

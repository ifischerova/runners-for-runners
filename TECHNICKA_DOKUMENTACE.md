# Běžci sobě - Technická dokumentace

**Semestrální práce pro předmět Tvorba webových aplikací**

## 1. Přehled projektu

Běžci sobě je moderní full-stack webová aplikace pro sdílení dopravy mezi běžci, kteří jedou na různé závody. Frontend je SPA postavená v Reactu s TypeScriptem, backend je REST API ve Spring Bootu nad PostgreSQL. Původní verze projektu používala LocalStorage jako mock backend; aktuální verze má reálný backend s databází a JWT autentizací.

### Technologie, které jsem použila

**Frontend:**

- **Framework**: React 18 s TypeScriptem
- **Build nástroj**: Vite 6 (rychlejší než Webpack)
- **Navigace**: React Router DOM v6
- **Styling**: Tailwind CSS 3 + Bootstrap 5
- **Správa stavu**: React Context API
- **Komunikace s backendem**: nativní `fetch`, JWT v `Authorization: Bearer`
- **Testování**: Vitest + React Testing Library (unit), Playwright (E2E)
- **Code quality**: ESLint s TypeScript pravidly

**Backend:**

- **Framework**: Spring Boot 3.2 (Java 17)
- **Bezpečnost**: Spring Security + stateless JWT (jjwt 0.12.5)
- **ORM**: Spring Data JPA + Hibernate
- **Migrace DB**: Flyway (V1–V4)
- **Databáze**: PostgreSQL 14+ (produkce/dev), H2 in-memory (testy)
- **Validace**: `spring-boot-starter-validation` (Bean Validation)
- **Testy**: JUnit 5 + Mockito + Spring MockMvc

## 2. Architektura aplikace

### 2.1 Struktura projektu

```
.
├── src/                          # Frontend (React + TS)
│   ├── components/layout/        # Header, Footer, Layout
│   ├── pages/                    # 9 view komponent
│   ├── contexts/AuthContext.tsx  # Globální stav přihlášení
│   ├── services/apiService.ts    # REST klient pro backend
│   ├── types/index.ts            # TypeScript modely (User, Race, Ride...)
│   ├── routes/AppRouter.tsx      # Routing
│   ├── utils/                    # Validační funkce
│   ├── test/setup.ts             # Vitest setup
│   ├── App.tsx                   # Kořenová komponenta
│   ├── main.tsx                  # Vstupní bod (ReactDOM.createRoot)
│   └── index.css                 # Globální styly + animace
├── tests/                        # Playwright E2E specy
└── backend/                      # Backend (Spring Boot)
    ├── pom.xml
    └── src/main/
        ├── java/cz/bezcisobe/backend/
        │   ├── BackendApplication.java
        │   ├── config/           # Cors, Security
        │   ├── controller/       # Auth, Race, Ride, ReferenceData
        │   ├── dto/              # request, response, mapper
        │   ├── entity/           # 9 JPA entit
        │   ├── exception/        # Vlastní výjimky + GlobalExceptionHandler
        │   ├── repository/       # Spring Data JPA repozitáře
        │   ├── security/         # JWT filter, provider, UserDetails
        │   └── service/          # AuthService, RaceService, RideService
        └── resources/
            ├── application.yml          # Postgres, Flyway, JWT
            ├── application-dev.yml      # Dev profil
            └── db/migration/V1..V4__*.sql
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

### 3.2 Backend a perzistence

Aplikace má reálný Spring Boot backend, který data ukládá do PostgreSQL databáze. Frontend používá LocalStorage pouze pro JWT token (`bezci_sobe_token`), aby uživatel zůstal přihlášený i po obnovení stránky. Veškerá doménová data (uživatelé, závody, jízdy, číselníky) jsou v databázi a frontend si je tahá přes REST.

Schéma databáze a počáteční data spravuje Flyway čtyřmi migracemi:

- `V1__create_schema.sql` – tabulky a vztahy
- `V2__seed_reference_data.sql` – číselníky (délky tratí, typy tratí, certifikace, kalendáře)
- `V3__seed_users_and_races.sql` – testovací uživatelé (BCrypt cost-10) a závody pro rok 2026
- `V4__seed_rides.sql` – ukázkové jízdy

## 4. Práce s daty

### 4.1 API Service

Soubor `apiService.ts` je tenký REST klient nad `fetch`, který volá backend na `http://localhost:8080/api`. Token z přihlášení automaticky přikládá do hlavičky `Authorization: Bearer <token>`.

**Přihlášení a registrace:**

- `login(username, password)` – POST `/auth/login`, uloží JWT
- `register(...)` – POST `/auth/register`
- `getCurrentUser()` – GET `/auth/me`
- `logout()` – smaže lokální token

**Závody:**

- `getRaces()` – GET `/races`
- `getRaceById(id)` – GET `/races/{id}`

**Jízdy (rides):**

- `getRides()` – GET `/rides`
- `getRidesByRace(raceId)` – GET `/rides?raceId=...`
- `createRide(payload)` – POST `/rides`
- `deleteRide(id)` – DELETE `/rides/{id}`
- `acceptRide(rideId)` – POST `/rides/{id}/accept`
- `cancelRideAcceptance(rideId)` – POST `/rides/{id}/cancel`

Chyby se na frontendu vyhazují jako `Error` s textem z těla odpovědi (`ErrorResponse.message`), který backend posílá konzistentně přes `GlobalExceptionHandler`.

### 4.2 Validace dat

**Validace na frontendu:**

1. **HTML5 validace**: atributy jako `required`, `minLength`, `type="email"`
2. **Vlastní validace** (`src/utils/validation.ts`): kontrola shody hesel, formátu emailu
3. **Validační pravidla**:
   - Uživatelské jméno: minimálně 3 znaky, jen písmena/čísla/podtržítka/pomlčky
   - Email: musí být validní email
   - Heslo: minimálně 6 znaků, musí obsahovat velké i malé písmeno nebo číslo

**Validace na backendu:** každý request DTO má anotace z Bean Validation (`@NotBlank`, `@Email`, `@Size`, `@Min`, …). Pokud klient pošle neplatná data, Spring vrátí `400 Bad Request` přes `GlobalExceptionHandler` s konzistentní strukturou `ErrorResponse`.

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

- **Client-side validace** všech vstupů + serverová Bean Validation
- **XSS ochrana**: React automaticky escapuje vstupy
- **TypeScript**: Pomáhá předcházet chybám už při psaní kódu
- **Hashování hesel**: BCrypt cost-10 přes Spring `BCryptPasswordEncoder`
- **Autentizace**: stateless JWT (HS256, 24h platnost), filter ve Spring Security
- **CORS**: explicitně povolený jen pro Vite dev server (`http://localhost:5173`)
- **Globální exception handler**: nikdy neunikne stack trace klientovi, jen `ErrorResponse`

## 11. Známé problémy a omezení

### 11.1 Provozní předpoklady

- Backend potřebuje běžící PostgreSQL na `localhost:5432` s databází `bezcisobe` (parametry v `application.yml`).
- Frontend očekává backend na `http://localhost:8080`. Adresa je hard-coded v `apiService.ts` – pro produkci by byla v env proměnné.
- JWT secret v `application.yml` je commitnutý na ukázku – v produkci by patřil do tajného úložiště (Vault, Azure Key Vault, env).

### 11.2 Chybějící funkce

Pro reálný provoz by byla ještě potřeba:

- Real-time chat mezi uživateli
- Notifikace (email / push)
- Mapová integrace
- Hodnocení řidičů / spolujezdců
- Platební brána
- Refresh tokeny + odvolávání JWT
- Mobilní aplikace

## 12. Spuštění projektu

### 12.1 Předpoklady

| Nástroj    | Verze |
| ---------- | ----- |
| Node.js    | 20+   |
| npm        | 10+   |
| Java JDK   | 17    |
| Maven      | 3.9+  |
| PostgreSQL | 14+   |

### 12.2 Backend – první spuštění

```bash
# 1) V Postgresu vytvořit databázi a uživatele (heslo dle application.yml)
psql -U postgres -c "CREATE DATABASE bezcisobe;"

# 2) Spustit backend – Flyway sám vytvoří schéma a naseeduje data
cd backend
mvn spring-boot:run
# API běží na http://localhost:8080

# 3) Backend testy (JUnit 5 + H2 in-memory)
mvn test
```

### 12.3 Frontend – development

```bash
# Instalace závislostí
npm install

# Dev server na http://localhost:5173 (předpokládá běžící backend na :8080)
npm run dev

# Lint a unit testy
npm run lint
npm test                  # watch mód
npm test -- --run         # jednorázové spuštění
npm run test:coverage     # s coverage reportem

# E2E testy (Playwright)
npm run e2e               # všechny testy headless
npm run e2e:ui            # UI mód pro debugging
npm run e2e:headed        # vidím prohlížeč
```

### 12.4 Produkční build frontendu

```bash
npm run build       # tsc + vite build → dist/
npm run preview     # lokální preview produkčního buildu
```

## 13. Závěr

Projekt splňuje a překračuje požadavky zadání:

- ✅ Minimálně 5 views (mám 9)
- ✅ React s TypeScriptem
- ✅ Routing (React Router)
- ✅ State management (Context API)
- ✅ Formuláře s frontend i backend validací
- ✅ Reálný backend s perzistencí v PostgreSQL
- ✅ JWT autentizace + BCrypt hashování hesel
- ✅ Responzivní design
- ✅ Unit testy frontendu (Vitest, 26 testů)
- ✅ Backend testy (JUnit 5 + Mockito + MockMvc)
- ✅ E2E testy (Playwright, 21 scénářů)
- ✅ Moderní UI/UX
- ✅ TypeScript typování + Bean Validation na backendu

### Co jsem se naučila

- React hooks (useState, useEffect, useContext) a Context API
- TypeScript – typování, interfaces, enums
- React Router – navigace, chráněné cesty, redirecty
- Tailwind CSS – utility-first styling
- REST klient nad fetch + JWT v hlavičkách
- Spring Boot 3.2 – kontrolery, services, JPA repozitáře, DTO mapping
- Spring Security – stateless JWT pipeline, BCrypt
- Flyway migrace a seedování dat
- Testování na obou stranách – Vitest, Playwright, JUnit, Mockito
- Git – verzování, logické commity, commit-message konvence

### Možná rozšíření do budoucna

- Real-time chat (WebSockets)
- Mapová integrace (Mapy.cz / Google Maps API)
- Push / e-mail notifikace
- Hodnocení uživatelů a jízd
- Fotky profilů a aut
- Sdílení nákladů + platební brána
- Refresh tokeny a odvolatelné JWT
- Mobilní aplikace (React Native)

---

**Autor**: Iva Fischerová  
**Datum**: Leden 2026 (frontend), Květen 2026 (full-stack refactor)  
**Předmět**: Tvorba webových aplikací  
**Verze**: 2.0

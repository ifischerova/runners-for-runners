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
- **Bezpečnost**: Spring Security + stateless JWT (jjwt 0.12.5), method security (`@PreAuthorize`)
- **ORM**: Spring Data JPA + Hibernate
- **Migrace DB**: Flyway (V1–V4)
- **Databáze**: PostgreSQL 14+ (produkce/dev), H2 in-memory (testy)
- **Validace**: `spring-boot-starter-validation` (Bean Validation) + vlastní `@ValidRideRequest` cross-field constraint
- **API dokumentace**: springdoc-openapi 2.3 (Swagger UI na `/swagger-ui.html`)
- **Monitoring**: Spring Boot Actuator (`/actuator/health`, `/actuator/info`)
- **Logování**: SLF4J + Logback (auto-konfigurace), úrovně INFO/WARN/ERROR podle situace
- **Testy**: JUnit 5 + Mockito + Spring MockMvc + Spring Security Test

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
        │   ├── config/           # Cors, Security, OpenAPI
        │   ├── controller/       # Auth, Race, Ride, Reference, Admin
        │   ├── dto/              # request, response (vč. PageResponse), mapper
        │   ├── entity/           # 9 JPA entit
        │   ├── exception/        # Vlastní výjimky + GlobalExceptionHandler
        │   ├── repository/       # Spring Data JPA repozitáře
        │   ├── security/         # JWT filter, provider, UserDetails
        │   ├── service/          # AuthService, RaceService, RideService, AdminService
        │   └── validation/       # @ValidRideRequest + ConstraintValidator
        └── resources/
            ├── application.yml          # Postgres, Flyway, JWT, Actuator, Swagger, logging
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
- backend navíc nabízí `GET /races/search?q=&from=&trackTypeId=&page=&size=&sort=` se stránkováním a filtry — komplexní JPQL dotaz definovaný přes `@Query` na `RaceRepository`.

**Jízdy (rides):**

- `getRidesByRace(raceId)` – GET `/rides?raceId=...`
- `createRide(payload)` – POST `/rides`
- `updateRide(id, payload)` – PUT `/rides/{id}` (jen vlastník)
- `deleteRide(id)` – DELETE `/rides/{id}` (jen vlastník)
- `acceptRide(rideId)` – POST `/rides/{id}/accept`
- `cancelRideAcceptance(rideId)` – POST `/rides/{id}/cancel`

**Admin (jen `ROLE_ADMIN`):**

- `GET /api/admin/users?q=&page=&size=` – stránkovaný a vyhledávatelný seznam uživatelů
- `DELETE /api/admin/rides/{id}` – force-delete jakékoli jízdy

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

**Vlastní validační pravidlo `@ValidRideRequest`** (v balíčku `cz.bezcisobe.backend.validation`) je cross-field constraint na celý DTO. Vynucuje sémantiku, kterou nelze vyjádřit anotacemi na jednotlivých polích:

- pro `type=OFFER` musí být vyplněno `car` a `availableSeats >= 1` (řidič musí říct s čím jede),
- pro `type=REQUEST` naopak nesmí být `car` vyplněno (běžec auto nemá),
- nepovolený `type` se odmítne s vlastní hláškou.

Implementace je v `RideRequestValidator`, který přes `ConstraintValidatorContext` reportuje chybu na konkrétní pole (`car`, `availableSeats`), takže klient ví, co opravit. Anotace je použita jak na `CreateRideRequest`, tak `UpdateRideRequest` přes sdílené rozhraní `RideRequestPayload`.

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

- **Client-side validace** všech vstupů + serverová Bean Validation + vlastní `@ValidRideRequest`
- **XSS ochrana**: React automaticky escapuje vstupy
- **TypeScript**: Pomáhá předcházet chybám už při psaní kódu
- **Hashování hesel**: BCrypt cost-10 přes Spring `BCryptPasswordEncoder`
- **Autentizace**: stateless JWT (HS256, 24h platnost), filter ve Spring Security
- **Autorizace na úrovni metod**: `@EnableMethodSecurity` + `@PreAuthorize("hasRole('ADMIN')")` na `AdminController`. Stejné pravidlo je dublováno i na URL filtru (`/api/admin/**` → `hasRole("ADMIN")`) — defence in depth.
- **CORS**: explicitně povolený jen pro Vite dev server (`http://localhost:5173`)
- **Globální exception handler**: nikdy neunikne stack trace klientovi, jen `ErrorResponse`. Catch-all handler loguje `ERROR` a vrací 500 s neutrálním textem, takže interní detail nikdy nedoputuje k uživateli.

### 10.3 Role a admin endpointy

V systému existují dvě role: `ROLE_USER` (běžný uživatel) a `ROLE_ADMIN` (administrátor). Rozlišení je viditelné v API skrz dedikovanou sekci `/api/admin/**`:

| Endpoint | Účel |
|---|---|
| `GET /api/admin/users?q=&page=&size=` | Stránkovaný seznam uživatelů s vyhledáváním (admin nástroj) |
| `DELETE /api/admin/rides/{id}` | Force-delete jakékoli jízdy (obchází kontrolu vlastníka) |

Tyto endpointy běžný uživatel ani anonym nedovolá — Spring vrací `401` resp. `403`, hláška se přemapuje na `ErrorResponse` v `GlobalExceptionHandler`.

### 10.4 Logování

Backend používá SLF4J + Logback (auto-konfigurace Spring Bootu). Úrovně:

| Úroveň | Co se loguje | Příklad |
|---|---|---|
| `INFO` | Business události | `User 'ivka' logged in successfully (roles=[ROLE_USER])`, `Ride {id} created by user {id}` |
| `WARN` | Klientské chyby a podezřelé pokusy | `Validation failed: ...`, `User X attempted to delete ride Y owned by Z` |
| `ERROR` | Neočekávané servery výjimky | catch-all v `GlobalExceptionHandler#handleUnexpected` |
| `DEBUG` | Diagnostika (JWT validace) | `JWT validation failed: signature does not match` |

Konfigurace úrovní je v `application.yml` (`logging.level.*`). Format logu obsahuje timestamp, level, thread a logger.

### 10.5 Monitoring – Actuator

Spring Boot Actuator vystavuje minimální monitorovací povrch:

- `GET /actuator/health` – stav aplikace a vnořené probes (`/liveness`, `/readiness`)
- `GET /actuator/info` – metadata o sestavení (název, verze, popis z `application.yml`)

Detaily ve `health` jsou zobrazené jen autentizovanému volajícímu (`show-details=when_authorized`), aby anonym neviděl interní stav. Ostatní actuator endpointy jsou v `application.yml` schválně neexponované.

### 10.6 API dokumentace – Swagger / OpenAPI

springdoc-openapi automaticky generuje OpenAPI 3 spec z anotací v controllerech. Po spuštění backendu:

- `http://localhost:8080/swagger-ui.html` – interaktivní UI
- `http://localhost:8080/v3/api-docs` – raw JSON spec

Konfigurace `OpenApiConfig` přidává JWT bearer security scheme — v UI lze přes tlačítko **Authorize** zadat token z `/api/auth/login` a chráněné endpointy se rovnou volají z prohlížeče. Každý endpoint má `@Operation` se shrnutím a `@ApiResponses` s popsanými chybovými stavy.

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

### 12.0 Adresy služeb po spuštění

| URL | Co tam je |
|---|---|
| `http://localhost:5173` | Frontend (Vite dev server) |
| `http://localhost:8080` | Backend REST API |
| `http://localhost:8080/swagger-ui.html` | Swagger UI s autorizací přes JWT |
| `http://localhost:8080/v3/api-docs` | OpenAPI 3 JSON spec |
| `http://localhost:8080/actuator/health` | Health-check |
| `http://localhost:8080/actuator/info` | Build / verze |

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

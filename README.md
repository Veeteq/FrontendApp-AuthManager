# AuthManager

## Resources:
1. https://jasonwatmore.com/angular-15-free-course-1-create-base-project-structure
2. https://jasonwatmore.com/angular-15-free-course-2-add-routing-multiple-pages
3. https://jasonwatmore.com/angular-15-free-course-3-login-form-authentication-route-guard
4. https://jasonwatmore.com/angular-15-free-course-4-registration-form-service-methods
5. https://jasonwatmore.com/angular-15-free-course-5-alerts-home-page
6. https://jasonwatmore.com/angular-15-free-course-6-user-management-crud-section
7. https://jasonwatmore.com/angular-15-16-free-course-7-migrate-to-standalone-components-and-functional-interceptors
8. https://jasonwatmore.com/angular-15-16-free-course-8-dockerize-app-with-nginx


## Setup
1. Instalacja Node.js
2. Instalacja Angular CLI: npm i -g @angular/cli
3. Stworzenie projektu: ng new AuthManager
4. Instalacja tailwindcss: npm install tailwindcss @tailwindcss/postcss postcss --force


## CR-002: User Login and Backend Integration

1. Konfiguracja połączenia z API (zastąpienie Fake Backend)
    ◦ a. Rezygnacja z fake-backend.ts na rzecz rzeczywistego API w Spring Boot.
    ◦ b. Rozwiązanie problemów z CORS po stronie backendu, aby umożliwić komunikację z portem 4201
2. Tworzenie pliku środowiskowego (Angular Environment File)
    ◦ a. Tworzenie folderu src/environments i pliku environment.ts.
    ◦ b. Definiowanie apiUrl wskazującego na Twój serwer Spring Boot.
3. Tworzenie modelu użytkownika (User Model)
    ◦ a. Tworzenie pliku user.ts w folderze src/app/_models.
    ◦ b. Definicja klasy User z polami takimi jak id, username, firstName, lastName oraz token.
4. Aktualizacja konfiguracji TypeScript (TS Config)
    ◦ a. Dodanie aliasów ścieżek (@app/*, @environments/*) w tsconfig.json dla czystszych importów.
    ◦ b. Wyłączenie reguły noPropertyAccessFromIndexSignature, co ułatwia dostęp do pól formularza.
5. Tworzenie serwisu użytkownika (Account/User Service)
    ◦ a. Tworzenie user.service.ts obsługującego logikę RxJS BehaviorSubject do przechowywania stanu zalogowania.
    ◦ b. Implementacja metod login() (zapis w localStorage) oraz logout() (czyszczenie sesji).
6. Konfiguracja HttpClient i Reactive Forms
    ◦ a. Rejestracja provideHttpClient() w pliku app.config.ts (podejście Standalone)
    ◦ b. Import ReactiveFormsModule bezpośrednio w komponencie logowania dla obsługi formularzy.
7. Logika komponentu logowania (Login Logic)
    ◦ a. Implementacja login.ts z wykorzystaniem FormBuilder do walidacji pól username i password.
    ◦ b. Dodanie mechanizmu automatycznego ustawiania focusa na polu username przy użyciu @ViewChild 
8. Szablon formularza logowania (Login HTML)
    ◦ a. Tworzenie login.html z wykorzystaniem Tailwind CSS (zamiast Bootstrapa ze źródeł).
    ◦ b. Implementacja komunikatów o błędach i obsługi stanu ładowania (loading).
9. Aktualizacja głównego komponentu aplikacji (App Component)
    ◦ a. Subskrypcja stanu użytkownika w app.ts, aby dynamicznie reagować na zalogowanie/wylogowanie.
    ◦ b. Implementacja nowoczesnej nawigacji w app.html przy użyciu składni @if (Angular 17+) zamiast *ngIf
10. Tworzenie Strażnika Tras (Route Guard)
    ◦ a. Tworzenie auth.guard.ts w celu ochrony prywatnych tras przed niezalogowanymi użytkownikami.
    ◦ b. Zabezpieczenie trasy głównej (Home) w app.routes.ts za pomocą canActivate.
11. Tworzenie JWT Interceptor
    ◦ a. Implementacja funkcyjnego jwt.interceptor.ts, który automatycznie dodaje token Bearer do nagłówków żądań HTTP.
    ◦ b. Rejestracja interceptora w app.config.ts za pomocą withInterceptors()
12. Tworzenie Error Interceptor
    ◦ a. Implementacja funkcyjnego error.interceptor.ts do przechwytywania błędów 401 i 403.
    ◦ b. Dodanie automatycznego wylogowania w przypadku wygaśnięcia tokena JWT.

## CR-003: User Registration
1. Dodanie metody rejestracji do UserService
2. Logika komponentu rejestracji (RegisterComponent)
3. Szablon komponentu rejestracji (register.html)
4. Aktualizacja LoginComponent (Success Alert)

## CR-004: Alert Service
1. Tworzenie Alert Service (alert.service.ts)
2. Tworzenie Alert Component (alert.component.ts)
3. Refaktoryzacja komponentów Login i Register
4. Aktualizacja Home Page (home.component.ts)

## CR-005: User Management (CRUD)
1. Rozbudowa AccountService o metody CRUD
2. Tworzenie Listy Użytkowników (ListComponent)
3. Tworzenie Formularza Dodawania i Edycji (AddEditComponent)
4. Konfiguracja Routingu (Lazy Loading)

## CR-006: Code refactoring to use signals
1. Migrate to signals
1. Przejście na Standalone Components
2. Funkcyjne Interceptory i Strażnicy (Guards)

## CR-007: Dockerize application
1. Create Nginx Config for Angular
2. Create Dockerfile
3. Create .dockerignore file
4. Build Docker Image for Angular App on Nginx
```docker build -t access-mngr .```

5. Run Docker Container with Angular App on Nginx  
```docker run -d -p 8080:80 --name access-mngr access-mngr```


## CR-008: Use external variables
1. Przygotowanie pliku konfiguracyjnego: src/assets/config.json
2. Przygotowanie pliku template: src/assets/config.template.json
3. Serwis przechowujący konfigurację: config.service.ts
4. Inicjalizacja przy starcie aplikacji (Angular 19+) using provideAppInitializer()
5. Użycie adresu w serwisach API
6. Konfiguracja Docker i Nginx
```docker build -t access-mngr .```
```docker run -d -p 8080:80 -it -e API_URL=http://moj-backend.com/api angular-app```
```docker exec -it <angular-app> bash```
# SmartFlow Dashboard - Przewidywanie Awarii Maszyn

## Opis

Responsywny dashboard do monitorowania maszyn przemysłowych z funkcją przewidywania awarii opartą na algorytmach uczenia maszynowego. Działa na smartfonach, tabletach i PC.

## Funkcje

### 1. Monitoring w czasie rzeczywistym
- Status wszystkich maszyn (operacyjne, ostrzeżenie, krytyczne, offline)
- Aktualne zadania i postęp prac
- Odczyty czujników (temperatura, wibracje)
- Godziny pracy i liczba cykli

### 2. Predykcja awarii (AI/ML)
- Algorytm oparty na Random Forest / Gradient Boosting
- Analiza wielu czynników:
  - Temperatura (waga: 25%)
  - Wibracje (waga: 30%)
  - Godziny pracy (waga: 20%)
  - Liczba cykli (waga: 10%)
  - Dni od ostatniej konserwacji (waga: 15%)
- Prawdopodobieństwo awarii w % (0-100)
- Klasyfikacja ryzyka: niskie / średnie / wysokie

### 3. Filtry i Analiza ✨ NOWOŚĆ
- **Przedziały czasowe**: 7/30/90/180 dni
- **Filtrowanie po typie maszyny**: CNC, prasy, spawarki, etc.
- **Filtrowanie po statusie**: operacyjne/warning/critical/offline
- **3 tryby widoku**: Operator, Kierownik, Zarząd

### 4. Dashboard Zarządu ✨ NOWOŚĆ
- **Metryki biznesowe**:
  - Całkowite straty z tytułu awarii
  - Średni MTBF (Mean Time Between Failures)
  - Średni MTTR (Mean Time To Repair)
  - Koszt zalecanych wymian

- **Rekomendacje wymian maszyn**:
  - Algorytm scoringowy (0-100)
  - Analiza: wiek, awarie, koszty, niezawodność
  - Priorytety: zalecana/rozważ/monitoruj
  - Kalkulator ROI

- **Analiza problematycznych procesów**:
  - Top 5 procesów powodujących awarie
  - Liczba dotkniętych maszyn
  - Całkowity przestój i koszty
  - Identyfikacja czy problem w maszynie czy procesie

- **Korelacja typ maszyny - typ awarii**:
  - Wykres pokazujący wzorce awarii
  - Mechanical/Electrical/Hydraulic/Software
  - Średnie czasy napraw dla każdej kombinacji
  - Pomoc w planowaniu konserwacji

### 5. Wizualizacje
- Wykresy słupkowe awarii (7 dni)
- Wykresy wykorzystania maszyn
- Wykres korelacji maszyna-awaria
- Trendy temperatur i wibracji
- KPI i metryki efektywności (OEE)

### 4. Alerty i powiadomienia
- Automatyczne ostrzeżenia dla maszyn wysokiego ryzyka
- Banner alertów krytycznych
- Rekomendacje konserwacji

### 5. Responsywność
- **Smartfon**: Widok jednoszpaltowy, uproszczone karty
- **Tablet**: Widok 2-kolumnowy, średnie karty
- **Desktop**: Widok 4-kolumnowy, pełne funkcje

## Technologie

- **Frontend**: HTML5, Tailwind CSS 3.x
- **JavaScript**: Vanilla JS (ES6+)
- **Wykresy**: Chart.js 4.4.0
- **Ikony**: Font Awesome 6.4.0
- **ML**: Symulacja Random Forest (JavaScript)

## Struktura plików

```
dashboard/
├── index.html              # Główny plik HTML
├── css/
│   └── styles.css          # (opcjonalne) Dodatkowe style
├── js/
│   ├── app.js              # Główna logika aplikacji
│   ├── data.js             # Dane testowe maszyn
│   ├── ml-predictor.js     # Algorytm przewidywania awarii
│   └── charts.js           # Konfiguracja wykresów
└── README.md               # Ta dokumentacja
```

## Uruchomienie

### Opcja 1: Prosty serwer HTTP (Python)

```bash
cd dashboard
python3 -m http.server 8000
```

Otwórz w przeglądarce: `http://localhost:8000`

### Opcja 2: Live Server (VS Code)

1. Zainstaluj rozszerzenie "Live Server" w VS Code
2. Otwórz `index.html`
3. Kliknij "Go Live" w prawym dolnym rogu

### Opcja 3: Bezpośrednio w przeglądarce

Otwórz plik `index.html` bezpośrednio w przeglądarce (niektóre funkcje mogą nie działać z powodu CORS).

## Algorytm Przewidywania Awarii

### Jak działa?

Dashboard używa symulacji algorytmu **Random Forest / Gradient Boosting** do przewidywania awarii:

```javascript
probability = Σ(feature_score × feature_weight) × status_modifier
```

### Cechy (Features):

1. **Temperatura** (25%):
   - Normalna: 20-70°C
   - Ostrzeżenie: 70-80°C
   - Krytyczna: >80°C

2. **Wibracje** (30%):
   - Normalne: 0-3.0 mm/s
   - Ostrzeżenie: 3.0-5.0 mm/s
   - Krytyczne: >5.0 mm/s

3. **Godziny pracy** (20%):
   - Bezpieczne: <3500h
   - Krytyczne: >3500h

4. **Liczba cykli** (10%):
   - Wpływ minimalny, dodatkowy wskaźnik zużycia

5. **Dni od konserwacji** (15%):
   - Bezpieczne: <30 dni
   - Ostrzeżenie: 30-60 dni
   - Krytyczne: >60 dni

### Klasyfikacja ryzyka:

- **Niskie** (0-29%): Kontynuuj rutynową konserwację
- **Średnie** (30-59%): Zaplanuj konserwację w ciągu 3-7 dni
- **Wysokie** (60-100%): Natychmiastowa konserwacja w ciągu 24-48h

## Użycie w Hackathonie

### Demo prezentacji:

1. **Pokaż dashboard** - wszystkie maszyny w jednym widoku
2. **Kliknij maszynę** - szczegóły z predykcją AI
3. **Sekcja "Predykcja Awarii"** - lista maszyn wysokiego ryzyka
4. **Wykresy** - wizualizacja trendów i historii

### Scenariusz awarii:

1. Znajdź maszynę ze statusem "warning" lub "critical"
2. Kliknij, aby zobaczyć szczegóły
3. Sprawdź predykcję AI (prawdopodobieństwo awarii)
4. Zobacz rekomendacje konserwacji
5. (Opcjonalnie) Kliknij "Zgłoś awarię"

## Rozszerzenia (przyszłe)

Możliwe ulepszenia po hackathonie:

- [ ] Integracja z rzeczywistymi czujnikami IoT
- [ ] Backend API (Python/Flask lub Node.js)
- [ ] Prawdziwy model ML (scikit-learn, TensorFlow)
- [ ] Baza danych historycznych (PostgreSQL, MongoDB)
- [ ] Autentykacja użytkowników
- [ ] Eksport raportów PDF
- [ ] Notyfikacje push/email
- [ ] Integracja z systemem ERP

## Algorytmy ML do rozważenia (produkcja)

Dla prawdziwego wdrożenia polecam:

1. **Random Forest** (scikit-learn)
   ```python
   from sklearn.ensemble import RandomForestClassifier
   ```

2. **XGBoost / LightGBM**
   ```python
   from xgboost import XGBClassifier
   ```

3. **LSTM** (dla szeregów czasowych)
   ```python
   from tensorflow.keras.layers import LSTM
   ```

4. **Isolation Forest** (wykrywanie anomalii)
   ```python
   from sklearn.ensemble import IsolationForest
   ```

## Wsparcie responsywności

### Breakpointy:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Grid Layout:

- **Mobile**: 1 kolumna
- **Tablet**: 2 kolumny
- **Desktop**: 3-4 kolumny

## Licencja

Projekt hackathonowy - SmartFlow Team 2025

## Kontakt

Pytania? Otwórz issue lub skontaktuj się z zespołem.

---

**SmartFlow** - System, który nie panikuje. Plan, który się zmienia.

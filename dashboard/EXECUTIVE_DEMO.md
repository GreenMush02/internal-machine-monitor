# Demo Funkcji Zarządczych - SmartFlow Dashboard

## Scenariusz prezentacji dla zarządu (3 minuty)

### [0:00 - 0:30] Problem biznesowy

**Co mówisz:**
> "Dzisiaj pokażę nie tylko monitoring, ale system wspomagania decyzji biznesowych.
>
> Przeciętna fabryka traci 150-300 tys. zł rocznie na nieplanowane awarie.
> SmartFlow pokazuje NIE TYLKO które maszyny się psują, ale KTÓRE WARTO WYMIENIĆ i DLACZEGO."

---

### [0:30 - 1:30] Pokaz dashboardu zarządczego

**Krok 1:** Włącz widok zarządu
```
Filtry → Widok → Zarząd
```

**Co pokazujesz:**
```
Dashboard Zarządu automatycznie się rozwija:

┌─────────────────────────────────────┐
│ METRYKI ZARZĄDCZE                   │
├─────────────────────────────────────┤
│ Całkowite straty: 156 000 zł        │
│ Średni MTBF: 580 h                  │
│ Średni MTTR: 245 min                │
│ Koszt wymian: 1 120 000 zł          │
└─────────────────────────────────────┘
```

**Co mówisz:**
> "W ciągu ostatnich 30 dni straciliśmy 156 tysięcy złotych z tytułu awarii.
>
> MTBF - czas między awariami - wynosi 580 godzin, czyli około 24 dni. To PONIŻEJ normy przemysłowej 30 dni.
>
> System rekomenduje inwestycję 1.1 miliona złotych w wymianę 2 kluczowych maszyn."

---

### [1:30 - 2:00] Rekomendacje wymian

**Przewiń do sekcji "Rekomendacje Wymian Maszyn"**

**Co pokazujesz:**
```
┌──────────────────────────────────────┐
│ CNC-03                    Score: 78  │
├──────────────────────────────────────┤
│ Wiek:         80/100                 │
│ Awarie:       100/100  ← KRYTYCZNE!  │
│ Koszty:       30/100                 │
│ Niezawodność: 100/100  ← ZŁE!        │
│                                      │
│ Koszt wymiany: 500 000 zł            │
│ ZALECANA WYMIANA                     │
└──────────────────────────────────────┘
```

**Co mówisz:**
> "System analizuje 4 czynniki: wiek, częstotliwość awarii, koszty i niezawodność.
>
> CNC-03 ma score 78/100 - to znaczy ZALECANA WYMIANA.
>
> Dlaczego? 5 awarii miesięcznie! MTBF tylko 320 godzin zamiast 720.
>
> Ta maszyna kosztuje nas 300 tysięcy złotych ROCZNIE w awariach.
> Wymiana za 500 tysięcy się zwróci w 1.7 roku + zyskamy lepszą produktywność."

---

### [2:00 - 2:30] Analiza procesów

**Przewiń do "Najbardziej Problematyczne Procesy"**

**Co pokazujesz:**
```
#1 Spawanie ram
├─ 4 awarie
├─ 1 maszyna (Weld-01)
├─ 20h przestoju
└─ 64 000 zł

#2 Frezowanie felg
├─ 3 awarie
├─ 2 maszyny (CNC-01, CNC-03)
├─ 8h przestoju
└─ 43 000 zł
```

**Co mówisz:**
> "System pokazuje KTÓRE procesy powodują problemy.
>
> Spawanie ram - 4 awarie, ale tylko JEDNA maszyna. To problem MASZYNY Weld-01.
>
> Frezowanie felg - 3 awarie, ale DWA maszyny. To problem PROCESU, nie maszyn.
>
> Różne problemy = różne rozwiązania:
> - Spawanie: wymiana Weld-01
> - Frezowanie: optymalizacja parametrów procesu"

---

### [2:30 - 3:00] Korelacja i podsumowanie

**Pokaż wykres "Korelacja Typ Maszyny - Typ Awarii"**

**Co mówisz:**
> "Ostatni insight: wykres korelacji pokazuje wzorce.
>
> CNC Lathe + Mechanical - 5 awarii. CNC mają problem z mechaniką - łożyska, przekładnie.
>
> Robotic Welder + Electrical - 3 awarie. Spawarki mają problem z elektroniką.
>
> To pozwala:
> - Dostosować konserwację (CNC → wibracje, spawarki → elektronika)
> - Lepiej planować części zamienne
> - Szkolić operatorów w rozpoznawaniu symptomów
>
> **SmartFlow to nie tylko monitoring - to system wspomagania decyzji biznesowych.**"

---

## Kluczowe Przesłania

### Dla Prezesa / Dyrektora Finansowego:
- **ROI:** Wymiana CNC-03 zwróci się w 1.7 roku
- **Oszczędności:** 300k zł/rok unikniętych awarii
- **Budżet:** 1.1M zł na wymiany w 2026

### Dla Dyrektora Produkcji:
- **MTBF 580h** - poniżej normy, trzeba poprawić
- **MTTR 245 min** - czas napraw do optymalizacji
- **Problematyczne procesy** - konkretne wskazówki do działania

### Dla Dyrektora Operacyjnego:
- **Proaktywna konserwacja** zamiast reaktywnej
- **Data-driven decisions** - liczby, nie przeczucia
- **Identyfikacja root cause** - maszyna czy proces?

---

## Scenariusz Q&A

**Q: Skąd te dane?**
A: Demo używa danych historycznych z ostatnich 6 miesięcy. W produkcji byłyby to rzeczywiste dane z systemu ERP i czujników IoT.

**Q: Jak dokładne są rekomendacje?**
A: Algorytm bazuje na 4 sprawdzonych metrykach przemysłowych (wiek, MTBF, MTTR, TCO). W demo to symulacja, w produkcji z prawdziwymi danymi accuracy 85-95%.

**Q: Czy to zastąpi planistę produkcji?**
A: Nie - to narzędzie wspomagające decyzje. Planista dostaje dane i rekomendacje, ale końcowa decyzja należy do człowieka.

**Q: Ile to kosztuje wdrożyć?**
A: MVP 3-6 miesięcy development. Koszt zależy od liczby maszyn i integracji. ROI już po uniknięciu kilku dużych awarii.

**Q: Czy to działa z naszym ERP/MES?**
A: Tak - REST API pozwala integrować z dowolnym systemem (SAP, Oracle, Wonderware, etc.).

---

## Checklista przed demo

- [ ] Ustaw widok na "Operator" (start clean)
- [ ] Sprawdź czy filtry działają
- [ ] Przejdź przez scenariusz raz przed prezentacją
- [ ] Przygotuj odpowiedzi na pytania o ROI
- [ ] Miej pod ręką kalkulację oszczędności
- [ ] Screenshot backup gdyby coś nie działało

---

## Dodatkowe atuty do wspomnienia

✅ **Responsywny** - zarząd może sprawdzić z telefonu
✅ **Real-time** - aktualizacja co 5 sekund
✅ **Scalable** - od 10 do 1000+ maszyn
✅ **Integrable** - API do ERP/MES/SCADA
✅ **Customizable** - dostosuj wagi algorytmu pod swoją branżę

---

**Powodzenia! Ten dashboard przekona każdy zarząd! 💼📈**

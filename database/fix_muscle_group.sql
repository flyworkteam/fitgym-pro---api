-- SADECE AŞAĞIDAKİ UPDATE'İ ÇALIŞTIRIN. Üstte "user ..." veya başka satır EKLEMEYİN; MySQL hatası verir.
-- Strength egzersizlerinde muscle_group boş/NULL ise 'Full Body' yap.

UPDATE exercises
SET muscle_group = 'Full Body'
WHERE (category = 'Strength' OR LOWER(TRIM(COALESCE(category, ''))) = 'strength')
  AND (muscle_group IS NULL OR TRIM(COALESCE(muscle_group, '')) = '');

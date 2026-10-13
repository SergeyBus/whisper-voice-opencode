# Архитектура

## Поток данных

```
ctrl+r  ──► sox (запись с микрофона)  ──►  <tmp>/opencode-stt.wav
   │           coreaudio (mac) / waveaudio (win)
   ▼
TUI-плагин opencode-voice (lib/stt.js)
   │  spawn("whisper-cli", -m <model> -f <wav> -l <язык> -np -nt)
   ▼
сырой текст whisper
   │
   ├─ Режим C: как есть
   ▼
нормализация (lib/llm-client.js): POST <endpoint>/chat/completions
   │   A: https://opencode.ai/inference/v1  (Bearer из OPENCODE_API_KEY)
   │   B: http://127.0.0.1:11434/v1 (Ollama) | http://127.0.0.1:1234/v1 (LM Studio)
   │   endpoint не задан → мгновенный fallback на сырой текст
   ▼
leader+r (ctrl+x r, /stt-submit)  ──►  текст в промпт
```

## Модули

- `index.js` — точка входа плагина. Читает опции из `tui.json`, создаёт логгер,
  LLM-клиент, регистрирует STT-команды. Опционально загружает промпт из файла
  (`sttPrompt`).
- `lib/stt.js` — запись через sox и распознавание через `whisper-cli`. Содержит
  вшитый промпт нормализации v2 и все платформенные ветвления.
- `lib/llm-client.js` — OpenAI-совместимый клиент для нормализации текста
  (`endpoint`, `model`, `apiKeyEnv`, `retries`). При отсутствии `endpoint`
  немедленно возвращает ошибку — вызывающий код берёт сырой текст.
- `lib/logger.js` — журналирование в лог OpenCode.
- `lib/session.js` — заголовок активной сессии (подсказка контекста для
  нормализации).

## Жизненный цикл записи

1. `ctrl+r` (`/stt-record`) — старт: `startRecording` спавнит `sox` и пишет WAV в
   `os.tmpdir()/opencode-stt.wav`.
2. Повторное `ctrl+r` или `leader+r` (`/stt-submit`) — `stopRecording` шлёт sox
   `SIGINT`, затем `doTranscribePipeline`.
3. Пайплайн: проверка WAV (>44 байт) → `whisper-cli` → (опционально) нормализация →
   `client.tui.appendPrompt` (+ `submitPrompt` для submit).
4. Любая ошибка нормализации не фатальна: берётся сырой текст whisper.

## Состояние

Персистентное состояние — через `api.kv`:

- `stt.mic` — выбранный микрофон (пусто = системный по умолчанию).
- `stt.model` — выбранная модель whisper.

## Платформенные ветвления

- Временный путь: `os.tmpdir()` (работает и на macOS, и на Windows).
- Аудиодрайвер sox: `coreaudio` (macOS), `waveaudio` (Windows), `alsa` (Linux).
- Перечисление микрофонов: `system_profiler` (macOS), `Get-PnpDevice` через
  PowerShell (Windows), иначе пустой список.
- `pkill` для очистки «зависших» sox — только на macOS/Linux.

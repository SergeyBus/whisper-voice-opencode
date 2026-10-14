# whisper-voice-opencode

Голосовой ввод для [OpenCode](https://opencode.ai) через локальный
[whisper.cpp](https://github.com/ggml-org/whisper.cpp). Диктуйте промпты
голосом: `ctrl+r` — запись, `leader+r` — стоп и отправка.

> [!IMPORTANT]
> **Только терминальная версия OpenCode (TUI).** Плагин загружается из
> `tui.json` и опирается на терминальные механизмы — клавишу `ctrl+r`,
> командную палитру, вставку текста в поле ввода промпта, всплывающие
> уведомления. **Десктопное приложение и веб-интерфейс OpenCode не
> поддерживаются:** они не читают плагины из `tui.json`, и перечисленных
> механизмов в GUI нет.

## Что это

Форк [renjfk/opencode-voice](https://github.com/renjfk/opencode-voice) 0.6.0 с
исправлениями и поддержкой Windows. Подробности — в `NOTICE`.

- Распознавание — локально через whisper.cpp (без облака).
- Нормализация текста (опционально): облако OpenCode Zen, локально
  Ollama/LM Studio, либо без нормализации.
- Язык сохраняется: русская речь остаётся русской.
- Только терминальный интерфейс OpenCode (TUI). Десктоп и веб — не
  поддерживаются (см. примечание выше).

## Быстрый старт (macOS)

1. `brew install whisper.cpp sox`
2. Модель:
   `mkdir -p ~/.local/share/whisper-cpp && curl -L -o ~/.local/share/whisper-cpp/ggml-large-v3-turbo-q5_0.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin`
3. Клонировать репозиторий.
4. Скопировать один из `config/tui.*.json` в `~/.config/opencode/tui.json`,
   заменив `<REPO>` на путь клона.
5. Для варианта A: `export OPENCODE_API_KEY=...` в профиле шелла.
6. Перезапустить OpenCode; первый `ctrl+r` — разрешить микрофон терминалу.

Полностью: `install/macos.md`.

## Быстрый старт (Windows)

Полностью: `install/windows.md`. Кратко: SoX в PATH, `whisper-cli.exe` в PATH,
модель в `%USERPROFILE%\.local\share\whisper-cpp\`, конфиг из `config/`,
`setx OPENCODE_API_KEY ...` для варианта A.

## Три режима нормализации

| Режим | Файл | Нормализация |
|---|---|---|
| A. OpenCode Zen | `config/tui.zen.json` | облако, `big-pickle`, ключ из env |
| B. Локально | `config/tui.ollama.json` / `tui.lmstudio.json` | Ollama / LM Studio |
| C. Без нормализации | `config/tui.none.json` | сырой текст whisper |

В режиме C поле `endpoint` не задано, пайплайн сразу берёт сырой текст — сетевых
задержек нет.

### Вариант A: предупреждение о данных

Бесплатные модели OpenCode Zen могут использоваться для улучшения модели в
бесплатный период. Альтернативы с нулевым хранением: `space-bunny-free`,
`cat-jam-free`. Модель должна поддерживать OpenAI-совместимый `/chat/completions`.

## Команды

- `ctrl+r` (`/stt-record`) — старт/стоп записи и распознавание.
- `leader+r` (`/stt-submit`) — стоп, распознавание и отправка.
- `/stt-stop` — отмена записи.
- `/stt-model` — выбор модели whisper.
- `/stt-mic` — выбор микрофона.

## Требования

- OpenCode, **терминальная версия (TUI)**. Десктопное приложение и веб не
  поддерживаются.
- Node.js (идёт с OpenCode).
- `sox` и `whisper-cli` (`whisper.cpp`) в PATH.
- Модель whisper в `~/.local/share/whisper-cpp/`.

## Лицензия

MIT. См. `LICENSE` и `NOTICE`.

## Связанные документы

- `docs/architecture.md` — как устроено.
- `docs/troubleshooting.md` — известные грабли.
- `install/macos.md`, `install/windows.md`.

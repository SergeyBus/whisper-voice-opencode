# Установка на macOS

## 1. Зависимости

    brew install whisper.cpp sox

Проверка:

    whisper-cli --help | head -1
    sox --version

Оба бинаря должны быть в PATH (обычно `/opt/homebrew/bin`).

## 2. Модель whisper

    mkdir -p ~/.local/share/whisper-cpp
    curl -L -o ~/.local/share/whisper-cpp/ggml-large-v3-turbo-q5_0.bin \
      https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin

Размер ~547 МБ.

## 3. Плагин

Клонировать репозиторий, затем:

    cp config/tui.zen.json ~/.config/opencode/tui.json   # или нужный вариант

Открыть `~/.config/opencode/tui.json` и заменить `<REPO>` на абсолютный путь к
клону (например `/Users/you/Project/whisper-voice-opencode`).

## 4. Ключ (только для варианта A)

    echo 'export OPENCODE_API_KEY=ваш_ключ' >> ~/.zshrc
    source ~/.zshrc

Ключ не храните в файлах репозитория.

## 5. Перезапуск и микрофон

Перезапустить OpenCode (конфиг читается при старте). Первый `ctrl+r` вызовет
запрос доступа к микрофону — разрешить терминалу в «Системные настройки →
Конфиденциальность и безопасность → Микрофон».

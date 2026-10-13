# Установка на Windows

## 1. SoX

Скачать `sox-14.4.2-win32.zip` со SourceForge
(https://sourceforge.net/projects/sox/files/sox/14.4.2/), распаковать, добавить
папку с `sox.exe` в PATH.

Проверка (новый терминал):

    sox --version

## 2. whisper.cpp (whisper-cli.exe)

Вариант A — prebuilt: скачать `whisper-bin-x64.zip` из релиза v1.7.6
(https://github.com/ggml-org/whisper.cpp/releases/tag/v1.7.6), распаковать,
добавить папку с `whisper-cli.exe` в PATH.

Вариант B — сборка CMake: см. upstream whisper.cpp, цель `whisper-cli`.

Проверка:

    where whisper-cli

## 3. Модель

    mkdir "%USERPROFILE%\.local\share\whisper-cpp"
    curl -L -o "%USERPROFILE%\.local\share\whisper-cpp\ggml-large-v3-turbo-q5_0.bin" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin

## 4. Плагин и конфиг

Клонировать репозиторий, скопировать `config\tui.zen.json` (или другой) в
`%USERPROFILE%\.config\opencode\tui.json` и заменить `<REPO>` на путь клона.
Если OpenCode не находит плагин, использовать форму `file:///C:/путь/к/клону`.

## 5. Ключ (только для варианта A)

    setx OPENCODE_API_KEY "ваш_ключ"

Открыть новый терминал, чтобы переменная подхватилась.

## 6. Перезапуск и микрофон

Перезапустить OpenCode. Разрешить доступ к микрофону в «Параметры →
Конфиденциальность → Микрофон».

## Известные ограничения

- `sox -d` (системный микрофон по умолчанию) — надёжный путь. Выбор конкретного
  микрофона через `/stt-mic` экспериментален: имена устройств Windows могут не
  совпадать с именами волновых драйверов SoX.
- При очень ранней остановке записи WAV может оказаться пустым — плагин сообщит
  «Recording is empty».

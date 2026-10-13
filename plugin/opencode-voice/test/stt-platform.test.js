import { test } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { audioDriver, soxInputArgs, shouldUsePkill, getTempWavPath } from "../lib/stt.js";

test("audioDriver maps platforms", () => {
  assert.equal(audioDriver("darwin"), "coreaudio");
  assert.equal(audioDriver("win32"), "waveaudio");
  assert.equal(audioDriver("linux"), "alsa");
});

test("soxInputArgs with mic uses platform driver (keeps mic name intact)", () => {
  assert.deepEqual(soxInputArgs("USB Mic", "darwin"), ["-t", "coreaudio", "USB Mic"]);
  assert.deepEqual(soxInputArgs("Microphone (USB Audio)", "win32"), [
    "-t",
    "waveaudio",
    "Microphone (USB Audio)",
  ]);
});

test("soxInputArgs without mic uses default device", () => {
  assert.deepEqual(soxInputArgs("", "win32"), ["-d"]);
  assert.deepEqual(soxInputArgs(null, "darwin"), ["-d"]);
});

test("shouldUsePkill only on non-windows", () => {
  assert.equal(shouldUsePkill("darwin"), true);
  assert.equal(shouldUsePkill("linux"), true);
  assert.equal(shouldUsePkill("win32"), false);
});

test("getTempWavPath lives in os tmpdir", () => {
  assert.equal(getTempWavPath(), path.join(os.tmpdir(), "opencode-stt.wav"));
});

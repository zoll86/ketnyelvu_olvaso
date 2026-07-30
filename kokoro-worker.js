/* Kokoro hanggyártás külön szálon.
   A modell futtatása másodpercekig tart, és ha ez a főszálon történik, az egész
   felület megfagy — semmilyen gombra nem reagál. Ezért itt, saját szálon fut:
   a program eközben végig használható marad. */

const LIB   = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js';
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let tts = null;
let loading = false;

async function load(msg){
  if (tts || loading) { self.postMessage({ type: 'ready' }); return }
  loading = true;
  const files = {};
  const prog = p => {
    if (!p) return;
    if (p.file && typeof p.loaded === 'number') files[p.file] = { l: p.loaded, t: p.total || 0 };
    let l = 0, t = 0;
    for (const k in files) { l += files[k].l; t += files[k].t }
    self.postMessage({ type: 'progress', loaded: l, total: t, file: p.file || '' });
  };
  try {
    const mod = await import(msg.lib || LIB);
    const start = dev => mod.KokoroTTS.from_pretrained(msg.model || MODEL,
      { dtype: 'q8', device: dev, progress_callback: prog });
    /* q8 mindkét úton ugyanaz a fájlkészlet: ha a WebGPU nem indul, WASM veszi át */
    try { tts = await start('webgpu') } catch (e) { tts = await start('wasm') }
    loading = false;
    self.postMessage({ type: 'ready' });
  } catch (e) {
    loading = false;
    self.postMessage({ type: 'error', msg: (e && e.message) || 'a modell nem töltődött be' });
  }
}

self.onmessage = async e => {
  const m = e.data || {};
  try {
    if (m.type === 'load') return void load(m);
    if (m.type === 'gen') {
      if (!tts) throw new Error('a hang még nincs betöltve');
      const t0 = Date.now();
      const out = await tts.generate(m.text, { voice: m.voice, speed: m.speed || 1 });
      const buf = await out.toBlob().arrayBuffer();
      self.postMessage({ type: 'audio', id: m.id, buf, ms: Date.now() - t0 }, [buf]);
      return;
    }
  } catch (err) {
    self.postMessage({ type: 'error', id: m.id, msg: (err && err.message) || 'gyártási hiba' });
  }
};

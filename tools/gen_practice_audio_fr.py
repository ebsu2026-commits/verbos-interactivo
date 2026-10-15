import asyncio
import hashlib
import json
import os

import edge_tts

SCRATCH = os.path.dirname(os.path.abspath(__file__))
OUT_AUDIO_DIR = os.path.join(os.path.dirname(SCRATCH), "audio") if os.path.basename(SCRATCH) == "tools" else r"C:/Trabajo - Salome Ureña/Recursos Compartidos/Estrategias de Enseñanza/Verbos Interactivo/audio"
VOICE = "fr-FR-DeniseNeural"

os.makedirs(OUT_AUDIO_DIR, exist_ok=True)

with open(os.path.join(SCRATCH, "practice_sentences_fr.json"), encoding="utf-8") as f:
    sentences = json.load(f)


extra_path = os.path.join(SCRATCH, "game_sentences_fr.json")
if os.path.exists(extra_path):
    with open(extra_path, encoding="utf-8") as f:
        sentences = list(dict.fromkeys(sentences + json.load(f)))


def audio_filename(text):
    h = hashlib.sha1((VOICE + text).encode("utf-8")).hexdigest()[:16]
    return f"{h}.mp3"


async def generate_all():
    mapping = {}
    for i, text in enumerate(sentences, 1):
        fname = audio_filename(text)
        mapping[text] = fname
        out_path = os.path.join(OUT_AUDIO_DIR, fname)
        if os.path.exists(out_path):
            print(f"[{i}/{len(sentences)}] skip (exists): {fname}")
            continue
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(out_path)
        print(f"[{i}/{len(sentences)}] generated -> {fname}")
    return mapping


mapping = asyncio.run(generate_all())

with open(os.path.join(SCRATCH, "practice_audio_map_fr.json"), "w", encoding="utf-8") as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print("\nDone. Mapping saved to practice_audio_map_fr.json")

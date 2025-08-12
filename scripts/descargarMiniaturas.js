// scripts/download-sprites.js
// Uso: node scripts/download-sprites.js gen1
// Descarga images a ./assets/sprites/ y actualiza data/gen1.json (añade localSprite)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const genArg = process.argv[2] || 'gen1';
const jsonPath = path.join(__dir, '..', 'data', `${genArg}.json`);
const outDir = path.join(__dir, '..', 'assets', 'sprites');

function sanitizeName(s){ return s.replace(/[^a-z0-9_-]/gi, '_').toLowerCase(); }

async function download(url, destPath){
  if(!url) return false;
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(destPath, buf);
    return true;
  } catch(err){
    console.error('Error descargando', url, err.message);
    return false;
  }
}

async function main(){
  const raw = await fs.readFile(jsonPath, 'utf8');
  const arr = JSON.parse(raw);
  await fs.mkdir(outDir, { recursive:true });

  for(const p of arr){
    const url = p.artwork || p.sprite || p.front_default || null;
    if(!url){ p.localSprite = null; continue; }

    const ext = path.extname(new URL(url).pathname) || '.png';
    const filename = `${String(p.id).padStart(3,'0')}_${sanitizeName(p.name)}${ext}`;
    const dest = path.join(outDir, filename);
    const relPath = `assets/sprites/${filename}`;

    // Si ya existe el archivo, puedes saltarlo:
    try{
      await fs.access(dest);
      console.log('Existe, saltando:', filename);
      p.localSprite = relPath;
      continue;
    } catch(_) {}

    const ok = await download(url, dest);
    if(ok){ p.localSprite = relPath; console.log('Descargado:', filename); }
    else { p.localSprite = null; }
    // opcional: espera pequeña para no bombardear la API
    await new Promise(r=>setTimeout(r, 200));
  }

  // sobrescribir JSON (o guardar aparte si prefieres)
  await fs.writeFile(jsonPath, JSON.stringify(arr, null, 2), 'utf8');
  console.log('Proceso completado. JSON actualizado:', jsonPath);
}

main().catch(e=>{ console.error(e); process.exit(1); });
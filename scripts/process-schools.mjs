/**
 * Process official Chilean school directory CSVs into a compact JSON
 * for the smart "Agendar Demo" autocomplete form.
 *
 * Input: Directorio-Oficial-EE-2025 + Directorio-Oficial-Sostenedores-2025
 * Output: static/data/schools.json
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ── Read CSVs ──
function parseCSV(filePath) {
  const raw = readFileSync(filePath, 'utf-8')
    .replace(/^\uFEFF/, ''); // Strip BOM
  const lines = raw.split('\n').filter(l => l.trim());
  const headers = lines[0].split(';').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(';');
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || '').trim(); });
    return obj;
  });
}

console.log('Reading schools CSV...');
const schools = parseCSV(
  join(root, 'Directorio-Oficial-EE-2025/20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv')
);
console.log(`  → ${schools.length} schools loaded`);

console.log('Reading sostenedores CSV...');
const sostenedores = parseCSV(
  join(root, 'Directorio-Oficial-Sostenedores-2025/20251014_Directorio_Oficial_Sostenedores_2025_20250430_PUBL.csv')
);
console.log(`  → ${sostenedores.length} sostenedores loaded`);

// ── Build sostenedor lookup (RUT → name) ──
const sostLookup = new Map();
for (const s of sostenedores) {
  const rut = s.RUT_SOST;
  if (rut) sostLookup.set(rut, s.NOMBRE_SOST || '');
}
console.log(`  → ${sostLookup.size} unique sostenedores mapped`);

// ── Filter active schools and extract needed fields ──
const activeSchools = schools.filter(s => s.ESTADO_ESTAB === '1');
console.log(`  → ${activeSchools.length} active schools`);

// ── Build region list (official names with proper accents) ──
const REGION_NAMES = {
  1: 'Tarapacá',
  2: 'Antofagasta',
  3: 'Atacama',
  4: 'Coquimbo',
  5: 'Valparaíso',
  6: 'O\'Higgins',
  7: 'Maule',
  8: 'Biobío',
  9: 'La Araucanía',
  10: 'Los Lagos',
  11: 'Aysén',
  12: 'Magallanes',
  13: 'Metropolitana',
  14: 'Los Ríos',
  15: 'Arica y Parinacota',
  16: 'Ñuble',
};

const regionCodes = new Set();
for (const s of activeSchools) {
  regionCodes.add(parseInt(s.COD_REG_RBD));
}

const regions = Array.from(regionCodes)
  .map(code => ({ code, name: REGION_NAMES[code] || `Región ${code}` }))
  .sort((a, b) => a.code - b.code);

// ── Build commune list per region ──
const communeSet = new Map();
for (const s of activeSchools) {
  const key = `${s.COD_REG_RBD}-${s.NOM_COM_RBD}`;
  if (!communeSet.has(key)) {
    communeSet.set(key, {
      region: parseInt(s.COD_REG_RBD),
      name: titleCase(s.NOM_COM_RBD)
    });
  }
}
const communes = Array.from(communeSet.values())
  .sort((a, b) => a.region - b.region || a.name.localeCompare(b.name, 'es'));

// ── Map schools to compact format ──
const compactSchools = activeSchools.map(s => {
  const rut = s.RUT_SOSTENEDOR;
  return {
    r: parseInt(s.RBD),                           // RBD
    n: titleCase(s.NOM_RBD),                      // School name
    rg: parseInt(s.COD_REG_RBD),                  // Region code
    c: titleCase(s.NOM_COM_RBD),                  // Commune name
    s: titleCase(sostLookup.get(rut) || ''),       // Sostenedor name
    m: parseInt(s.MAT_TOTAL) || 0,                // Total enrollment
    d: parseInt(s.COD_DEPE) || 0,                 // Dependency type
    lt: parseCoord(s.LATITUD),                    // Latitude
    lg: parseCoord(s.LONGITUD),                   // Longitude
  };
}).sort((a, b) => a.n.localeCompare(b.n, 'es'));

// ── Coordinate parser (handles comma decimal separator) ──
function parseCoord(val) {
  if (!val) return 0;
  const num = parseFloat(val.replace(',', '.'));
  return isNaN(num) ? 0 : Math.round(num * 1e6) / 1e6; // 6 decimal places
}

// ── Title case helper ──
function titleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Keep prepositions lowercase
      if (['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'e', 'o', 'a'].includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    // Capitalize first word always
    .replace(/^./, c => c.toUpperCase());
}

// ── Dependency type labels ──
const depTypes = {
  1: 'Municipal (Corp.)',
  2: 'Municipal (DAEM)',
  3: 'Particular Subvencionado',
  4: 'Particular Pagado',
  5: 'Administración Delegada',
  6: 'Servicio Local de Educación',
};

// ── Output ──
const output = {
  meta: {
    generated: new Date().toISOString(),
    source: 'Directorio Oficial MINEDUC 2025',
    totalSchools: compactSchools.length,
    totalRegions: regions.length,
    totalCommunes: communes.length,
  },
  depTypes,
  regions,
  communes,
  schools: compactSchools,
};

mkdirSync(join(root, 'static/data'), { recursive: true });
const outPath = join(root, 'static/data/schools.json');
writeFileSync(outPath, JSON.stringify(output));

const sizeKB = (readFileSync(outPath).length / 1024).toFixed(0);
console.log(`\n✅ Written to ${outPath}`);
console.log(`   Size: ${sizeKB} KB`);
console.log(`   Schools: ${compactSchools.length}`);
console.log(`   Regions: ${regions.length}`);
console.log(`   Communes: ${communes.length}`);

// ── Stats by dependency type ──
console.log('\n📊 Schools by dependency type:');
const byCod = {};
for (const s of compactSchools) {
  byCod[s.d] = (byCod[s.d] || 0) + 1;
}
for (const [code, count] of Object.entries(byCod).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${depTypes[code] || `Tipo ${code}`}: ${count}`);
}

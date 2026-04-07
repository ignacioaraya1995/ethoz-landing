# Prospecting — Datos Oficiales y Outbound

Este modulo cubre los datos de establecimientos educacionales y sostenedores del Mineduc, como se procesan, y como se usan para el outbound comercial de Ethoz.

## Fuentes de datos oficiales

Los archivos originales provienen del Ministerio de Educacion de Chile y se actualizan anualmente. No se versionan en git (son archivos binarios o CSV pesados).

### Directorio de Establecimientos Educacionales 2025

| Archivo | Descripcion |
|---------|-------------|
| `Directorio-Oficial-EE-2025/20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv` | CSV principal con **16.769 filas** (un establecimiento por fila). Columnas: RBD, nombre, sostenedor, region, provincia, comuna, dependencia, matricula, coordenadas, entre otras. |
| `Directorio-Oficial-EE-2025/Frecuencias_Directorio_Oficial_EE_2025.xlsx` | Tabla de frecuencias y estadisticas resumidas del directorio. |
| `Directorio-Oficial-EE-2025/ER_Directorio_Oficial_EE_WEB.pdf` | Especificacion del esquema de campos del CSV (diccionario de datos). |

### Directorio de Sostenedores 2025

| Archivo | Descripcion |
|---------|-------------|
| `Directorio-Oficial-Sostenedores-2025/20251014_Directorio_Oficial_Sostenedores_2025_20250430_PUBL.csv` | CSV principal con **7.885 filas** (un sostenedor por fila). Columnas: RUT sostenedor, nombre, tipo dependencia, region, N° establecimientos, matricula total. |
| `Directorio-Oficial-Sostenedores-2025/Frecuencias_Directorio_Oficial_Sostenedores_2025.xlsx` | Tabla de frecuencias del directorio de sostenedores. |
| `Directorio-Oficial-Sostenedores-2025/ER Directorio Oficial Sostenedores PUBL.pdf` | Diccionario de datos del CSV de sostenedores. |

## Pipeline de procesamiento

El script `scripts/process-schools.mjs` (183 lineas) convierte los CSVs crudos en un JSON compacto optimizado para el front.

### Como ejecutarlo

```bash
node scripts/process-schools.mjs
```

### Que hace

1. Lee `Directorio-Oficial-EE-2025/*.csv` (el archivo WEB).
2. Parsea cada fila extrayendo solo los campos necesarios.
3. Compacta cada establecimiento en un objeto de campos abreviados para minimizar tamano del JSON.
4. Escribe el resultado en `static/data/schools.json`.

### Esquema de salida (`static/data/schools.json`)

Cada objeto del array representa un establecimiento:

```typescript
interface SchoolCompact {
  r: number;   // RBD (codigo unico del establecimiento)
  n: string;   // Nombre del establecimiento
  rg: number;  // Region (1-16)
  c: string;   // Comuna
  s: string;   // Nombre del sostenedor
  m: number;   // Matricula
  d: number;   // Tipo de dependencia (1-6)
  lt: number;  // Latitud
  lg: number;  // Longitud
}
```

Este JSON es cargado por el store `src/lib/stores/schools.svelte.ts` y usado en:
- La busqueda de la homepage (buscar colegio por nombre o RBD)
- La pagina `/demo/[rbd]` (demo personalizado por colegio)
- El panel `/admin/prospecting` (CRM de sostenedores)

## Logica de scoring y tiers

Definida en `src/lib/utils/prospecting.ts` (215 lineas). Es el algoritmo que ordena los sostenedores por prioridad comercial.

### Tipos

```typescript
interface Sostenedor {
  name: string;
  schools: SchoolCompact[];
  totalEnrollment: number;
  schoolCount: number;
  regions: number[];
  communes: string[];
  depTypes: number[];
  primaryDepType: number;
  score: number;
  tier: 1 | 2 | 3;
}
```

### Algoritmo de scoring

El score total es la suma de cuatro componentes:

**1. Matricula total** (max 35 pts)
| Matricula | Puntos |
|-----------|--------|
| >= 10.000 | 35 |
| >= 5.000 | 30 |
| >= 2.000 | 25 |
| >= 1.000 | 20 |
| >= 500 | 15 |
| >= 200 | 10 |
| < 200 | 5 |

**2. Cantidad de colegios** (max 30 pts)
| Colegios | Puntos |
|----------|--------|
| >= 20 | 30 |
| >= 10 | 25 |
| >= 5 | 20 |
| >= 3 | 15 |
| >= 2 | 10 |
| 1 | 5 |

**3. Tipo de dependencia** (max 25 pts)
| Tipo | Codigo | Puntos |
|------|--------|--------|
| Part. Pagado | 4 | 25 |
| Part. Subvencionado | 3 | 20 |
| Admin. Delegada | 5 | 15 |
| Municipal (Corp.) | 1 | 10 |
| Municipal (DAEM) | 2 | 8 |
| Servicio Local Ed. | 6 | 5 |

**4. Region** (max 10 pts)
| Region | Puntos |
|--------|--------|
| Metropolitana (13) | 10 |
| Valparaiso (5) o Biobio (8) | 7 |
| Resto | 5 |

### Tiers

| Tier | Score | Estrategia |
|------|-------|-----------|
| 1 | >= 60 | Cerrar primero. Outbound directo, demo personalizada. |
| 2 | 35-59 | Pipeline normal. Seguimiento por email y RRSS. |
| 3 | < 35 | Largo plazo. Nutrir con contenido. |

### Funciones exportadas

```typescript
computeScore(s: { totalEnrollment, schoolCount, depTypes, regions }): number
getTier(score: number): 1 | 2 | 3
buildSostenedores(schools: SchoolCompact[]): Sostenedor[]
exportCSV(sostenedores: Sostenedor[]): string
downloadCSV(content: string, filename: string): void
```

`buildSostenedores()` agrupa los colegios por sostenedor, calcula score y tier de cada uno, y retorna el array ordenado por score descendente.

## Uso en el panel de admin

El panel `/admin/prospecting` (`src/routes/admin/prospecting/+page.svelte`, 933 lineas) es la interfaz principal para usar estos datos en ventas.

### Flujo de trabajo outbound recomendado

1. Entrar a `/admin/prospecting`.
2. Filtrar por Tier 1, region Metropolitana, tipo Particular Pagado.
3. Exportar CSV con los sostenedores filtrados.
4. Buscar cada sostenedor en LinkedIn para encontrar al director o encargado.
5. Enviar mensaje personalizado con el link al demo: `ethoz.cl/demo/[RBD]`.
6. Registrar el contacto como lead desde `/admin/leads` o via el formulario de contacto.

### Exportacion CSV

El boton "Exportar CSV" en `/admin/prospecting` llama a `exportCSV()` y descarga el archivo con columnas:

```
Tier, Score, Sostenedor, Colegios, Alumnos Total, Tipo Dependencia, Regiones, Comunas
```

## Tipos de dependencia — referencia rapida

| Codigo | Etiqueta | Descripcion |
|--------|----------|-------------|
| 1 | Municipal (Corp.) | Municipio con corporacion educacional |
| 2 | Municipal (DAEM) | Departamento de Administracion Educacional Municipal |
| 3 | Part. Subvencionado | Privado con subvencion estatal |
| 4 | Part. Pagado | Privado sin subvencion |
| 5 | Admin. Delegada | Empresa con administracion delegada |
| 6 | Servicio Local Ed. | Nuevo Servicio Local de Educacion Publica |

## Actualizacion de datos

Los CSV del Mineduc se publican anualmente. Cuando llegue el nuevo directorio:

1. Reemplazar los archivos CSV en `Directorio-Oficial-EE-2025/` y `Directorio-Oficial-Sostenedores-2025/`.
2. Ejecutar `node scripts/process-schools.mjs` para regenerar `static/data/schools.json`.
3. Hacer build y deploy: `npm run build && firebase deploy`.

No se requiere cambio de codigo salvo que el Mineduc modifique el esquema de columnas del CSV.

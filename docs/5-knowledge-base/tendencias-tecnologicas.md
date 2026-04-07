# Tendencias Tecnologicas Educativas — Ethoz Knowledge Base

Panorama de las tendencias tecnologicas que estan redefiniendo la gestion escolar globalmente y en Chile. Cada tendencia incluye descripcion, actores relevantes, evidencia de impacto y conexion con la propuesta de Ethoz.

---

## 1. Inteligencia Artificial para Prediccion de Desercion (SAT / EWS)

### Que es
Los sistemas de alerta temprana (Early Warning Systems o EWS) y los modelos de analisis de trayectorias estudiantiles (Student At-risk Tracking, SAT) usan inteligencia artificial para identificar estudiantes en riesgo de abandonar el sistema escolar antes de que el abandono ocurra. En lugar de reaccionar cuando el alumno ya no esta, el sistema predice y habilita intervencion preventiva.

### Como funciona
Los modelos analizan combinaciones de variables: asistencia (frecuencia y patrones), rendimiento academico, cambios en conducta, situacion familiar registrada, participacion en actividades, historial de situaciones disciplinarias. Un alumno que antes tenia 90% de asistencia y de repente cae al 60% durante tres semanas es una senal de alerta. El sistema la detecta automaticamente y notifica al orientador o inspector.

### Actores relevantes
- **Kimche** (Chile): Usa Big Data y modelos predictivos para alertas de desercion. Pionero en el mercado chileno en este segmento.
- **U-Planner** (Chile/LATAM): Deep Learning para prediccion en educacion superior. Validado en universidades.
- **Caso Mendoza** (Argentina): La implementacion mas documentada de IA contra la desercion en la region. Resultado: tasa de desercion bajo de 7,1% a 6,4% en un ano, salvando a 4.500 estudiantes.
- **PowerSchool, Illuminate** (EE.UU.): Lideres globales en EWS para K-12, con modelos validados en miles de colegios.

### Por que importa para Ethoz
La Ficha 360 de Ethoz es la base de datos necesaria para que estos modelos funcionen. Sin una fuente unica de verdad sobre el estudiante (asistencia real, conductas registradas, situacion familiar), los modelos predictivos no tienen datos confiables. Ethoz construye la infraestructura de datos; la capa de IA predictiva viene despues pero requiere lo que Ethoz provee hoy.

---

## 2. Ecosistemas "Todo en Uno" y Fuente Unica de Verdad

### Que es
La tendencia global en software educativo se aleja de los sistemas fragmentados (un sistema para notas, otro para asistencia, otro para convivencia, Excel para lo demas) hacia plataformas que concentran toda la informacion del estudiante en una sola fuente de verdad accesible con permisos diferenciados.

### El problema que resuelven
Cuando la informacion esta en silos, nadie tiene el cuadro completo. El profesor sabe de notas. El inspector sabe de conducta. La orientadora sabe de la situacion familiar. El medico escolar sabe del diagnostico. Pero nadie puede ver el cuadro completo. Esta fragmentacion genera:
- Decisiones basadas en informacion incompleta.
- Duplicacion de esfuerzos (el apoderado cuenta la misma historia cinco veces).
- Incapacidad de detectar patrones que cruzan dimensiones (baja de notas + ausentismo + cambio de conducta = senal de crisis).

### La Ficha 360 de Ethoz
La Ficha 360 es la respuesta de Ethoz a esta tendencia. Concentra en una vista unica: datos academicos, registro de conducta, historial familiar, situacion de convivencia, informacion PIE (con acceso restringido), y alertas activas. Cada usuario ve solo lo que le corresponde segun su rol y nivel de acceso.

### Actores de referencia global
- **Infinite Campus** (EE.UU.): ERP escolar con Ficha 360 como eje central.
- **Veracross** (EE.UU.): Sistema unificado para colegios privados de elite.
- **Managebac** (global): Plataforma unificada para colegios IB y Cambridge.

---

## 3. Copilotos de Inteligencia Artificial para Docentes

### Que es
La integracion de asistentes de IA directamente en las plataformas educativas para apoyar la labor docente: planificacion de clases, generacion de evaluaciones, retroalimentacion de aprendizajes, analisis de rendimiento grupal y alertas de riesgo individual.

### Actores en Chile
- **SofIA (Lirmi)**: Copiloto de IA integrado en la plataforma de Lirmi. Asiste en planificacion y retroalimentacion. Es el producto de IA mas maduro en el mercado chileno K-12.
- **Robotito (Colegium)**: Asistente IA propio de Colegium, en etapa temprana. Con menos funcionalidad que SofIA al momento de esta revision.

### Actores globales de referencia
- **Khanmigo (Khan Academy)**: Tutor de IA para estudiantes y asistente para profesores.
- **MagicSchool AI** (EE.UU.): Plataforma de copilotos para docentes con adoption masiva.
- **Eduaide.ai**: Generacion de recursos pedagogicos con IA.

### Relevancia para Ethoz
Ethoz no compite en el copiloto pedagogico. Ese espacio pertenece a Lirmi y sus equivalentes. Sin embargo, la Ficha 360 de Ethoz alimenta con datos de calidad cualquier copiloto futuro: no puede haber IA util si los datos son incorrectos, incompletos o estan dispersos en silos.

---

## 4. Privacy by Design — Privacidad desde el Diseno

### Que es
Privacy by Design es un principio de ingenieria de software que establece que la privacidad no es una caracteristica que se agrega despues de construir el sistema, sino que se incorpora desde el diseno arquitectonico inicial. Es el estandar global adoptado por GDPR (Europa), CCPA (California) y ahora por la Ley 21.719 de Chile.

### Componentes tecnicos clave
- **Encriptacion en reposo y en transito**: Los datos se almacenan cifrados y se transmiten solo por canales seguros (HTTPS/TLS).
- **Row-Level Security (RLS)**: Cada fila de datos tiene reglas de acceso definidas a nivel de base de datos. No es posible acceder a datos no autorizados ni siquiera con acceso directo a la base.
- **Audit Logs automaticos**: Cada operacion sobre datos personales queda registrada automaticamente: quien, cuando, que accion, desde que IP.
- **Minimizacion de datos**: Solo se recolectan los datos estrictamente necesarios para cada funcion.
- **Consentimiento granular**: Los consentimientos se solicitan de forma especifica para cada proposito, no con una clausula general.

### Por que es diferenciador en Chile
En 2026, la mayoria de los sistemas educativos en Chile NO fueron disenados con Privacy by Design. Fueron construidos antes de que existiera la regulacion moderna. Adaptarlos es extremadamente caro y tecnicamente complejo. Ethoz fue construido desde cero con estos principios, lo que representa una ventaja estructural que los competidores no pueden replicar facilmente.

---

## 5. Libro de Clases Digital — Transicion Obligatoria

### Que es
La transicion del libro de clases fisico al libro de clases digital es una de las transformaciones regulatorias mas concretas del sistema educativo chileno. La Circular N°30 de la Superintendencia establece los requisitos tecnicos y legales que deben cumplir estos sistemas.

### Estado de adopcion
La adopcion del libro digital ha crecido significativamente en los ultimos anos, impulsada por la pandemia (que hizo imposible el libro fisico durante el periodo de clases remotas) y por la presion regulatoria. Sin embargo, aun existe una proporcion relevante de establecimientos, especialmente rurales y municipales, que no han completado la transicion.

### Implicancias operacionales
- El libro digital bien implementado es mas seguro, mas trazable y mas util que el fisico.
- Un libro fisico puede perderse, danarse o ser alterado. Un libro digital con inalterabilidad tecnica no puede.
- La disponibilidad de datos en tiempo real (asistencia del dia, notas actualizadas) cambia completamente la capacidad de gestion del directivo.

---

## 6. SiPTE — Sistema de Proteccion de Trayectorias Educativas

### Que es
El SiPTE es una iniciativa del gobierno de Chile para crear un sistema nacional de seguimiento de trayectorias educativas de estudiantes en situacion de vulnerabilidad. Su objetivo es articular la informacion entre distintos actores del sistema (colegios, JUNAEB, JUNJI, SENAME/Mejor Ninez, etc.) para detectar y prevenir el abandono escolar.

### Estado actual
En desarrollo e implementacion progresiva. Su completitud depende de que los establecimientos alimenten el sistema con datos de calidad y en tiempo real.

### Relevancia para Ethoz
El SiPTE representa la capa gubernamental de seguimiento de trayectorias. Ethoz es la capa de establecimiento. Para que el SiPTE funcione correctamente, los colegios necesitan sistemas propios que recojan datos precisos, estructurados y disponibles via API. Ethoz es exactamente eso.

---

## 7. Mercado Global SIS en Expansion

### Contexto
El mercado global de Student Information Systems (SIS) y plataformas de gestion escolar esta en fase de expansion acelerada, impulsado por multiples factores convergentes:

- **Regulacion de privacidad**: GDPR, FERPA, CCPA y ahora leyes equivalentes en Latinoamerica estan forzando la modernizacion de sistemas legacy que no cumplen los nuevos estandares.
- **Post-pandemia**: La experiencia de educacion remota acelero la adopcion digital en colegios que resistian el cambio.
- **Presion de padres y apoderados**: Las familias, acostumbradas a apps modernas en su vida personal, exigen lo mismo de los colegios de sus hijos.
- **Demanda de datos**: Los ministerios de educacion en todo el mundo requieren datos mas granulares, mas frecuentes y mas estructurados de los establecimientos.

### Proyecciones
Reportes de mercado de HolonIQ, Grand View Research y MarketsandMarkets proyectan crecimiento sostenido del mercado EdTech de gestion escolar hacia finales de la decada. El segmento de compliance y privacidad de datos educativos es el de mayor crecimiento relativo.

### Oportunidad para Ethoz
Ethoz esta posicionado en el segmento de mayor crecimiento dentro del mercado SIS: compliance, seguridad y privacidad. Esto no es solo una oportunidad local chilena sino una tendencia global que Ethoz puede surfear con una propuesta exportable a otros mercados latinoamericanos con regulaciones similares.

---

*Ultima revision: abril 2026*

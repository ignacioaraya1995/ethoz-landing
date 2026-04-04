import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'privacidad-por-diseno-art-16-bis',
	title: 'Art. 16 bis: Cómo manejar datos médicos de alumnos sin violar la ley',
	description:
		'El Art. 16 bis de la Ley 21.719 prohíbe almacenar datos clínicos detallados de menores. Conozca el enfoque legal de "bandera médica", la diferencia entre diagnóstico y alerta de seguridad, y cómo implementar privacidad por diseño en su establecimiento.',
	date: '2026-02-18',
	author: 'Ignacio Araya',
	readTime: '7 min',
	tags: ['Privacidad', 'Art. 16 bis', 'Datos Médicos'],
	coverImage: '/images/blog/privacidad-por-diseno-art-16-bis.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">El Art. 16 bis prohíbe almacenar diagnósticos clínicos detallados de menores. La alternativa legal: alertas booleanas ("Alerta médica activa") sin especificar la condición. Para datos sensibles de menores de 16, se requiere consentimiento parental explícito.</p>
</div>
<h2>El artículo que cambia cómo los colegios manejan salud</h2>
<p>En el sistema escolar chileno existe una tensión real entre dos obligaciones legítimas: el deber de cuidado del establecimiento hacia sus alumnos, y el derecho a la privacidad de los datos de salud de esos mismos alumnos. El <strong>Artículo 16 bis</strong> de la Ley 21.719 pone esa tensión en términos concretos. El artículo clasifica los datos de salud como categoría especial de datos sensibles y restringe severamente quién puede tratarlos, bajo qué condiciones y con qué nivel de detalle.</p>
<p>Para los equipos directivos escolares, esto plantea una pregunta práctica urgente: si el colegio no puede almacenar el diagnóstico médico de un alumno, ¿cómo protege a ese niño en caso de emergencia? La respuesta existe, es técnicamente implementable y ya hay colegios en Chile operando bajo este modelo. Se llama <strong>privacidad por diseño</strong>.</p>

<h2>Qué prohíbe exactamente el Art. 16 bis</h2>
<p>El artículo establece que los datos de salud —incluyendo diagnósticos clínicos, registros psiquiátricos, historiales de tratamiento farmacológico y evaluaciones psicológicas detalladas— solo pueden ser tratados bajo supuestos muy acotados:</p>
<ul>
  <li>Consentimiento explícito del titular o su representante legal, específico para la finalidad declarada.</li>
  <li>Necesidad vital del titular, cuando no está en condiciones de otorgar consentimiento y la vida está en riesgo.</li>
  <li>Obligación legal expresa que autorice el tratamiento.</li>
  <li>Fines de medicina preventiva o salud pública, ejecutados por profesionales de salud sujetos a secreto profesional.</li>
</ul>
<p>Lo que queda fuera de estos supuestos es extenso: un colegio no puede almacenar el diagnóstico de TDAH de un alumno en su plataforma de gestión solo porque "es útil que los profesores lo sepan". No puede guardar el informe neurológico entregado por un apoderado en una carpeta compartida del servidor. No puede registrar el tratamiento farmacológico en la ficha del estudiante sin una base legal explícita que lo autorice.</p>

<h2>La distinción que todo equipo directivo debe dominar</h2>
<p>Aquí reside la clave del cumplimiento: la ley no prohíbe que el colegio sepa que un alumno tiene una condición de salud relevante para su seguridad. Lo que prohíbe es almacenar el detalle clínico de esa condición. La diferencia entre estas dos cosas es precisa y tiene un nombre técnico en el diseño de sistemas: <strong>el modelo de bandera booleana</strong>.</p>

<blockquote>
  <p>La distinción legal fundamental: almacenar <em>"Juan tiene epilepsia refractaria y toma 200mg de ácido valproico dos veces al día"</em> es ilegal sin base explícita. Almacenar <em>"Juan: riesgo de crisis convulsiva — protocolo de emergencia activado"</em> es legal, necesario y suficiente para el deber de cuidado.</p>
</blockquote>

<p>Un sistema conforme a la ley almacena solo lo que necesita saber para actuar correctamente en una emergencia, no el expediente clínico completo. Esto es exactamente lo que significa privacidad por diseño aplicada al contexto escolar.</p>

<h2>El modelo de bandera médica: implementación práctica</h2>
<p>El enfoque técnico correcto opera con variables booleanas o alertas estructuradas de nivel mínimo. En lugar de almacenar datos clínicos, el sistema registra banderas de acción:</p>
<table>
  <thead>
    <tr>
      <th>Bandera</th>
      <th>Qué significa para el colegio</th>
      <th>Qué no almacena</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>alerta_convulsiones: true</code></td>
      <td>Existe protocolo de emergencia neurológica activo</td>
      <td>Diagnóstico, medicamento, dosis, historial</td>
    </tr>
    <tr>
      <td><code>alerta_alergia_grave: true</code></td>
      <td>EpiPen disponible, protocolo anafilaxia activo</td>
      <td>Alérgeno específico, antecedentes clínicos</td>
    </tr>
    <tr>
      <td><code>alerta_salud_mental: true</code></td>
      <td>Derivación activa a profesional de salud mental</td>
      <td>Diagnóstico psiquiátrico, tratamiento, informes</td>
    </tr>
    <tr>
      <td><code>restriccion_actividad_fisica: true</code></td>
      <td>No puede participar en educación física sin autorización médica</td>
      <td>Condición cardíaca, diagnóstico ortopédico</td>
    </tr>
  </tbody>
</table>
<p>El detalle clínico —diagnóstico, medicamento, historial— permanece en manos del médico tratante y del apoderado. El colegio solo accede a él en el momento de la emergencia, a través del apoderado o del servicio de urgencias, no porque lo tenga almacenado en su sistema.</p>

<h2>Consentimiento para menores de 16 años</h2>
<p>El <strong>Artículo 20</strong> de la Ley 21.719 establece que los menores de 14 años no pueden prestar consentimiento para el tratamiento de sus datos. Entre 14 y 16 años, el menor puede consentir en materias propias de su autonomía, pero para datos de salud —categoría sensible— se mantiene la exigencia de consentimiento parental. Esto tiene implicancias directas para los colegios:</p>
<ul>
  <li>El formulario de matrícula que incluye una cláusula genérica sobre manejo de datos de salud <strong>no es consentimiento válido</strong> bajo la Ley 21.719.</li>
  <li>El consentimiento debe ser específico por finalidad: no basta autorizar "el uso de datos médicos". Debe indicar exactamente qué tipo de alerta se activará, quién la verá y cómo se protegerá.</li>
  <li>El consentimiento debe ser documentado en forma verificable y el sistema debe permitir su revocación. Si un apoderado revoca la autorización, la bandera debe poder desactivarse con trazabilidad del cambio.</li>
</ul>

<h2>Datos clínicos versus alertas de seguridad: ejemplos de cumplimiento</h2>
<p>La distinción conceptual se aclara con ejemplos concretos de lo que un colegio puede y no puede almacenar:</p>
<ul>
  <li><strong>No conforme:</strong> "Diego López, 8° básico. Diagnóstico: Trastorno del espectro autista nivel 2. Toma risperidona 0.5mg. Informe neuropsicológico adjunto." Este registro viola el Art. 16 bis sin importar quién lo pidió.</li>
  <li><strong>Conforme:</strong> "Diego López, 8° básico. Necesidades educativas especiales activas. Protocolo de apoyo PIE vigente. Contacto de emergencia: Dr. Fernández, tel. XXXXXX." Este registro cumple el deber de cuidado sin almacenar datos clínicos.</li>
  <li><strong>No conforme:</strong> Carpeta compartida en el servidor del colegio con todos los informes psicológicos de alumnos en evaluación por el equipo PIE.</li>
  <li><strong>Conforme:</strong> Sistema con control de acceso donde solo la psicóloga del establecimiento —bajo secreto profesional— tiene acceso a los informes, y solo puede registrar en el perfil del alumno una bandera de derivación activa.</li>
</ul>

<h2>Privacidad por diseño: el principio detrás de la solución</h2>
<p>Privacidad por diseño no es una auditoría que se hace al final de un proceso: es una decisión que se toma cuando se elige o configura un sistema. Aplicado al contexto escolar, significa que la plataforma de gestión del establecimiento debe ser estructuralmente incapaz de almacenar datos clínicos detallados de alumnos —no porque esté bloqueada por una regla, sino porque su arquitectura de datos no tiene ese campo.</p>
<p>Los siete principios de privacidad por diseño, en su versión aplicada al colegio, se reducen a tres decisiones concretas:</p>
<ul>
  <li><strong>Minimización estructural:</strong> el sistema solo puede registrar los campos que tienen base legal. No hay campo "diagnóstico" porque ese dato no debe existir en el sistema escolar.</li>
  <li><strong>Acceso por necesidad:</strong> solo quien necesita saber la alerta para cumplir su función tiene acceso a ella. El portero ve la foto y el nombre. El docente ve la alerta de emergencia. La psicóloga ve la derivación activa. Nadie ve el diagnóstico.</li>
  <li><strong>Trazabilidad de acceso:</strong> cada vez que alguien consulta una alerta médica, el sistema registra quién, cuándo y desde dónde. Esto protege al alumno y también al colegio.</li>
</ul>

<h2>Qué pasa si el colegio ya tiene datos clínicos almacenados</h2>
<p>Esta es la situación más frecuente: establecimientos que llevan años recibiendo informes de especialistas, psicólogos y médicos y los han almacenado en carpetas físicas o digitales sin control. La Ley 21.719 no es retroactiva en sus sanciones para datos recolectados antes de su entrada en vigencia, pero sí exige que, a partir de diciembre de 2026, el tratamiento de esos datos se adecue a la ley.</p>
<p>La hoja de ruta para regularizar esta situación tiene tres pasos: inventariar qué datos clínicos existen y dónde, destruir o anonimizar los que no tienen base legal para seguir siendo almacenados, y migrar la información relevante para la seguridad de los alumnos al formato de bandera conforme. Este proceso debe quedar documentado como evidencia del ejercicio de buena fe ante la Agencia de Protección de Datos.</p>
<p>Para una visión completa del régimen de sanciones aplicable, lea <a href="/blog/multas-proteccion-datos-sostenedores">Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores</a>.</p>

<h2>Conclusión</h2>
<p>El Art. 16 bis no impide que los colegios cuiden a sus alumnos con condiciones de salud. Impide que lo hagan acumulando expedientes clínicos sin control ni base legal. El modelo de bandera médica —almacenar solo la alerta de acción, nunca el diagnóstico— es la solución técnica y legalmente correcta. Los establecimientos que adopten este enfoque antes de diciembre de 2026 no solo estarán en cumplimiento: habrán construido un sistema de cuidado más eficiente, más seguro y más respetuoso de los derechos de sus estudiantes.</p>
`
};

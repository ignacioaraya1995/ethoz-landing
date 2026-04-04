import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'excel-no-cumple-normativa-datos',
	title: 'Por qué Excel ya no cumple con la normativa de protección de datos en colegios',
	description:
		'La Circular N°30 del MINEDUC y la Ley 21.719 imponen requisitos que las hojas de cálculo no pueden cumplir estructuralmente: sin trazabilidad, sin control de acceso granular y sin continuidad entre años escolares, Excel es un pasivo legal disfrazado de herramienta de gestión.',
	date: '2026-02-10',
	author: 'Ignacio Araya',
	readTime: '6 min',
	tags: ['Cumplimiento', 'Gestión de Datos', 'Circular N°30'],
	coverImage: '/images/blog/excel-no-cumple-normativa-datos.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Excel no ofrece control de acceso por rol, no genera registros de auditoría, no gestiona consentimientos y pierde el historial cada marzo. La Circular N°30 y la Ley 21.719 exigen trazabilidad que las planillas no pueden entregar.</p>
</div>
<h2>El problema no es Excel: es lo que Excel no puede hacer</h2>
<p>Excel es una herramienta de análisis de datos diseñada para calcular, ordenar y visualizar información numérica y textual. Lo hace bien. El problema es que los colegios chilenos la usan para algo fundamentalmente distinto: gestionar registros de personas con obligaciones legales de confidencialidad, trazabilidad y continuidad. Para eso, Excel no fue diseñado y no puede adaptarse para cumplir.</p>
<p>La distinción importa porque el debate no es tecnológico sino normativo. La pregunta correcta no es "¿podemos mejorar nuestra hoja de cálculo?", sino "¿puede una hoja de cálculo —cualquiera— cumplir con los requisitos de la Circular N°30 y la Ley 21.719?". La respuesta es no, y las razones son estructurales.</p>

<h2>Qué exige la Circular N°30 del MINEDUC</h2>
<p>La Circular N°30 establece los estándares mínimos para la gestión de la información de convivencia escolar. Entre sus exigencias operacionales se encuentran:</p>
<ul>
  <li>Registro actualizado y accesible de todos los incidentes de convivencia.</li>
  <li>Trazabilidad de las intervenciones realizadas por cada profesional.</li>
  <li>Confidencialidad diferenciada: no toda la información es accesible para todos los funcionarios.</li>
  <li>Conservación de registros durante el período que establezca la normativa vigente.</li>
  <li>Capacidad de generar reportes para la Superintendencia de Educación ante fiscalizaciones.</li>
</ul>
<p>Cada uno de estos puntos tiene una contraparte técnica que Excel no puede satisfacer de manera consistente y auditable.</p>

<h2>Falla 1: Sin trazabilidad de auditoría</h2>
<p>Una hoja de cálculo no registra quién modificó qué campo, cuándo y desde qué dispositivo. Si el inspector modifica la fecha de un incidente o borra una fila, no hay registro de esa acción. El archivo muestra el estado actual, no la historia.</p>
<p>Bajo la <strong>Ley 21.719</strong>, el colegio debe poder demostrar que los datos han sido tratados conforme a la finalidad declarada. Si un apoderado ejerce su derecho de acceso (ARCO+P) y sospecha que se modificó información sobre su hijo, el colegio no tiene forma de probarlo ni de refutarlo. Ese vacío probatorio es, en sí mismo, una exposición legal.</p>
<p>Los sistemas de gestión diseñados para entornos regulados generan automáticamente un <em>audit trail</em>: cada lectura, modificación y eliminación queda registrada con usuario, timestamp y campo afectado. Excel no tiene esta capacidad de forma nativa ni por configuración.</p>

<h2>Falla 2: Control de acceso inexistente o ineficaz</h2>
<p>El escenario más común en los colegios que usan Excel es una carpeta compartida en la red local o en Google Drive con el archivo de convivencia. Cualquier persona con acceso a la carpeta —o que reciba el archivo por correo— puede ver todos los datos: el historial disciplinario de todos los estudiantes, los informes psicológicos escaneados adjuntos, las comunicaciones con apoderados.</p>
<p>La Circular N°30 exige confidencialidad diferenciada. Un profesor jefe necesita ver los registros de sus estudiantes. El inspector general necesita ver los incidentes. El psicólogo necesita ver los derivaciones. La directora necesita ver los patrones agregados. Ninguno debería ver todo lo que ven los demás, y un padre no debería ver los datos de otros estudiantes.</p>
<p>Excel permite proteger hojas con contraseña, pero no permite definir permisos por fila, por campo o por usuario. Es todo o nada. Eso no es control de acceso: es una puerta con cerradura de la que todos tienen copia de la llave.</p>

<h2>Falla 3: El "reinicio de marzo" destruye la memoria institucional</h2>
<p>Al inicio de cada año escolar, los colegios generan nuevos archivos de convivencia. El historial del año anterior queda en un archivo que nadie consulta de manera sistemática porque hacerlo requiere abrir manualmente el archivo anterior, buscar el nombre del estudiante, comparar con el actual. En la práctica, no ocurre.</p>
<p>El costo de este reinicio es concreto: un estudiante que acumuló ocho incidentes de agresión durante el año anterior llega en marzo tratado como si no tuviera historial. El nuevo inspector no sabe. El nuevo profesor jefe no sabe. La lógica de intervención temprana —que requiere identificar patrones antes de que se conviertan en incidentes graves— no puede operar sin continuidad de datos.</p>
<p>En el contexto de los <strong>11.091 casos registrados entre enero y septiembre de 2025</strong>, este problema tiene dimensión de seguridad, no solo administrativa. El análisis de la crisis de convivencia escolar y sus implicancias operacionales se desarrolla en <a href="/blog/crisis-convivencia-escolar-2025">11.091 denuncias en 9 meses: La crisis de convivencia escolar que Chile no puede ignorar</a>.</p>

<h2>Falla 4: Sin cumplimiento de derechos ARCO+P</h2>
<p>La Ley 21.719 otorga a los apoderados el derecho a solicitar acceso a todos los datos que el colegio tiene sobre su hijo, y el establecimiento tiene <strong>30 días hábiles</strong> para responder. Para cumplir este plazo, el colegio necesita saber exactamente:</p>
<ul>
  <li>En qué archivos está información sobre ese estudiante.</li>
  <li>Quién ha accedido a esa información.</li>
  <li>Con qué finalidad fue recolectada.</li>
  <li>Si se ha compartido con terceros y bajo qué condiciones.</li>
</ul>
<p>Con datos dispersos en múltiples hojas de cálculo, carpetas de correo electrónico y documentos físicos, responder estas preguntas en 30 días hábiles requiere un esfuerzo manual que en muchos casos es inviable. El riesgo no es solo operacional: responder de forma incompleta o fuera de plazo es una infracción leve bajo la ley, con multas de hasta 1.000 UTM.</p>

<h2>Tabla comparativa: Excel vs. sistema de gestión conforme</h2>
<table>
  <thead>
    <tr>
      <th>Requisito normativo</th>
      <th>Excel / Google Sheets</th>
      <th>Sistema de gestión conforme</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Trazabilidad de modificaciones (audit trail)</td>
      <td>No disponible</td>
      <td>Automático por usuario y timestamp</td>
    </tr>
    <tr>
      <td>Control de acceso por rol y campo</td>
      <td>No disponible</td>
      <td>Configurable por perfil</td>
    </tr>
    <tr>
      <td>Cifrado de datos en reposo y en tránsito</td>
      <td>Depende del almacenamiento externo</td>
      <td>Nativo por diseño</td>
    </tr>
    <tr>
      <td>Continuidad de historial entre años</td>
      <td>Manual, no sistemática</td>
      <td>Persistente y consultable</td>
    </tr>
    <tr>
      <td>Respuesta a solicitudes ARCO+P</td>
      <td>Manual, propenso a omisiones</td>
      <td>Exportable con un flujo definido</td>
    </tr>
    <tr>
      <td>Notificación de brechas en 72 horas</td>
      <td>Imposible sin inventario de datos</td>
      <td>Viable con monitoreo activo</td>
    </tr>
    <tr>
      <td>Generación de reportes para Superintendencia</td>
      <td>Manual, sin garantías de completitud</td>
      <td>Automático y con respaldo</td>
    </tr>
  </tbody>
</table>

<h2>El argumento del costo: una inversión que se cuantifica</h2>
<p>La objeción más frecuente a migrar a sistemas de gestión es el costo. Es un argumento válido que merece una respuesta igualmente concreta. Las multas por infracción grave bajo la Ley 21.719 alcanzan las 5.000 UTM (~$350 millones CLP). Las multas por infracción gravísima —vulnerar datos sensibles de menores— alcanzan las 20.000 UTM o el 4% de los ingresos anuales, el monto que resulte mayor. Para un colegio con matrícula de 600 estudiantes y aranceles de $150.000 mensuales, el 4% de los ingresos anuales supera los $40 millones.</p>
<p>Frente a esas cifras, el costo de implementar un sistema conforme —incluyendo la migración de datos y la capacitación— es materialmente menor. La pregunta no es si el colegio puede permitirse un sistema adecuado, sino si puede permitirse no tenerlo.</p>

<h2>Conclusión</h2>
<p>Excel no es un mal sistema que debe mejorarse: es el sistema incorrecto para este problema. Las hojas de cálculo carecen estructuralmente de trazabilidad, control de acceso granular, continuidad entre períodos y las capacidades necesarias para responder derechos ARCO+P. Esto no es una limitación superable con macros o complementos.</p>
<p>La migración hacia sistemas de gestión diseñados para entornos regulados no requiere grandes proyectos de transformación digital. Requiere identificar exactamente qué procesos involucran datos personales sensibles —convivencia, salud, rendimiento— y reemplazar el archivo de Excel por una herramienta que deje registro de cada acción, limite el acceso a quien corresponde y mantenga el historial entre años. Las obligaciones de la <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719</a> lo convierten en una decisión urgente antes de diciembre de 2026.</p>
`
};

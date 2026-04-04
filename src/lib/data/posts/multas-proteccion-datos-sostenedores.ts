import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'multas-proteccion-datos-sostenedores',
	title: 'Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores',
	description:
		'La nueva Agencia de Protección de Datos Personales ya tiene dientes. Hasta 20.000 UTM por infracción gravísima y 4% de los ingresos globales bajo Ley 21.719. Esta guía práctica muestra a los sostenedores qué hacer ahora para no ser los primeros sancionados.',
	date: '2026-03-24',
	author: 'Ignacio Araya',
	readTime: '7 min',
	tags: ['Ley 21.719', 'Multas', 'Sostenedores'],
	coverImage: '/images/blog/multas-proteccion-datos-sostenedores.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">La Ley 21.719 permite multas de hasta 20.000 UTM (más de $1.200 millones CLP) y la Ley 21.663 agrega sanciones del 4% de ingresos globales. Los sostenedores necesitan audit log, cifrado, control de acceso y gestión de consentimientos antes de diciembre de 2026.</p>
</div>
<h2>El nuevo régimen sancionatorio ya está vigente</h2>
<p>Durante años, la protección de datos personales en Chile fue una obligación sin consecuencias reales. Eso terminó. La Ley 21.719, promulgada en diciembre de 2023, creó la <strong>Agencia de Protección de Datos Personales</strong> con facultades fiscalizadoras, sancionatorias y normativas. Para los sostenedores escolares, esto no es teoría: es el nuevo entorno regulatorio en que operan hoy.</p>

<p>La pregunta ya no es si cumplir. La pregunta es cuánto cuesta no hacerlo.</p>

<h2>La estructura de multas que debe conocer</h2>
<p>El régimen sancionatorio opera en dos capas paralelas que los sostenedores deben entender con precisión:</p>

<h2>Ley 21.663: la escala por gravedad</h2>
<p>Esta ley clasifica las infracciones en tres categorías y fija los montos en Unidades Tributarias Mensuales (UTM):</p>

<table>
  <thead>
    <tr>
      <th>Categoría</th>
      <th>Multa máxima general</th>
      <th>Multa máxima operadores vitales</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Leve</td>
      <td>100 UTM (~$7,3M CLP)</td>
      <td>200 UTM</td>
    </tr>
    <tr>
      <td>Grave</td>
      <td>5.000 UTM (~$365M CLP)</td>
      <td>10.000 UTM</td>
    </tr>
    <tr>
      <td>Gravísima</td>
      <td>20.000 UTM (~$1.460M CLP)</td>
      <td>40.000 UTM</td>
    </tr>
  </tbody>
</table>

<p>Los valores aproximados se calculan con UTM de marzo 2026 (~$73.000 CLP). Las infracciones gravísimas incluyen tratamiento ilícito de datos sensibles, vulneraciones masivas, y reincidencia dentro de 24 meses.</p>

<h2>Ley 21.719: el 4% de los ingresos globales</h2>
<p>En paralelo, la Ley 21.719 introduce una escala alternativa basada en los ingresos del responsable: hasta el <strong>4% de los ingresos anuales globales</strong> por infracciones graves o gravísimas. Para sostenedores con múltiples colegios o ingresos consolidados significativos, este techo puede superar ampliamente las multas en UTM. La Agencia aplicará el criterio que resulte mayor.</p>

<h2>Qué constituye infracción en un colegio</h2>
<p>Los sostenedores operan como <em>responsables del tratamiento</em> de datos de menores de edad, categoría que merece protección reforzada bajo la ley. Las siguientes prácticas comunes en colegios chilenos configuran infracciones hoy:</p>

<ul>
  <li><strong>Almacenamiento de datos clínicos sin base legal explícita.</strong> Fichas médicas, diagnósticos psicológicos o informes de NEE guardados en planillas Excel o sistemas sin control de acceso constituyen tratamiento de datos sensibles sin las medidas de seguridad exigidas.</li>
  <li><strong>Ausencia de registro de actividades (audit log).</strong> La ley exige que los responsables puedan acreditar quién accedió a qué dato y cuándo. Sin trazabilidad, la Agencia presume negligencia.</li>
  <li><strong>Sin gestión de consentimiento documentada.</strong> Autorizar el uso de imágenes de alumnos en redes sociales, compartir datos con proveedores o enviar información a terceros sin consentimiento informado y revocable del titular o su representante legal es infracción directa.</li>
  <li><strong>Compartir datos con proveedores sin contrato de encargo.</strong> Si su plataforma de gestión escolar, proveedor de ERP o sistema de bienestar accede a datos de alumnos sin un contrato de encargo de tratamiento, usted es responsable de esa exposición.</li>
  <li><strong>Transferencias internacionales no documentadas.</strong> Muchos sistemas SaaS educativos procesan datos en servidores fuera de Chile. Sin las garantías adecuadas, esto es transferencia internacional no autorizada.</li>
</ul>

<h2>La Agencia ya opera: lo que esto significa en la práctica</h2>
<p>La Agencia de Protección de Datos Personales inició funciones con un equipo técnico especializado y potestades de fiscalización de oficio, es decir, puede iniciar investigaciones sin denuncia previa. El sector educacional, por manejar datos de menores y datos sensibles de salud, es prioritario en su agenda regulatoria.</p>

<blockquote>
  <p>"Los sostenedores que regularicen su situación de forma proactiva antes de una fiscalización tienen acceso a circunstancias atenuantes. Los que esperen enfrentarán el régimen completo." — Principio de buena fe, Art. 46 Ley 21.719</p>
</blockquote>

<h2>Cómo prepararse: las cuatro líneas de defensa</h2>

<p><strong>1. Auditoría de datos activa.</strong> Inventaríe todos los datos personales que su establecimiento almacena: dónde están, quién accede, qué sistema los procesa y bajo qué base legal. Este registro de actividades de tratamiento es obligatorio y el primer documento que solicitará la Agencia en una fiscalización.</p>

<p><strong>2. Cifrado y control de acceso por roles.</strong> Los datos de alumnos deben estar cifrados en reposo y en tránsito. El acceso debe estar restringido por rol: un profesor no debería ver el diagnóstico psicológico de un alumno que no es su tutorado. Los sistemas que no ofrecen control granular de permisos son un pasivo regulatorio.</p>

<p><strong>3. Flujo de consentimiento parental documentado.</strong> Diseñe un proceso formal para obtener, registrar y gestionar el consentimiento de apoderados. Debe ser específico por finalidad, fechado, y el sistema debe permitir su revocación. Un formulario en papel guardado en una carpeta no es suficiente.</p>

<p><strong>4. Contratos de encargo con todos los proveedores tecnológicos.</strong> Revise cada herramienta digital que usa su establecimiento. Si un tercero accede a datos de alumnos, necesita un contrato que establezca las instrucciones de tratamiento, las medidas de seguridad exigidas y las responsabilidades ante incidentes.</p>

<h2>Lista de verificación para sostenedores</h2>
<ul>
  <li>Registro de actividades de tratamiento documentado y actualizado</li>
  <li>Política de privacidad publicada y accesible para apoderados</li>
  <li>Contratos de encargo firmados con todos los proveedores SaaS</li>
  <li>Control de acceso basado en roles implementado en todos los sistemas</li>
  <li>Cifrado de datos activo en reposo y en tránsito</li>
  <li>Flujo de consentimiento documentado y revocable</li>
  <li>Procedimiento de respuesta ante brechas de seguridad (máximo 72 horas para notificar)</li>
  <li>Encargado de Protección de Datos designado (obligatorio para establecimientos que traten datos sensibles a gran escala)</li>
  <li>Audit log habilitado en todos los sistemas con acceso a datos de alumnos</li>
  <li>Capacitación al personal documentada sobre manejo de datos personales</li>
</ul>

<h2>El riesgo reputacional supera la multa</h2>
<p>Una sanción de la Agencia es pública. Se publica en el registro oficial, aparece en búsquedas y es reportable por medios de comunicación. En un mercado donde los apoderados chilenos valoran cada vez más la seguridad digital de sus hijos, una multa por filtración de datos de menores puede tener un impacto en matrícula que dura años.</p>

<p>El costo de cumplir hoy es una fracción del costo de remediar una brecha mañana. Los sostenedores que adopten plataformas con cumplimiento integrado —audit log nativo, control de acceso por roles, gestión de consentimiento y cifrado por defecto— no solo reducen su exposición legal: construyen una ventaja competitiva real frente a establecimientos que siguen operando con planillas y sistemas sin gobierno de datos.</p>

<p>Para entender cómo la inteligencia artificial puede ayudar a identificar patrones de riesgo en sus datos antes de que se conviertan en infracciones, lea <a href="/blog/inteligencia-artificial-desercion-escolar">cómo los algoritmos predictivos están cambiando la gestión escolar</a>.</p>
`
};

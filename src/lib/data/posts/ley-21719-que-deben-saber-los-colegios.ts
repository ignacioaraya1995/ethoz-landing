import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'ley-21719-que-deben-saber-los-colegios',
	title: 'Ley 21.719: Lo que todo colegio debe saber antes de diciembre 2026',
	description:
		'La nueva ley de protección de datos personales en Chile entra en vigencia en diciembre de 2026. Conozca qué implica para los colegios, qué datos están protegidos, cuáles son las multas y cómo comenzar el proceso de cumplimiento hoy.',
	date: '2026-01-15',
	author: 'Ignacio Araya',
	readTime: '8 min',
	tags: ['Ley 21.719', 'Cumplimiento', 'Protección de Datos'],
	coverImage: '/images/blog/ley-21719-que-deben-saber-los-colegios.png',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">La Ley 21.719 entra en vigencia en diciembre de 2026 y obliga a los colegios a obtener consentimiento parental, registrar cada acceso a datos sensibles y responder solicitudes ARCO+P. Las multas llegan hasta 20.000 UTM. Los colegios que operan con Excel no cumplen.</p>
</div>
<h2>Una ley que transforma la relación entre colegios y datos personales</h2>
<p>El 13 de diciembre de 2024, Chile publicó la Ley 21.719 en el Diario Oficial, actualizando de manera sustancial la Ley 19.628 de 1999. A partir de diciembre de 2026, toda institución que trate datos personales —incluyendo colegios, liceos y jardines infantiles— deberá cumplir un estándar radicalmente más exigente. El plazo parece amplio, pero la experiencia del RGPD europeo muestra que las organizaciones que esperan el último trimestre enfrentan costos entre 3 y 5 veces mayores que las que planifican con anticipación.</p>
<p>Este artículo revisa los aspectos que más directamente afectan la operación diaria de un establecimiento educacional.</p>

<h2>¿Qué datos maneja un colegio y por qué casi todos están protegidos?</h2>
<p>Un colegio típico almacena: nombres, RUT y domicilios de estudiantes y apoderados; registros académicos y de asistencia; informes psicológicos y psicopedagógicos; fichas médicas y de salud; comunicaciones disciplinarias; y datos biométricos si usa control de acceso por huella o facial. Bajo la Ley 21.719, todos estos datos son personales y la gran mayoría —médicos, psicológicos, disciplinarios— caen en la categoría de <strong>datos sensibles</strong>, que reciben protección reforzada.</p>
<p>El <strong>Artículo 16 bis</strong> de la ley establece restricciones específicas para datos de salud: solo pueden ser tratados con consentimiento explícito del titular o bajo supuestos muy acotados (emergencia médica, obligación legal). Esto tiene implicancias directas para los equipos de convivencia escolar y los profesionales de la salud mental que operan dentro de los colegios.</p>

<h2>Derechos ARCO+P: la nueva exigencia operacional</h2>
<p>La ley consagra los derechos de <strong>Acceso, Rectificación, Cancelación, Oposición y Portabilidad</strong> (ARCO+P) para todo titular de datos. En el contexto escolar, esto significa que:</p>
<ul>
  <li>Un apoderado puede solicitar acceso completo a todos los datos que el colegio tiene sobre su hijo en un plazo de <strong>30 días hábiles</strong> (Art. 11).</li>
  <li>Puede exigir la corrección de datos inexactos o desactualizados.</li>
  <li>Puede solicitar la eliminación de datos cuando ya no sean necesarios para la finalidad que justificó su recolección.</li>
  <li>Puede oponerse al tratamiento para fines de marketing o comunicaciones no solicitadas.</li>
  <li>A partir del año 2, podrá ejercer el derecho de <strong>portabilidad</strong>: recibir los datos en formato electrónico interoperable para trasladarlos a otro establecimiento.</li>
</ul>
<p>Para responder estos derechos dentro del plazo legal, el colegio necesita saber exactamente <em>dónde</em> está cada dato. Un establecimiento que maneja información en hojas de cálculo dispersas, correos electrónicos y carpetas físicas tendrá serias dificultades para cumplir. Las razones técnicas de esto se desarrollan en el artículo <a href="/blog/multas-proteccion-datos-sostenedores">Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores</a>.</p>

<h2>Consentimiento parental para menores de 14 años</h2>
<p>El <strong>Artículo 20</strong> de la ley establece que el tratamiento de datos de menores de 14 años requiere consentimiento del padre, madre o tutor legal. No basta la firma de una matrícula genérica. El consentimiento debe ser:</p>
<ul>
  <li><strong>Específico</strong>: indicar exactamente para qué se usarán los datos.</li>
  <li><strong>Informado</strong>: el apoderado debe entender qué implica.</li>
  <li><strong>Libre</strong>: no puede condicionarse la matrícula a la entrega de datos no esenciales.</li>
  <li><strong>Verificable</strong>: el colegio debe poder demostrar que obtuvo el consentimiento.</li>
</ul>
<p>Esto obliga a revisar los formularios de matrícula, los términos de uso de plataformas digitales que usan los estudiantes, y los convenios con proveedores de tecnología educativa.</p>

<h2>La nueva Agencia de Protección de Datos Personales</h2>
<p>La ley crea una autoridad de control autónoma —la <strong>Agencia de Protección de Datos Personales</strong>— con facultades de fiscalización, investigación y sanción. A diferencia del modelo anterior, basado en autoregulación, la Agencia puede iniciar procedimientos de oficio o por denuncia de cualquier persona.</p>
<p>Las sanciones se estructuran en tres tramos:</p>
<table>
  <thead>
    <tr>
      <th>Infracción</th>
      <th>Multa máxima</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Leve (ej.: no responder solicitud ARCO+P en plazo)</td>
      <td>1.000 UTM (~$70 millones CLP)</td>
    </tr>
    <tr>
      <td>Grave (ej.: tratar datos sin base de legitimación)</td>
      <td>5.000 UTM (~$350 millones CLP)</td>
    </tr>
    <tr>
      <td>Gravísima (ej.: vulnerar datos sensibles de menores)</td>
      <td>20.000 UTM o 4% de ingresos anuales</td>
    </tr>
  </tbody>
</table>
<p>Para un colegio con ingresos anuales de $1.000 millones CLP, el 4% equivale a $40 millones. Para uno con ingresos de $5.000 millones, equivale a $200 millones. La regla aplica el monto <em>mayor</em> entre las 20.000 UTM y el 4%, lo que convierte la escala de sanciones en un factor de riesgo financiero concreto, no abstracto.</p>

<h2>Obligaciones de seguridad y notificación de brechas</h2>
<p>El <strong>Artículo 14 quáter</strong> exige implementar medidas de seguridad técnicas y organizativas proporcionales al riesgo. Además, ante una brecha de seguridad que pueda afectar los derechos de los titulares, el responsable del tratamiento debe:</p>
<ul>
  <li>Notificar a la Agencia dentro de <strong>72 horas</strong> de conocida la brecha.</li>
  <li>Comunicar a los afectados cuando exista riesgo para sus derechos.</li>
  <li>Documentar todas las brechas ocurridas, incluso las que no requieran notificación.</li>
</ul>
<p>En la práctica, esto requiere tener un inventario de datos, un protocolo de respuesta a incidentes y registros de auditoría. Un colegio que no sabe qué datos tiene ni dónde los almacena no puede cumplir la obligación de notificación en 72 horas.</p>

<h2>El Registro de Actividades de Tratamiento</h2>
<p>Toda organización que trate datos debe mantener un <strong>Registro de Actividades de Tratamiento</strong> (RAT) actualizado (Art. 14 ter). Este registro debe documentar, por cada actividad de tratamiento: la finalidad, las categorías de datos, los destinatarios, los plazos de conservación y las medidas de seguridad aplicadas. Para un colegio mediano, esto puede implicar entre 15 y 30 actividades distintas de tratamiento.</p>

<h2>Hoja de ruta para un colegio que comienza hoy</h2>
<p>Las organizaciones que completaron el proceso de adecuación al RGPD europeo con anticipación lo hicieron en tres fases consecutivas:</p>
<ol>
  <li><strong>Diagnóstico (2-3 meses):</strong> inventario de datos, mapeo de flujos, identificación de brechas respecto a la ley.</li>
  <li><strong>Diseño (2-3 meses):</strong> política de privacidad, base de legitimación por actividad, revisión de contratos con proveedores, formularios de consentimiento.</li>
  <li><strong>Implementación (3-6 meses):</strong> capacitación al equipo, adecuación de sistemas, pruebas de los procesos ARCO+P, primera auditoría interna.</li>
</ol>
<p>Con diciembre de 2026 como fecha límite, el margen disponible es suficiente solo si el diagnóstico comienza en el primer semestre de 2026. Los colegios que gestionan información de convivencia escolar —un ámbito que involucra datos especialmente sensibles, como se analiza en <a href="/blog/crisis-convivencia-escolar-2025">La crisis de convivencia escolar 2025</a>— tienen una carga adicional de adecuación que justifica iniciar antes.</p>

<h2>Conclusión</h2>
<p>La Ley 21.719 no es una formalidad administrativa. Establece derechos exigibles por los apoderados, una autoridad con facultades reales de sanción y multas que pueden representar el 4% de los ingresos de un establecimiento. El cumplimiento requiere cambios en procesos, contratos y sistemas. Los colegios que traten esto como una gestión de infraestructura —igual que la seguridad del edificio o el sistema de incendios— estarán en mejor posición que los que lo traten como papeleo legal.</p>
<p>Contar con sistemas que centralicen la información estudiantil, generen registros de auditoría automáticos y faciliten la respuesta a solicitudes ARCO+P no es un lujo: es la base técnica que hace posible el cumplimiento.</p>
`
};

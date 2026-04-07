import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'whatsapp-datos-sensibles-colegios',
	title: 'Por qué los colegios deben dejar de usar WhatsApp para compartir datos de alumnos',
	description:
		'Compartir datos de estudiantes por WhatsApp viola la Ley 21.719 y expone al sostenedor a multas de hasta 20.000 UTM. El Art. 16 bis prohíbe datos clínicos por canales informales. Existen alternativas seguras.',
	date: '2026-04-07',
	author: 'Equipo Ethoz',
	readTime: '8 min',
	tags: ['Protección de Datos', 'WhatsApp', 'Privacidad'],
	coverImage: '/images/blog/whatsapp-datos-sensibles-colegios.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">WhatsApp es el canal de comunicación más usado en los colegios chilenos y el que más claramente viola la Ley 21.719. El artículo 16 bis prohíbe compartir datos clínicos, conductuales o psicológicos de menores por canales informales sin medidas técnicas adecuadas. Las multas alcanzan las 20.000 UTM. La alternativa no es dejar de comunicar: es comunicar con notificaciones push que transmiten solo metadatos, manteniendo los datos sensibles en la plataforma protegida.</p>
</div>

<h2>El canal más popular es el más riesgoso</h2>
<p>Si hay una constante en la gestión educacional chilena de los últimos diez años, es el uso masivo de WhatsApp como canal de comunicación institucional. Grupos de docentes, grupos de apoderados, grupos de dirección, grupos de orientación: la mensajería instantánea de Meta colonizó la comunicación escolar con una velocidad que ninguna política institucional pudo frenar.</p>
<p>La paradoja es que este canal, que se adoptó por su facilidad e inmediatez, es precisamente el que más claramente viola la <strong>Ley 21.719 de Protección de Datos Personales</strong>, que entró en vigencia plena a fines de 2026. Y la infracción no es marginal ni técnica: es estructural y afecta a prácticamente todos los establecimientos que lo usan para comunicar información sobre estudiantes.</p>

<h2>Qué dice exactamente el artículo 16 bis</h2>
<p>El artículo 16 bis de la Ley 21.719 regula el tratamiento de datos especialmente sensibles. La norma establece que los datos que revelan el origen racial o étnico, las opiniones políticas, las convicciones religiosas, la salud, la vida sexual, la orientación sexual, los antecedentes penales o las condiciones de salud mental de una persona <strong>solo pueden ser tratados bajo condiciones estrictas de seguridad técnica y organizativa</strong>.</p>
<p>Para los colegios, esto tiene una implicación directa: cada vez que un orientador envía por WhatsApp un mensaje como "el alumno X tuvo un episodio de ansiedad hoy y tuvimos que llamar a sus padres", o cuando el inspector escribe "la alumna Y tuvo un brote y fue derivada al CESFAM", está tratando datos de salud mental de un menor por un canal que no cumple ninguna de las condiciones técnicas que la ley exige.</p>
<p>Los datos que típicamente se comparten por WhatsApp en los colegios incluyen:</p>
<ul>
  <li>Información sobre problemas de salud mental o conductual del estudiante.</li>
  <li>Detalles de incidentes de convivencia con identificación del alumno.</li>
  <li>Situaciones familiares que justifican una intervención (violencia intrafamiliar, situación socioeconómica).</li>
  <li>Derivaciones a profesionales de salud mental.</li>
  <li>Información sobre diagnósticos médicos relevantes para la gestión escolar (TDAH, TEA, epilepsia).</li>
</ul>
<p>Todos estos datos son, bajo la Ley 21.719, datos sensibles cuyo tratamiento por canales informales constituye una infracción.</p>

<h2>Las multas que nadie quiere calcular</h2>
<p>La Ley 21.719 establece un régimen sancionatorio en tres tramos:</p>
<ul>
  <li><strong>Infracciones leves:</strong> hasta 1.000 UTM por infracción.</li>
  <li><strong>Infracciones graves:</strong> hasta 5.000 UTM por infracción.</li>
  <li><strong>Infracciones gravísimas:</strong> hasta 20.000 UTM por infracción.</li>
</ul>
<p>El tratamiento inadecuado de datos sensibles de menores de edad se clasifica en el tramo de infracciones gravísimas. A valores actuales, 20.000 UTM equivalen a aproximadamente <strong>1.300 millones de pesos</strong>. Para un establecimiento subvencionado de tamaño mediano, esta cifra supera varias veces su subvención anual.</p>
<p>Lo que agrava el riesgo es que la infracción no requiere que haya ocurrido un daño concreto. El solo hecho de haber tratado datos sensibles por un canal no autorizado constituye la infracción. El análisis completo del régimen de multas está disponible en <a href="/blog/multas-proteccion-datos-sostenedores">Multas de hasta 20.000 UTM: Guía de cumplimiento para sostenedores</a>.</p>

<h2>Por qué WhatsApp no puede cumplir los requisitos técnicos</h2>
<p>Más allá de la infracción específica del artículo 16 bis, WhatsApp como plataforma presenta un conjunto de problemas técnicos que lo hacen estructuralmente incompatible con el tratamiento de datos sensibles:</p>
<h3>Ausencia de control sobre los datos</h3>
<p>Cuando un mensaje con datos de un estudiante se envía por WhatsApp, esos datos pasan a los servidores de Meta (anteriormente Facebook). El establecimiento no tiene ningún contrato de tratamiento de datos con Meta para este uso específico. No hay acuerdo de procesamiento de datos (DPA), no hay compromisos de confidencialidad y no hay mecanismo de rendición de cuentas.</p>
<h3>Sin control de acceso por rol</h3>
<p>En un grupo de WhatsApp, todos los miembros ven todos los mensajes. No hay forma de limitar que un asistente de aula vea información confidencial de salud mental que solo debería ver el orientador y el director. El principio de mínimo privilegio, exigido por la Ley 21.719, no puede implementarse en WhatsApp.</p>
<h3>Sin log de auditoría</h3>
<p>La Ley 21.719 exige que el responsable del tratamiento pueda demostrar, ante una solicitud del titular o una fiscalización, quién accedió a qué datos y cuándo. WhatsApp no genera ese registro. Si la Agencia de Protección de Datos requiere una auditoría del tratamiento de datos de un estudiante específico, el establecimiento no tiene forma de responder a esa pregunta con un canal de mensajería instantánea.</p>
<h3>Sin control de retención</h3>
<p>Los datos de los estudiantes tienen plazos de retención definidos. Una vez que el estudiante egresa o el dato ya no es necesario, debe eliminarse. En WhatsApp, los mensajes quedan en los dispositivos de todos los participantes del grupo de forma indefinida, sin ningún mecanismo de borrado controlado.</p>

<h2>El problema de los grupos de apoderados</h2>
<p>Los grupos de WhatsApp de apoderados presentan una dimensión adicional del problema. Con frecuencia, en estos grupos se comparte información que identifica a estudiantes específicos en situaciones sensibles: "la mamá del compañero de mi hijo me contó que ese niño tuvo un episodio ayer", "el alumno X fue suspendido por esto". Cuando esta información es compartida o iniciada por un docente o directivo en ese grupo, el establecimiento se convierte en responsable del tratamiento de datos que están circulando fuera de cualquier control institucional.</p>
<p>La Ley 21.719 establece que el responsable del tratamiento —en este caso, el establecimiento educacional— responde por las infracciones que cometen sus colaboradores en el ejercicio de sus funciones. Un inspector que comparte información de un estudiante en un grupo de WhatsApp de apoderados no genera solo responsabilidad personal: genera responsabilidad institucional.</p>

<h2>La alternativa: notificaciones push con solo metadatos</h2>
<p>La solución no es volver a las circulares en papel ni eliminar la comunicación digital. Es comunicar de manera que los datos sensibles permanezcan protegidos y solo el contenido de menor riesgo viaje por canales externos.</p>
<p>El modelo que Ethoz implementa funciona de la siguiente manera:</p>
<ul>
  <li>Cuando ocurre un evento que requiere la atención de un actor del establecimiento, el sistema envía una <strong>notificación push</strong> al dispositivo de esa persona.</li>
  <li>La notificación contiene <strong>solo metadatos</strong>: "Hay una situación registrada que requiere su revisión" o "Se ha generado una alerta de asistencia que requiere acción".</li>
  <li>El contenido específico —quién, qué ocurrió, cuáles son los detalles— permanece en la plataforma Ethoz, accesible solo mediante autenticación y solo para quien tiene el nivel de acceso correspondiente.</li>
  <li>Quien recibe la notificación accede a la plataforma con sus credenciales, ve la información según su rol y registra las acciones que adopta.</li>
</ul>
<p>Este modelo reemplaza funcionalmente el WhatsApp para la coordinación institucional: la misma inmediatez, sin los riesgos. El docente sabe que hay algo que atender. El orientador sabe que debe revisar un caso. El directivo sabe que hay una situación en curso. Pero los datos sensibles nunca salieron de la plataforma protegida.</p>

<h2>Qué hacer si su establecimiento usa WhatsApp hoy</h2>
<p>La transición no tiene que ser abrupta. Un proceso razonable incluye:</p>
<ol>
  <li><strong>Mapear los grupos activos</strong> y clasificar el tipo de información que circula en cada uno.</li>
  <li><strong>Identificar cuáles grupos transmiten información sensible</strong> sobre estudiantes (la mayoría lo hace).</li>
  <li><strong>Implementar un canal alternativo</strong> para la coordinación institucional que no involucre datos sensibles de estudiantes.</li>
  <li><strong>Actualizar el Reglamento de Convivencia Escolar y las políticas de tratamiento de datos</strong> para reflejar los canales autorizados.</li>
  <li><strong>Capacitar al equipo</strong> sobre qué información puede compartirse por qué canal.</li>
</ol>
<p>El punto más importante es que el WhatsApp puede seguir usándose para comunicaciones que no involucran datos personales sensibles: coordinación logística, recordatorios de reuniones, información general del establecimiento. Lo que no puede seguir usándose para es la comunicación de información individual sobre estudiantes.</p>

<h2>Conclusión</h2>
<p>WhatsApp se instaló en los colegios chilenos porque resolvió un problema real: la necesidad de coordinación rápida entre actores del establecimiento. Pero lo hizo a un costo que la mayoría de los colegios no ha calculado: el tratamiento de datos sensibles de menores por un canal que no cumple ninguna de las exigencias de la Ley 21.719. Las multas son reales, el riesgo es sistémico y la alternativa técnica existe. El desafío no es tecnológico: es de decisión institucional.</p>

<div style="background: var(--secondary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-top: 3rem;">
<h3 style="margin-top: 0;">Reemplace el WhatsApp con comunicación segura y trazable</h3>
<p>Ethoz ofrece notificaciones push institucionales que mantienen los datos sensibles dentro de la plataforma protegida. La coordinación no se pierde: los riesgos, sí. Conozca cómo funciona en su establecimiento.</p>
<a href="/demo" style="display: inline-block; background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Solicitar demo gratuita</a>
</div>
`
};

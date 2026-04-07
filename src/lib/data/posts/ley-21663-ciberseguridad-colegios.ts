import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'ley-21663-ciberseguridad-colegios',
	title: 'Ley 21.663 de Ciberseguridad: qué exige a los colegios chilenos',
	description:
		'La Ley 21.663 de Ciberseguridad impone obligaciones técnicas concretas a los establecimientos educacionales: cifrado, reporte de incidentes y auditoría. Lo que todo sostenedor debe saber.',
	date: '2026-04-07',
	author: 'Equipo Ethoz',
	readTime: '9 min',
	tags: ['Ciberseguridad', 'Ley 21.663', 'Cumplimiento'],
	coverImage: '/images/blog/ley-21663-ciberseguridad-colegios.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">La Ley 21.663 de Ciberseguridad, vigente desde 2024, impone obligaciones técnicas directas a los operadores de infraestructura digital en Chile, categoría en la que entran los establecimientos educacionales que gestionan datos de menores. Cifrado obligatorio, reporte de incidentes en 72 horas y registros de auditoría son las tres exigencias centrales. Ethoz cumple nativamente con las tres mediante pgcrypto, RLS y pgAudit en Supabase.</p>
</div>

<h2>Una ley que los colegios no esperaban</h2>
<p>Cuando se menciona ciberseguridad en el contexto educacional chileno, la referencia casi automática es la <strong>Ley 21.719 de Protección de Datos Personales</strong>. Pero desde 2024 existe otra norma que los establecimientos educacionales deben conocer con igual urgencia: la <strong>Ley 21.663, Marco de Ciberseguridad</strong>.</p>
<p>Esta ley no fue diseñada exclusivamente para el sector financiero ni para las grandes empresas de telecomunicaciones. Define como sujetos obligados a todos los <strong>operadores de servicios esenciales</strong> y a los <strong>operadores de importancia vital</strong>. La educación —en tanto servicio que gestiona datos sensibles de menores de edad en escala masiva— queda comprendida dentro de estas categorías según la interpretación de la Agencia Nacional de Ciberseguridad (ANCI).</p>
<p>El punto de partida para cualquier sostenedor es simple: si su establecimiento almacena, procesa o transmite datos personales de estudiantes en sistemas digitales, la Ley 21.663 le aplica. Y la pregunta relevante no es si aplica, sino qué exige específicamente.</p>

<h2>Las tres obligaciones técnicas centrales</h2>
<h3>1. Medidas técnicas de seguridad obligatorias</h3>
<p>El artículo 27 de la Ley 21.663 establece que los operadores de servicios esenciales deben implementar <strong>medidas técnicas y organizativas para proteger sus redes y sistemas informáticos</strong>. La norma no prescribe una tecnología específica, pero la reglamentación y las directrices de la ANCI definen un conjunto mínimo de controles:</p>
<ul>
  <li><strong>Cifrado en reposo y en tránsito:</strong> los datos almacenados deben estar cifrados. El tráfico entre cliente y servidor debe usar protocolos seguros (TLS 1.2 mínimo, TLS 1.3 recomendado).</li>
  <li><strong>Control de acceso basado en roles (RBAC):</strong> cada usuario del sistema debe tener acceso únicamente a los datos que su función requiere. El acceso amplio o irrestricto constituye una vulnerabilidad técnica y un incumplimiento normativo.</li>
  <li><strong>Gestión de vulnerabilidades:</strong> los sistemas deben mantenerse actualizados. Las vulnerabilidades conocidas deben ser parcheadas dentro de plazos razonables.</li>
  <li><strong>Autenticación robusta:</strong> el acceso a sistemas con datos sensibles debe requerir autenticación de múltiples factores para cuentas con privilegios elevados.</li>
</ul>

<h3>2. Reporte de incidentes en 72 horas</h3>
<p>El artículo 33 de la ley establece la obligación de <strong>notificar a la ANCI dentro de las 72 horas</strong> siguientes al momento en que el operador tome conocimiento de un incidente de ciberseguridad que afecte a sus sistemas. Esta ventana es la misma que establece el GDPR europeo y que recoge la Ley 21.719 para brechas de datos personales.</p>
<p>Lo que esto significa en la práctica es que el establecimiento debe tener:</p>
<ul>
  <li>Un proceso definido para <strong>detectar incidentes</strong> (no se puede reportar lo que no se detecta).</li>
  <li>Un <strong>responsable designado</strong> que evalúe la gravedad del incidente y tome la decisión de notificar.</li>
  <li>Una <strong>plantilla o procedimiento de notificación</strong> que permita cumplir el plazo sin improvisación.</li>
  <li>Un <strong>registro interno</strong> del incidente, las acciones adoptadas y la notificación enviada.</li>
</ul>
<p>El incumplimiento del deber de reporte es sancionado de manera independiente a las sanciones por el incidente en sí. Un establecimiento que sufre una brecha y no la reporta dentro del plazo acumula dos infracciones, no una.</p>

<h3>3. Registros de auditoría</h3>
<p>La ley exige que los operadores mantengan <strong>registros de actividad</strong> (logs) que permitan reconstruir los eventos que llevaron a un incidente. Estos registros deben ser:</p>
<ul>
  <li><strong>Completos:</strong> deben capturar accesos, modificaciones y eliminaciones de datos.</li>
  <li><strong>Íntegros:</strong> no deben poder ser alterados por los mismos usuarios que generan la actividad.</li>
  <li><strong>Conservados:</strong> deben mantenerse por un período mínimo que la reglamentación define según el tipo de operador.</li>
  <li><strong>Accesibles:</strong> deben poder ser consultados y exportados en caso de fiscalización o investigación.</li>
</ul>

<h2>Cómo se complementa con la Ley 21.719</h2>
<p>Las leyes 21.663 y 21.719 no son redundantes: son complementarias. La Ley 21.719 regula el <strong>tratamiento de datos personales</strong> —qué datos se pueden recopilar, con qué finalidad, por cuánto tiempo y con qué base de legitimación. La Ley 21.663 regula la <strong>seguridad de los sistemas</strong> que procesan esos datos.</p>
<p>La intersección más relevante para los colegios es la de las <strong>brechas de seguridad</strong>. Un acceso no autorizado a los datos de estudiantes activa simultáneamente:</p>
<ul>
  <li>La obligación de notificación a la ANCI bajo la Ley 21.663 (72 horas).</li>
  <li>La obligación de notificación al Consejo para la Transparencia o a la autoridad de datos bajo la Ley 21.719.</li>
  <li>La obligación de informar a los titulares afectados (los apoderados, en el caso de menores).</li>
</ul>
<p>Un establecimiento que tiene los sistemas correctos para cumplir con la Ley 21.663 está, en su mayor parte, también en condiciones de cumplir con la Ley 21.719 en materia de seguridad. La inversa no siempre es cierta: se puede cumplir con algunas obligaciones de protección de datos sin tener la infraestructura de ciberseguridad que la Ley 21.663 exige. El análisis completo de la Ley 21.719 está disponible en <a href="/blog/ley-21719-que-deben-saber-los-colegios">Ley 21.719: Lo que todo colegio debe saber antes de diciembre 2026</a>.</p>

<h2>El estado actual de los colegios chilenos</h2>
<p>La realidad es que la mayoría de los establecimientos educacionales chilenos no tiene los controles técnicos que la Ley 21.663 exige. Las razones son estructurales:</p>
<ul>
  <li><strong>Infraestructura heredada:</strong> muchos colegios operan con software de gestión que data de hace 10 o 15 años, diseñado sin las exigencias actuales de seguridad.</li>
  <li><strong>Falta de personal especializado:</strong> el área de TI en un establecimiento educacional típico es una persona que gestiona dispositivos, no un equipo de seguridad informática.</li>
  <li><strong>Desconocimiento normativo:</strong> la Ley 21.663 es reciente y el sector educacional no ha recibido la misma comunicación institucional que, por ejemplo, el sector financiero.</li>
  <li><strong>Plataformas que no cumplen:</strong> los sistemas de gestión escolar más usados en Chile no fueron diseñados con los estándares que la ley ahora exige. El análisis detallado de este punto está en <a href="/blog/ninguna-plataforma-cumple-ley-21719">Por qué ninguna plataforma de gestión escolar cumple la Ley 21.719</a>.</li>
</ul>

<h2>Las sanciones que los sostenedores deben conocer</h2>
<p>La Ley 21.663 establece un régimen sancionatorio escalonado:</p>
<ul>
  <li><strong>Infracciones leves:</strong> multas de hasta 5.000 UTM (~$380 millones de pesos a valores actuales).</li>
  <li><strong>Infracciones graves:</strong> multas de hasta 10.000 UTM y prohibición temporal de operar ciertos sistemas.</li>
  <li><strong>Infracciones gravísimas:</strong> multas de hasta 20.000 UTM, con agravantes si el incidente afecta a menores de edad o si hubo negligencia en la notificación obligatoria.</li>
</ul>
<p>Adicionalmente, la ley contempla la <strong>responsabilidad personal de los directivos</strong> que hayan tenido conocimiento de vulnerabilidades y no hayan adoptado medidas. En el contexto educacional, esto apunta directamente al director del establecimiento y al sostenedor.</p>

<h2>Cómo Ethoz cumple nativamente con la Ley 21.663</h2>
<p>Ethoz fue diseñado desde su arquitectura base con las exigencias de la Ley 21.663 como requisito no negociable. Las tres obligaciones técnicas centrales están cubiertas de manera nativa:</p>
<h3>Cifrado con pgcrypto</h3>
<p>Ethoz utiliza <strong>pgcrypto</strong>, la extensión de cifrado nativa de PostgreSQL, para cifrar los datos en reposo. Esto significa que los datos sensibles de los estudiantes —incluyendo fichas médicas, registros de convivencia y documentos adjuntos— están cifrados a nivel de base de datos, no solo a nivel de transporte. Incluso si alguien obtuviera acceso directo a los archivos de la base de datos, los datos serían ilegibles sin las claves de cifrado.</p>
<h3>Control de acceso con Row-Level Security (RLS)</h3>
<p>El <strong>Row-Level Security (RLS) de Supabase/PostgreSQL</strong> implementa control de acceso a nivel de fila. Esto significa que las políticas de acceso no se gestionan solo en la capa de aplicación —que puede ser vulnerada— sino en la base de datos misma. Un usuario que accede con credenciales válidas pero sin los permisos correctos simplemente no ve los datos, aunque intente consultarlos directamente. Esta es la implementación más robusta posible del principio de mínimo privilegio que la Ley 21.663 exige.</p>
<h3>Auditoría completa con pgAudit</h3>
<p><strong>pgAudit</strong> es la extensión de auditoría para PostgreSQL que registra todas las operaciones sobre los datos: quién accedió, qué consultó, qué modificó y cuándo. En Ethoz, este registro es inmutable desde la perspectiva del usuario de la aplicación: ni el administrador del colegio puede alterar los logs. En caso de un incidente de ciberseguridad, el establecimiento puede presentar a la ANCI un log completo, íntegro y cronológico de toda la actividad del sistema.</p>

<h2>Conclusión</h2>
<p>La Ley 21.663 no es una ley del futuro: es una ley vigente con sanciones reales. Los establecimientos educacionales que gestionan datos de estudiantes en sistemas digitales —es decir, prácticamente todos— son sujetos obligados. Las tres exigencias centrales (cifrado, reporte en 72 horas y registros de auditoría) requieren infraestructura técnica específica que la mayoría de las plataformas de gestión escolar actuales no tienen.</p>
<p>El cumplimiento no es solo una obligación legal: es una decisión de gestión de riesgo. Los datos de los estudiantes son datos de menores de edad, y su protección tiene consecuencias que van más allá de las multas.</p>

<div style="background: var(--secondary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-top: 3rem;">
<h3 style="margin-top: 0;">Verifique si su plataforma cumple la Ley 21.663</h3>
<p>Ethoz es la única plataforma de gestión escolar en Chile diseñada con cifrado pgcrypto, RLS y auditoría pgAudit desde su arquitectura base. Solicite una demostración técnica y revise el cumplimiento de su establecimiento.</p>
<a href="/demo" style="display: inline-block; background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Solicitar demo gratuita</a>
</div>
`
};

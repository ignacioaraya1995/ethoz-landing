import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'ficha-360-perfil-integral-alumno',
	title: 'Ficha 360°: por qué cada alumno necesita un perfil integral que no se borre en marzo',
	description:
		'El reinicio de marzo borra el contexto acumulado de cada estudiante. La ficha 360° con historial longitudinal, RLS por rol y trazabilidad continua es el instrumento que los colegios necesitan pero casi ninguno tiene.',
	date: '2026-04-07',
	author: 'Equipo Ethoz',
	readTime: '8 min',
	tags: ['Ficha 360', 'Perfil Alumno', 'Trazabilidad'],
	coverImage: '/images/blog/ficha-360-perfil-integral-alumno.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">El reinicio de marzo es el momento en que la mayoría de los colegios pierde el contexto acumulado sobre cada estudiante. La ficha 360° es un perfil integral persistente que integra dimensiones académicas, conductuales, emocionales y familiares en un solo lugar accesible por rol. No es burocracia extra: es la base de datos que permite tomar decisiones informadas sobre estudiantes complejos sin tener que reconstruir el historial desde cero cada año.</p>
</div>

<h2>El reinicio de marzo y lo que se pierde</h2>
<p>Cada mes de marzo, miles de establecimientos educacionales chilenos comienzan el año escolar con una paradoja: tienen años de historia acumulada sobre sus estudiantes, pero esa historia no está disponible para quienes la necesitan. El profesor jefe nuevo del curso no sabe que el alumno en el tercer banco tuvo ocho incidentes de convivencia el año anterior. El orientador que llegó en enero no tiene acceso al expediente de las intervenciones realizadas con la familia en los últimos dos años. La psicóloga nueva no sabe que hubo una derivación al CESFAM en el segundo semestre.</p>
<p>Esta pérdida de contexto no es un problema de memoria humana: es un problema de infraestructura. La información existe —en cuadernos, en carpetas físicas, en el correo del orientador que se fue, en el sistema que no permite exportar datos de manera estructurada— pero no está disponible en el formato ni en el momento en que se necesita. El problema del reinicio de marzo se examina desde la perspectiva de la seguridad escolar en <a href="/blog/reinicio-de-marzo-seguridad-escolar">El reinicio de marzo: el mayor riesgo de seguridad escolar que nadie discute</a>.</p>

<h2>Qué es la ficha 360° y qué no es</h2>
<p>La ficha 360° no es un formulario más largo. No es un expediente psicológico completo. No es un sistema de vigilancia sobre los estudiantes. Es un <strong>perfil integral y persistente</strong> que consolida en un solo lugar la información relevante sobre un estudiante para que los actores institucionales puedan tomar decisiones informadas.</p>
<p>Las dimensiones que debe integrar una ficha 360° efectiva son:</p>
<h3>Dimensión académica</h3>
<ul>
  <li>Historial de notas por asignatura y período, con comparación entre años.</li>
  <li>Porcentaje de asistencia acumulado y tendencia mensual.</li>
  <li>Registros de evaluaciones diferenciadas o adaptaciones curriculares vigentes.</li>
  <li>Participación en programas de reforzamiento o apoyo académico.</li>
</ul>
<h3>Dimensión conductual</h3>
<ul>
  <li>Historial de incidentes de convivencia registrados, con fecha, tipo y actores involucrados.</li>
  <li>Medidas adoptadas por el establecimiento en respuesta a cada incidente.</li>
  <li>Compromisos firmados por el estudiante o la familia.</li>
  <li>Evolución del comportamiento a lo largo del tiempo.</li>
</ul>
<h3>Dimensión emocional y de bienestar</h3>
<ul>
  <li>Registros de entrevistas del orientador con el estudiante.</li>
  <li>Alertas de bienestar generadas por docentes.</li>
  <li>Derivaciones a profesionales internos o externos.</li>
  <li>Estado de seguimiento de cada derivación.</li>
</ul>
<h3>Dimensión familiar y contextual</h3>
<ul>
  <li>Composición del grupo familiar relevante para la gestión escolar.</li>
  <li>Historial de reuniones con apoderados.</li>
  <li>Acuerdos adoptados en reuniones y estado de cumplimiento.</li>
  <li>Situaciones de vulnerabilidad social activas o registradas.</li>
</ul>

<h2>El principio de trazabilidad longitudinal</h2>
<p>El valor de la ficha 360° no está en los datos de hoy: está en la capacidad de ver la trayectoria. Un estudiante que tiene tres incidentes de convivencia en el primer mes del año puede ser un caso de adaptación normal o puede ser el inicio de un patrón preocupante. La diferencia la hace el historial: si ese mismo estudiante tuvo doce incidentes el año anterior, la lectura cambia completamente.</p>
<p>La trazabilidad longitudinal —la capacidad de ver la evolución de un indicador a lo largo de meses y años— es el instrumento más potente de detección temprana disponible para un establecimiento. No requiere inteligencia artificial sofisticada: requiere que los datos estén integrados, que persistan entre años y que sean consultables en un formato que permita ver la tendencia.</p>
<p>Sin trazabilidad longitudinal, cada incidente se evalúa de manera aislada. Con trazabilidad longitudinal, el mismo incidente se evalúa en su contexto real. La diferencia entre estas dos lecturas puede determinar si un estudiante recibe la intervención que necesita o si llega al punto de no retorno sin que nadie haya identificado el patrón.</p>

<h2>Control de acceso por rol: quién ve qué</h2>
<p>La ficha 360° integra información de alta sensibilidad. Hay datos que el profesor jefe necesita conocer para gestionar su curso. Hay datos que solo el orientador debería ver. Hay datos cuya sensibilidad es tan alta que solo el director y el sostenedor deberían tener acceso. La solución no es no registrar esa información: es registrarla con el nivel de privacidad correcto y controlar el acceso de manera estricta.</p>
<p>Ethoz implementa tres niveles de visibilidad para los registros de la ficha 360°:</p>
<ul>
  <li><strong>Estándar:</strong> visible para todos los actores del establecimiento con acceso al sistema (docentes, inspectores, asistentes de la educación). Incluye datos académicos, asistencia e incidentes de convivencia generales.</li>
  <li><strong>Restringido:</strong> visible solo para orientadores, psicólogos y directivos. Incluye registros de entrevistas, alertas de bienestar y situaciones familiares.</li>
  <li><strong>Privado:</strong> visible solo para el orientador responsable y el director. Incluye información clínica, derivaciones a salud mental y situaciones de vulnerabilidad severa.</li>
</ul>
<p>Este esquema de control de acceso por rol (Role-Level Security, RLS) no es solo una decisión de diseño de la plataforma: es un requisito de la <strong>Ley 21.719</strong>. El artículo 16 bis exige que los datos sensibles sean accesibles únicamente para quienes tienen una necesidad legítima y justificada. El análisis técnico de este requisito está disponible en <a href="/blog/privacidad-por-diseno-art-16-bis">Privacidad por diseño: lo que el Art. 16 bis exige técnicamente</a>.</p>

<h2>La ficha 360° como instrumento de protección institucional</h2>
<p>La ficha 360° no protege solo al estudiante: protege al establecimiento. Cuando la Superintendencia de Educación inicia un proceso de fiscalización por una denuncia de maltrato, acoso o incumplimiento del deber de cuidado, la primera pregunta es si el establecimiento tenía información sobre el estudiante y qué hizo con ella.</p>
<p>Un establecimiento con ficha 360° puede responder: "Tenemos el registro de todos los incidentes, las intervenciones adoptadas, las comunicaciones con la familia y el seguimiento realizado." Un establecimiento sin ficha 360° tiene que buscar en cuadernos, correos y memoria de personas que pueden ya no trabajar ahí. La diferencia ante una fiscalización es abismal.</p>
<p>Adicionalmente, si un apoderado ejerce su derecho de acceso a los datos de su hijo (derecho ARCO bajo la Ley 21.719), el establecimiento tiene la obligación de entregar una relación completa de qué datos tiene, con qué finalidad y quién los ha consultado. Con una ficha 360° bien estructurada, esta respuesta se puede generar en minutos. Sin ella, es prácticamente imposible cumplir el plazo legal.</p>

<h2>Por qué la mayoría de los colegios no tiene esto hoy</h2>
<p>La ficha 360° no existe en la mayoría de los establecimientos chilenos por razones que tienen más que ver con la historia de los sistemas de gestión escolar que con falta de voluntad institucional:</p>
<ul>
  <li>Los sistemas heredados fueron diseñados por módulos: uno para notas, otro para asistencia, otro para convivencia. Nunca fueron diseñados para integrarse en un perfil unificado del estudiante.</li>
  <li>Los datos de bienestar emocional y familiar no tienen un lugar natural en los sistemas de gestión académica tradicionales, por lo que permanecen en registros paralelos (cuadernos del orientador, carpetas físicas).</li>
  <li>El control de acceso por rol requiere una arquitectura técnica que las plataformas más antiguas no tienen: en muchos sistemas, todos los usuarios ven todos los datos.</li>
  <li>La persistencia entre años requiere una decisión de diseño deliberada. Muchos sistemas simplifican el reinicio de año borrando o archivando los datos del período anterior.</li>
</ul>

<h2>Cómo implementa Ethoz la ficha 360°</h2>
<p>Ethoz construyó la ficha 360° como el objeto central de su arquitectura, no como un módulo adicional. Cada entidad del sistema —incidente de convivencia, registro de entrevista, alerta de asistencia, derivación a profesional— está vinculada al perfil del estudiante y persiste entre períodos académicos.</p>
<p>Las dimensiones técnicas clave son:</p>
<ul>
  <li><strong>Persistencia longitudinal:</strong> los datos no se borran ni se archivan inaccesiblemente en el cambio de año. El historial completo está siempre disponible para quienes tienen el nivel de acceso correspondiente.</li>
  <li><strong>RLS nativo:</strong> el control de acceso por rol está implementado a nivel de base de datos, no solo en la capa de aplicación. Esto significa que incluso un acceso técnico a la base de datos no permite ver datos para los que no se tiene permiso.</li>
  <li><strong>Trazabilidad de accesos:</strong> el sistema registra quién consultó la ficha de cada estudiante y cuándo, generando el log de auditoría que la Ley 21.719 exige.</li>
  <li><strong>Vista consolidada:</strong> el orientador, el director o el docente ven todos los datos a los que tienen acceso en una sola pantalla, sin tener que navegar por múltiples módulos o sistemas.</li>
</ul>

<h2>Conclusión</h2>
<p>La ficha 360° no es una aspiración futura: es una necesidad presente. Los establecimientos que no tienen un perfil integral y persistente de sus estudiantes están tomando decisiones críticas sobre casos complejos con información incompleta. El costo de esa información incompleta se mide en intervenciones tardías, en estudiantes que caen en patrones de riesgo sin que nadie los detecte a tiempo, en fiscalizaciones que no se pueden responder con evidencia y en obligaciones legales que no se pueden cumplir.</p>
<p>El reinicio de marzo puede ser el inicio de un nuevo año escolar. No tiene que ser el inicio de la ignorancia institucional sobre cada estudiante.</p>

<div style="background: var(--secondary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-top: 3rem;">
<h3 style="margin-top: 0;">Conozca la ficha 360° de Ethoz en acción</h3>
<p>Ethoz consolida el historial académico, conductual, emocional y familiar de cada estudiante en un perfil que persiste entre años y respeta el control de acceso por rol. Solicite una demostración y vea qué información tiene hoy sobre sus estudiantes.</p>
<a href="/demo" style="display: inline-block; background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Solicitar demo gratuita</a>
</div>
`
};

import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'comparativa-plataformas-gestion-escolar',
	title: 'Comparativa 2026: las 8 plataformas de gestión escolar en Chile y sus limitaciones',
	description:
		'Lirmi, Colegium, WebClass, Napsis, Syscol, Kimche, U-Planner e Integratepie: análisis crítico de cada plataforma y el gap que ninguna cubre en protección de datos y convivencia escolar.',
	date: '2026-04-07',
	author: 'Equipo Ethoz',
	readTime: '10 min',
	tags: ['Comparativa', 'Software Escolar', 'Gestión Escolar'],
	coverImage: '/images/blog/comparativa-plataformas-gestion-escolar.webp',
	content: `
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Las ocho plataformas de gestión escolar más usadas en Chile tienen limitaciones estructurales para el cumplimiento normativo de 2026: API cerradas, datos sin cifrado adecuado, vendor lock-in, deuda técnica acumulada o escope reducido a un segmento. Ninguna fue diseñada con las exigencias de la Ley 21.719 ni la Ley 21.663 como requisito base. El gap que queda sin cubrir es precisamente el que Ethoz aborda: protección, convivencia y trazabilidad longitudinal con arquitectura de seguridad nativa.</p>
</div>

<h2>El mercado de software escolar en Chile en 2026</h2>
<p>El mercado chileno de software de gestión escolar está fragmentado entre plataformas que nacieron en contextos normativos muy diferentes al actual. La mayoría tiene entre 10 y 20 años de historia, fue diseñada para gestionar notas y asistencia en un entorno donde la protección de datos personales no tenía el peso legal que tiene hoy, y ha acumulado deuda técnica que dificulta la adaptación a los nuevos requisitos.</p>
<p>Con la <strong>Ley 21.719</strong> en plena vigencia y la <strong>Ley 21.663</strong> imponiendo estándares de ciberseguridad, los establecimientos enfrentan en 2026 una decisión que no pueden postergar: ¿puede su plataforma actual cumplir con lo que la ley exige? El análisis de por qué la respuesta generalmente es negativa está en <a href="/blog/ninguna-plataforma-cumple-ley-21719">Por qué ninguna plataforma de gestión escolar cumple la Ley 21.719</a>.</p>
<p>A continuación, un análisis crítico de cada plataforma con sus fortalezas declaradas y sus limitaciones documentadas.</p>

<h2>1. Lirmi</h2>
<p><strong>Posicionamiento:</strong> Plataforma de gestión pedagógica y curricular con enfoque en planificación docente y seguimiento de objetivos de aprendizaje. Presencia en Chile, México y Colombia.</p>
<p><strong>Fortalezas:</strong> interfaz relativamente moderna, buena experiencia docente en planificación, integración con el currículum MINEDUC.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>API cerrada:</strong> Lirmi no expone una API pública que permita integraciones con otros sistemas. Esto significa que los datos que entran a Lirmi no pueden salir de manera estructurada hacia otras herramientas del establecimiento.</li>
  <li><strong>Arquitectura cerrada:</strong> el modelo de negocio de Lirmi desincentiva la interoperabilidad. El establecimiento que adopta Lirmi acepta implícitamente que su información pedagógica quedará en un silo.</li>
  <li><strong>Sin módulo de convivencia estructurado:</strong> Lirmi no tiene un sistema de gestión de incidentes de convivencia con historial longitudinal. Este componente es externo o inexistente.</li>
  <li><strong>Sin cumplimiento explícito de Ley 21.719:</strong> no hay documentación pública sobre las medidas técnicas que Lirmi implementa para el cumplimiento de la ley de protección de datos.</li>
</ul>

<h2>2. Colegium</h2>
<p><strong>Posicionamiento:</strong> Una de las plataformas con mayor penetración histórica en el mercado chileno. Cubre gestión académica, comunicaciones con apoderados y administración.</p>
<p><strong>Fortalezas:</strong> amplia base instalada, reconocimiento de marca, cobertura de múltiples procesos administrativos.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Calificación de usuarios 2,4 sobre 5:</strong> la valoración agregada en plataformas de reseñas refleja problemas sistemáticos de experiencia de usuario, soporte técnico y estabilidad del sistema.</li>
  <li><strong>Deuda técnica acumulada:</strong> Colegium lleva más de 15 años en el mercado con una base de código que ha crecido por acreción, no por rediseño. Las funcionalidades nuevas se suman a una arquitectura original que no fue diseñada para soportarlas.</li>
  <li><strong>Módulo de convivencia rudimentario:</strong> el registro de incidentes existe pero no tiene la profundidad de historial longitudinal ni el control de acceso por rol que la gestión de datos sensibles requiere.</li>
  <li><strong>Sin arquitectura de cifrado documentada:</strong> no hay información pública verificable sobre cómo Colegium maneja el cifrado de datos en reposo.</li>
</ul>

<h2>3. WebClass</h2>
<p><strong>Posicionamiento:</strong> Plataforma de gestión académica y curricular con fuerte presencia en el segmento de colegios particulares pagados.</p>
<p><strong>Fortalezas:</strong> buena cobertura de los procesos de gestión académica, interfaz familiar para equipos con historia en la plataforma.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Vendor lock-in severo:</strong> WebClass diseña deliberadamente sus formatos de exportación y sus integraciones de manera que migrar a otro sistema sea costoso. Los datos ingresados a WebClass son difíciles de extraer en formatos estándar.</li>
  <li><strong>Modelo de precios por módulo:</strong> las funcionalidades básicas están disponibles, pero las capacidades avanzadas (reportes, integración con otros sistemas, acceso de múltiples roles) se cobran como módulos adicionales, generando costos que escalan con el tamaño del establecimiento.</li>
  <li><strong>Sin API pública:</strong> la interoperabilidad con otros sistemas es limitada o requiere acuerdos comerciales específicos con el proveedor.</li>
</ul>

<h2>4. Napsis</h2>
<p><strong>Posicionamiento:</strong> Plataforma de administración escolar con énfasis en los procesos de gestión financiera y matrícula. Orientada principalmente al segmento municipal y subvencionado.</p>
<p><strong>Fortalezas:</strong> cobertura de procesos administrativos financieros, familiaridad en el sector municipal.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Datos no cifrados en reposo:</strong> análisis técnico de la arquitectura de Napsis indica que los datos almacenados no están cifrados a nivel de base de datos, lo que constituye un incumplimiento directo de los requisitos de la Ley 21.663.</li>
  <li><strong>Sin control de acceso granular:</strong> el modelo de permisos de Napsis no implementa Row-Level Security. El acceso a los datos se controla a nivel de módulo, no a nivel de registro individual.</li>
  <li><strong>Arquitectura monolítica:</strong> la plataforma no está diseñada para integrarse con herramientas externas de manera ágil.</li>
</ul>

<h2>5. Syscol</h2>
<p><strong>Posicionamiento:</strong> Sistema de gestión escolar orientado a establecimientos de tamaño mediano con énfasis en administración y comunicación con apoderados.</p>
<p><strong>Fortalezas:</strong> precio competitivo, funcionalidades básicas cubiertas, implantación relativamente rápida.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Sin API:</strong> Syscol no ofrece una API que permita integraciones. Los datos quedan atrapados en la plataforma sin posibilidad de exportación estructurada hacia herramientas de análisis o de integración con otros sistemas del establecimiento.</li>
  <li><strong>Escasa capacidad de personalización:</strong> el sistema funciona bien para el caso de uso estándar pero tiene poca flexibilidad para adaptar procesos a las necesidades específicas de cada establecimiento.</li>
  <li><strong>Sin módulo de protección escolar:</strong> la dimensión de convivencia y bienestar no está cubierta de manera estructurada.</li>
</ul>

<h2>6. Kimche</h2>
<p><strong>Posicionamiento:</strong> Plataforma relativamente más reciente en el mercado chileno con propuesta de modernización frente a las plataformas heredadas.</p>
<p><strong>Fortalezas:</strong> interfaz más moderna que las plataformas de primera generación, propuesta de integración de procesos.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Precios opacos:</strong> Kimche no publica sus precios públicamente. El proceso de cotización requiere contacto con el equipo comercial, lo que dificulta la comparación objetiva por parte de los sostenedores.</li>
  <li><strong>Base de clientes limitada:</strong> la plataforma tiene menos historial que las incumbentes, lo que implica menos datos sobre estabilidad y rendimiento en escenarios de uso intensivo.</li>
  <li><strong>Cumplimiento normativo no documentado:</strong> no hay información pública verificable sobre las medidas técnicas implementadas para el cumplimiento de las leyes 21.719 y 21.663.</li>
</ul>

<h2>7. U-Planner</h2>
<p><strong>Posicionamiento:</strong> Plataforma de planificación académica y gestión curricular diseñada específicamente para la educación superior universitaria.</p>
<p><strong>Fortalezas:</strong> profunda especialización en los procesos específicos de las universidades, reconocimiento en el segmento de educación superior.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Escope exclusivo de educación superior:</strong> U-Planner no está diseñado para establecimientos de educación básica o media. Su inclusión en este análisis es para documentar que no es una alternativa para el mercado escolar, pese a que a veces se menciona en conversaciones sobre software educacional.</li>
  <li><strong>Sin relevancia para sostenedores escolares:</strong> los procesos que U-Planner cubre (gestión de mallas curriculares universitarias, planificación de carreras, acreditación institucional) no tienen equivalente en la educación escolar.</li>
</ul>

<h2>8. Integratepie</h2>
<p><strong>Posicionamiento:</strong> Solución de gestión escolar desarrollada por una microempresa con foco en establecimientos de tamaño pequeño a mediano.</p>
<p><strong>Fortalezas:</strong> precio accesible, soporte personalizado por el tamaño del equipo proveedor, implementación simple.</p>
<p><strong>Limitaciones estructurales:</strong></p>
<ul>
  <li><strong>Riesgo de continuidad de negocio:</strong> el tamaño de la empresa proveedora genera incertidumbre sobre la continuidad del soporte a largo plazo. Un cambio en el equipo o en la situación financiera del proveedor puede dejar al establecimiento sin soporte.</li>
  <li><strong>Capacidad técnica limitada:</strong> las exigencias de cifrado, auditoría y control de acceso que imponen las leyes 21.719 y 21.663 requieren un equipo de ingeniería con capacidades específicas que una microempresa típicamente no tiene.</li>
  <li><strong>Sin escalabilidad:</strong> la plataforma puede funcionar bien para establecimientos pequeños pero tiene limitaciones para crecer con las necesidades de redes de colegios o establecimientos de mayor tamaño.</li>
</ul>

<h2>El gap que ninguna plataforma cubre</h2>
<p>El análisis de las ocho plataformas revela un patrón consistente: todas fueron diseñadas para resolver el problema de gestión académica y administrativa de la era pre-normativa. Ninguna fue construida con las exigencias de la Ley 21.719 ni la Ley 21.663 como requisito de diseño.</p>
<p>El gap específico que queda sin cubrir es la intersección de tres capacidades:</p>
<ol>
  <li><strong>Protección de datos con cifrado nativo y control de acceso por rol a nivel de base de datos</strong> (no solo en la capa de aplicación).</li>
  <li><strong>Gestión de convivencia con historial longitudinal</strong> que persiste entre años y permite detectar patrones de riesgo.</li>
  <li><strong>Trazabilidad de auditoría completa</strong> que permita responder ante una fiscalización con evidencia de qué datos existen, quién los accedió y qué acciones se adoptaron.</li>
</ol>
<p>Este es el espacio que Ethoz ocupa: no como una plataforma de gestión académica más, sino como el sistema especializado en protección escolar y cumplimiento normativo que los establecimientos chilenos necesitan en el contexto regulatorio de 2026.</p>

<h2>Conclusión</h2>
<p>La elección de plataforma de gestión escolar en 2026 no puede hacerse con los criterios de 2015. El contexto normativo cambió de manera fundamental: ya no es suficiente con que el sistema funcione operativamente. Debe cumplir con estándares técnicos de seguridad que la mayoría de las plataformas vigentes no alcanza. Los sostenedores que evalúen o renueven sus contratos de software escolar en 2026 deben hacer tres preguntas concretas: ¿los datos están cifrados en reposo? ¿Existe control de acceso a nivel de base de datos? ¿Hay un log de auditoría inmutable? Si la respuesta a cualquiera de las tres es no, el establecimiento está expuesto.</p>

<div style="background: var(--secondary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-top: 3rem;">
<h3 style="margin-top: 0;">Conozca la alternativa diseñada para el contexto normativo de 2026</h3>
<p>Ethoz fue construido desde cero con cifrado pgcrypto, Row-Level Security y auditoría pgAudit como requisitos no negociables. Solicite una demostración técnica y compare con lo que tiene hoy.</p>
<a href="/demo" style="display: inline-block; background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Solicitar demo gratuita</a>
</div>
`
};

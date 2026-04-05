import type { BlogPost } from './types';

export const post: BlogPost = {
	slug: 'inteligencia-artificial-desercion-escolar',
	title: 'IA en educación: Cómo predecir la deserción escolar en 14 días',
	description:
		'Investigación de la UTN demuestra que un Perceptrón Multicapa con 10 neuronas predice deserción escolar con los primeros 14 días de datos de interacción. Los indicadores clave, la fórmula de impacto económico y cómo implementarlo cumpliendo el Art. 16 bis.',
	date: '2026-04-02',
	author: 'Ignacio Araya',
	readTime: '8 min',
	tags: ['Inteligencia Artificial', 'Deserción', 'EdTech'],
	coverImage: '/images/blog/inteligencia-artificial-desercion-escolar.webp',
	content: `
<div style="border-left: 3px solid oklch(0.75 0.15 85); padding-left: 1rem; margin-bottom: 2rem; background: oklch(0.75 0.15 85 / 0.08); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: oklch(0.55 0.12 85); margin-bottom: 0.5rem;">Nota de transparencia</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Ethoz ya usa IA para generar síntesis y resúmenes del alumno a partir de su historial y los últimos 6 meses de datos. La predicción de deserción que se explora en este artículo es una extensión natural de esa capacidad, actualmente en nuestro roadmap.</p>
</div>
<div style="border-left: 3px solid var(--primary); padding-left: 1rem; margin-bottom: 2rem; background: var(--secondary); border-radius: 0.5rem; padding: 1.25rem;">
<p style="font-weight: 700; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.5rem;">TL;DR</p>
<p style="font-size: 0.875rem; line-height: 1.75; margin: 0;">Investigación de la UTN demuestra que una red neuronal puede predecir la deserción escolar usando solo datos de las primeras dos semanas de clases. El predictor más relevante es la interacción con materiales en las primeras 48 horas. Modelos por curso superan a los modelos generales.</p>
</div>
<h2>El problema que nadie detecta a tiempo</h2>
<p>Un alumno que deserta no lo decide en un día. La señal existe semanas antes: baja en la interacción con materiales, ausencias a clases sincrónicas, silencio en los primeros días de acceso a la plataforma. El problema es que ningún director puede monitorear esas señales manualmente para cientos de estudiantes simultáneamente.</p>

<p>La inteligencia artificial puede hacerlo. Y la evidencia científica ya existe.</p>

<h2>Qué dice la investigación de la UTN</h2>
<p>Un estudio publicado por investigadores de la Universidad Tecnológica Nacional (UTN) evaluó algoritmos de machine learning para predecir deserción escolar en entornos de educación virtual. El hallazgo central es preciso: el <strong>Perceptrón Multicapa (MLP) con 10 neuronas en la capa oculta</strong> supera consistentemente a los algoritmos alternativos evaluados.</p>

<p>Los modelos comparados fueron:</p>

<ul>
  <li><strong>Perceptrón Multicapa (MLP):</strong> mejor desempeño general en precisión y recall</li>
  <li><strong>k-Nearest Neighbors (k-NN):</strong> rendimiento aceptable pero sensible a ruido en datos</li>
  <li><strong>Random Forest:</strong> robusto en datos tabulares pero inferior al MLP en este dominio específico</li>
</ul>

<p>El resultado más relevante para la gestión escolar no es cuál algoritmo gana, sino cuándo puede predecir: <strong>con solo los primeros 14 días de interacción</strong>, el modelo identifica con alta confianza quién tiene riesgo de abandonar el curso o el establecimiento.</p>

<figure>
  <img src="/images/blog/inline-ai-prediction-pipeline.webp" alt="Diagrama del pipeline de predicción: datos de interacción del alumno alimentan un modelo de IA que genera niveles de riesgo de deserción" />
  <figcaption>Pipeline de predicción: los datos de interacción temprana alimentan el modelo que identifica alumnos en riesgo</figcaption>
</figure>

<h2>Los predictores que realmente importan</h2>
<p>La investigación identificó las variables con mayor peso predictivo en el modelo. El ranking no es intuitivo y eso es exactamente su valor:</p>

<table>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Importancia relativa</th>
      <th>Implicancia operacional</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Materiales visualizados</td>
      <td>4,1 (máxima)</td>
      <td>Si el alumno no abre los recursos en la primera semana, la probabilidad de deserción sube drásticamente</td>
    </tr>
    <tr>
      <td>Asistencia a clases sincrónicas</td>
      <td>Alta</td>
      <td>La ausencia en las primeras sesiones en vivo es señal temprana de desvinculación</td>
    </tr>
    <tr>
      <td>Interacción en los primeros 6 días</td>
      <td>Alta</td>
      <td>El patrón de los primeros 6 días predice el comportamiento del semestre completo</td>
    </tr>
    <tr>
      <td>Calificaciones parciales</td>
      <td>Media</td>
      <td>Indicador tardío: cuando aparece, la intervención tiene menos margen</td>
    </tr>
  </tbody>
</table>

<p>El dato crítico: <strong>las calificaciones son un predictor tardío</strong>. Para cuando un alumno reprueba la primera evaluación, la desvinculación ya lleva semanas construyéndose. Los sistemas de alerta basados solo en notas llegan tarde.</p>

<h2>La fórmula del impacto económico</h2>
<p>Para que una dirección escolar justifique la inversión en un sistema predictivo ante su sostenedor, necesita cuantificar el retorno. La investigación propone la siguiente fórmula de impacto:</p>

<blockquote>
  <p><strong>Impacto = Ingresos Recuperados / Pérdida por Deserción</strong></p>
  <p>Donde la Pérdida por Deserción = (Alumnos que desertaron × Arancel mensual promedio × Meses restantes del año escolar)</p>
</blockquote>

<p>Ejemplo aplicado: un establecimiento con 800 alumnos, tasa histórica de deserción de 8% anual, y arancel mensual de $180.000 CLP, pierde aproximadamente $138 millones al año por deserción. Si un sistema predictivo permite intervenir oportunamente en el 40% de esos casos, el impacto directo supera los $55 millones. En ese contexto, el costo de implementación tecnológica se amortiza en el primer ciclo escolar.</p>

<h2>Por qué los modelos por curso superan al modelo general</h2>
<p>Un hallazgo que tiene consecuencias directas para la implementación: <strong>los modelos entrenados por curso específico son más precisos que un modelo general</strong> que intenta predecir deserción para toda la institución.</p>

<p>La razón es estructural. El perfil de un alumno en riesgo de desertar de primero medio es diferente al de un alumno de cuarto medio. Las causas, los patrones de interacción, los factores socioeconómicos y el tipo de intervención efectiva varían significativamente. Un modelo general promedia esas diferencias y pierde precisión.</p>

<p>Para los sostenedores esto significa que la arquitectura correcta no es un solo modelo institucional, sino una familia de modelos: uno por nivel, idealmente uno por curso. El volumen de datos requerido para entrenamiento es mayor, pero los datos ya existen en cualquier sistema de información escolar con un año de historia.</p>

<h2>El contexto de mercado: por qué esto es urgente ahora</h2>
<p>El mercado global de Sistemas de Información Escolar (SIS) alcanzó los <strong>$11.290 millones de dólares en 2024</strong> y las proyecciones lo ubican en <strong>$70.720 millones para 2034</strong>, con una tasa de crecimiento compuesto (CAGR) de entre 15,9% y 20,16% anual. Esto no es una tendencia futura: es una migración en curso.</p>

<p>Los establecimientos que adopten capacidades predictivas ahora construirán ventajas operacionales que serán difíciles de replicar por competidores que esperen. La brecha entre un colegio con detección temprana de deserción y uno sin ella se traduce directamente en tasas de retención, continuidad de matrícula y resultados SIMCE.</p>

<h2>Implementación con cumplimiento ético y legal</h2>
<p>Usar datos de alumnos para entrenar modelos predictivos genera obligaciones legales específicas que los directivos deben conocer antes de implementar cualquier solución.</p>

<p><strong>Privacidad por diseño.</strong> Los datos de interacción usados para entrenamiento deben ser anonimizados o seudonimizados antes de ser procesados por el modelo. El sistema predictivo debe operar sobre perfiles de riesgo, no sobre la identidad del alumno expuesta innecesariamente.</p>

<p><strong>Art. 16 bis de la Ley 21.719: decisiones automatizadas.</strong> Este artículo regula el uso de sistemas automatizados para tomar decisiones que afecten a las personas. Si su sistema predictivo genera una alerta que dispara una acción sobre un alumno —una llamada, una entrevista, un cambio de grupo—, esa acción constituye una decisión basada en tratamiento automatizado. El alumno o su representante legal tiene derecho a conocer la lógica usada y a solicitar revisión humana. Sus protocolos de intervención deben documentar esto.</p>

<p><strong>Consentimiento informado.</strong> El uso de datos de interacción con fines de análisis predictivo debe estar contemplado en la política de privacidad del establecimiento y en los consentimientos firmados por apoderados. Si sus documentos actuales no mencionan el uso analítico de datos de comportamiento digital, necesitan actualización antes de activar cualquier modelo.</p>

<p><strong>Minimización de datos.</strong> El modelo solo debe acceder a los datos estrictamente necesarios para su función. No necesita el RUT del alumno para calcular su riesgo de deserción; necesita su patrón de interacción. La arquitectura debe reflejar este principio desde el diseño.</p>

<h2>El camino desde la señal hasta la intervención</h2>
<p>La cadena de valor no termina en la predicción. Un modelo que genera alertas sin un protocolo de intervención claro produce fatiga de alertas y eventualmente se ignora. La implementación efectiva requiere:</p>

<ul>
  <li>Definir umbrales de riesgo (alto, medio, bajo) con acción específica para cada nivel</li>
  <li>Asignar responsables por nivel de alerta (orientador, jefe de UTP, dirección)</li>
  <li>Establecer tiempos máximos de respuesta desde la alerta hasta el primer contacto</li>
  <li>Registrar las intervenciones realizadas para retroalimentar el modelo y medir efectividad</li>
  <li>Revisar trimestralmente la precisión del modelo y recalibrarlo si cambian las condiciones</li>
</ul>

<p>Los sistemas de información escolar modernos integran estas capacidades de forma nativa, conectando el modelo predictivo con el módulo de orientación y el registro de intervenciones en un flujo único. Esto elimina la fricción operacional que hace fracasar las implementaciones manuales.</p>

<p>Para entender los requisitos legales que su plataforma debe cumplir antes de activar estas funcionalidades, lea <a href="/blog/multas-proteccion-datos-sostenedores">la guía de cumplimiento sobre la Ley 21.719 y las multas de hasta 20.000 UTM</a>.</p>
`
};

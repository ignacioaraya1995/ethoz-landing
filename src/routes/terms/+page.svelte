<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
  <title>Términos de Uso — Ethoz</title>
  <meta name="description" content="Términos de uso de Ethoz. Condiciones de uso de la plataforma de gestión escolar." />
  <meta property="og:url" content="https://ethoz.cl/terms" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Términos de Uso — Ethoz" />
  <meta property="og:description" content="Términos de uso de Ethoz. Condiciones de uso de la plataforma de gestión escolar." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Términos de Uso — Ethoz" />
  <meta name="twitter:description" content="Términos de uso de Ethoz. Condiciones de uso de la plataforma de gestión escolar." />
  <link rel="canonical" href="https://ethoz.cl/terms" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <div class="mx-auto flex-1 max-w-3xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20 sm:px-6 lg:px-8">

    <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Términos de Uso</h1>
    <p class="mt-2 text-sm text-muted-foreground">Última actualización: abril 2026</p>

    <div class="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">

      <section>
        <h2 class="text-lg font-semibold text-foreground">1. Aceptación de los términos</h2>
        <p class="mt-2">
          Al acceder y utilizar la plataforma Ethoz, usted acepta estos términos de uso en su totalidad. Si no está de acuerdo con alguna de estas condiciones, no debe utilizar el servicio.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">2. Descripción del servicio</h2>
        <p class="mt-2">
          Ethoz es una plataforma de gestión y cumplimiento normativo para establecimientos educacionales en Chile. Proporciona herramientas de seguimiento de alumnos, control de acceso, gestión de retiros escolares y cumplimiento con la Ley 21.719 de Protección de Datos Personales.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">3. Acceso y credenciales</h2>
        <p class="mt-2">
          El acceso a Ethoz se otorga exclusivamente a administradores autorizados del establecimiento educacional contratante. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">4. Uso permitido</h2>
        <p class="mt-2">Usted se compromete a utilizar Ethoz exclusivamente para:</p>
        <ul class="mt-3 list-disc space-y-1.5 pl-5">
          <li>La gestión legítima de datos escolares del establecimiento contratante.</li>
          <li>El cumplimiento de obligaciones normativas y legales aplicables.</li>
          <li>La protección de la seguridad y bienestar de los alumnos.</li>
        </ul>
        <p class="mt-3">
          Queda prohibido el uso de la plataforma para cualquier finalidad ilegal, la extracción masiva de datos, o el acceso a información de establecimientos distintos al propio.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">5. Propiedad intelectual</h2>
        <p class="mt-2">
          Todo el contenido, marcas registradas, código y software de Ethoz son propiedad exclusiva de Ethoz SpA y están protegidos por la legislación chilena e internacional de propiedad intelectual. No está permitida su reproducción sin consentimiento previo por escrito.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">6. Disponibilidad del servicio</h2>
        <p class="mt-2">
          Ethoz se esfuerza por mantener la plataforma disponible de forma continua. Sin embargo, pueden existir interrupciones programadas por mantenimiento o actualizaciones, las cuales serán comunicadas con anticipación razonable.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">7. Limitación de responsabilidad</h2>
        <p class="mt-2">
          Ethoz no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del servicio. La responsabilidad total de Ethoz se limita al monto pagado por el establecimiento en los últimos 12 meses.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">8. Modificaciones</h2>
        <p class="mt-2">
          Ethoz se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones serán comunicadas a los usuarios registrados y entrarán en vigencia 30 días después de su publicación.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">9. Legislación aplicable</h2>
        <p class="mt-2">
          Estos términos se rigen por las leyes de la República de Chile. Cualquier controversia será sometida a los tribunales ordinarios de justicia de Santiago de Chile.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-foreground">10. Contacto</h2>
        <p class="mt-2">
          Para consultas sobre estos términos, escriba a <a href="mailto:legal@ethoz.cl" class="font-medium text-primary underline underline-offset-2 hover:opacity-80">legal@ethoz.cl</a>.
        </p>
      </section>

    </div>
  </div>
  <Footer />
</main>

<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ArrowRight, ArrowLeft, Plug, Upload, Database, Check, Zap, Building } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('integrations_page_viewed'); });
</script>

<svelte:head>
  <title>Integraciones — Ethoz</title>
  <meta name="description" content="Ethoz se conecta con tu sistema actual o te ofrece un módulo básico de gestión escolar. Migramos tus datos sin que pierdas nada." />
  <meta property="og:url" content="https://ethoz.cl/integrations" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integraciones — Ethoz" />
  <meta property="og:description" content="Conecta Ethoz con Napsis, Syscol, SIGE o cualquier sistema. Si no tienes uno, tenemos un módulo básico incluido." />
  <meta name="twitter:title" content="Integraciones — Ethoz" />
  <meta name="twitter:description" content="Conecta Ethoz con tu sistema actual o usa nuestro módulo básico de gestión escolar." />
  <link rel="canonical" href="https://ethoz.cl/integrations" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Integraciones"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col pt-16">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a productos
      </a>
      <div class="mt-6 max-w-3xl">
        <div class="flex items-center gap-3">
          <Plug class="size-6 shrink-0 text-primary" />
          <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Se conecta con lo que ya usas
          </h1>
        </div>
        <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
          Ethoz no reemplaza tu sistema académico — lo complementa. Si ya usas Napsis, Syscol, SchoolTrack u otra plataforma, nos integramos. Si no tienes sistema digital, tenemos un módulo básico incluido para que no te falte nada.
        </p>
      </div>
    </div>
  </section>

  <!-- Option 1: Integration -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">01</span>
          <h2 class="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Integración con tu sistema actual
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Si tu colegio ya tiene un sistema de gestión académica, Ethoz se conecta sin reemplazarlo. Notas, asistencia y matrícula siguen donde están — Ethoz agrega lo que falta: seguimiento integral, retiros seguros y cumplimiento normativo.
          </p>
          <div class="mt-6 space-y-3">
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Importación desde Excel, CSV o cualquier formato estructurado</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Conexión con Napsis, Syscol, SchoolTrack y otros</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Integración con SIGE para matrícula y asistencia (en desarrollo)</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Sin doble digitación — los datos fluyen automáticamente</span>
            </div>
          </div>
        </div>

        <!-- Visual: compatible systems -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p class="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Sistemas compatibles</p>
          <div class="space-y-3">
            {#each [
              { name: 'Napsis', desc: 'Libro de clases y asistencia', status: 'Disponible' },
              { name: 'Syscol', desc: 'Gestión académica', status: 'Disponible' },
              { name: 'SchoolTrack', desc: 'Gestión escolar', status: 'Disponible' },
              { name: 'SIGE / MINEDUC', desc: 'Matrícula y datos institucionales', status: 'En desarrollo' },
              { name: 'Excel / CSV', desc: 'Cualquier formato estructurado', status: 'Disponible' },
            ] as system}
              <div class="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <p class="text-sm font-medium text-foreground">{system.name}</p>
                  <p class="text-xs text-muted-foreground">{system.desc}</p>
                </div>
                <span class="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium {system.status === 'Disponible' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-foreground'}">
                  {system.status}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Option 2: All-in-one -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Visual: basic module -->
        <div class="order-2 lg:order-1">
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div class="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <div class="size-2.5 rounded-full bg-destructive/60"></div>
              <div class="size-2.5 rounded-full bg-warning/60"></div>
              <div class="size-2.5 rounded-full bg-success/60"></div>
              <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Gestión Básica</span>
            </div>
            <div class="space-y-2.5">
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">Libro de clases digital</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">Registro de asistencia</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">Conforme a Circular N°30</span>
                <Check class="size-3.5 text-success" />
              </div>
              <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <span class="text-xs font-medium text-foreground">Exportación para SIGE</span>
                <Check class="size-3.5 text-success" />
              </div>
            </div>
            <p class="mt-4 text-center text-[10px] text-muted-foreground">Incluido sin costo adicional en todos los planes</p>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">02</span>
          <h2 class="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ¿No tienes sistema? No es problema.
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Si tu colegio todavía trabaja con planillas, cuadernos o no tiene un sistema digital, Ethoz incluye un módulo básico de gestión escolar conforme a la Circular N°30. No buscamos reemplazar a nadie — pero si necesitas tener todo en un solo lugar, estamos preparados.
          </p>
          <div class="mt-6 space-y-3">
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Libro de clases digital básico</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Registro de asistencia y observaciones</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Incluido sin costo adicional en todos los planes</span>
            </div>
            <div class="flex items-start gap-2.5">
              <Check class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Si después contratas otro sistema, nos integramos sin perder datos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Migration -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <div class="flex items-center justify-center gap-3">
        <Upload class="size-5 text-primary" />
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Nosotros migramos tus datos</h2>
      </div>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        No tienes que mover un dedo. Nuestro equipo se encarga de importar tus datos históricos — desde Excel, desde tu sistema actual, o incluso desde registros en papel. En menos de 2 semanas tu colegio está operando con toda su información disponible.
      </p>
      <div class="mt-8 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-5">
          <Database class="size-5 text-primary" />
          <p class="mt-2 text-sm font-semibold text-foreground">Datos históricos</p>
          <p class="mt-1 text-xs text-muted-foreground">Fichas de alumnos, observaciones, retiros — nada se pierde.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5">
          <Zap class="size-5 text-primary" />
          <p class="mt-2 text-sm font-semibold text-foreground">2 semanas</p>
          <p class="mt-1 text-xs text-muted-foreground">Tiempo promedio de migración completa con datos verificados.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5">
          <Building class="size-5 text-primary" />
          <p class="mt-2 text-sm font-semibold text-foreground">Sin interrupciones</p>
          <p class="mt-1 text-xs text-muted-foreground">El colegio sigue operando normal mientras migramos en paralelo.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Tienes dudas sobre la integración?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y revisamos juntos cómo conectar Ethoz con lo que tu colegio ya tiene. Sin compromiso.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Agendar Demo <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/productos">
          Ver todos los productos
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>

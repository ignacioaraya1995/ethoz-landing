<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';
  import {
    Shield,
    Lock,
    FileSpreadsheet,
    Smartphone,
    BookOpen,
    AlertTriangle,
    Bell,
    UserCheck,
    Eye,
    Zap,
    MapPin,
    Calendar,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Clock,
    Check,
    Building,
    Fingerprint,
    ArrowRight,
    SkipBack,
    SkipForward,
    Maximize,
    Minimize,
    ClipboardList,
    Server,
    Gavel,
    Download,
    ChevronLeft,
    Captions
  } from '@lucide/svelte';

  import { pitchSlides as slides, getDaysUntilEnforcement } from '$lib/data/pitch-slides';

  // ── Audio state ──
  let audioEl = $state<HTMLAudioElement | null>(null);
  let currentTime = $state(0);
  let duration = $state(0);
  let playing = $state(false);
  let muted = $state(false);
  let isFullscreen = $state(false);
  let showControls = $state(true);
  let showSubtitles = $state(true);
  let controlsTimeout: ReturnType<typeof setTimeout>;
  let containerEl = $state<HTMLDivElement | null>(null);

  // ── Derived state ──
  let currentSlideIndex = $derived(
    Math.max(0, slides.findIndex(s => currentTime >= s.start && currentTime < s.end))
  );
  let currentSlide = $derived(slides[currentSlideIndex]);
  let progress = $derived(duration ? (currentTime / duration) * 100 : 0);

  // ── Controls ──
  function togglePlay() {
    if (!audioEl) return;
    if (playing) audioEl.pause();
    else audioEl.play();
  }

  function seekTo(time: number) {
    if (!audioEl) return;
    audioEl.currentTime = time;
  }

  function goToSlide(index: number) {
    if (index >= 0 && index < slides.length) {
      seekTo(slides[index].start);
    }
  }

  function prevSlide() { goToSlide(currentSlideIndex - 1); }
  function nextSlide() { goToSlide(currentSlideIndex + 1); }

  function toggleMute() {
    if (!audioEl) return;
    muted = !muted;
    audioEl.muted = muted;
  }

  function toggleFullscreen() {
    if (!containerEl) return;
    if (!document.fullscreenElement) containerEl.requestFullscreen();
    else document.exitFullscreen();
  }

  function handleProgressClick(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    seekTo(pct * duration);
  }

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function resetControlsTimeout() {
    showControls = true;
    clearTimeout(controlsTimeout);
    if (playing) {
      controlsTimeout = setTimeout(() => { showControls = false; }, 3500);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    if (e.code === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    if (e.code === 'KeyM') { toggleMute(); }
    if (e.code === 'KeyF') { toggleFullscreen(); }
  }

  $effect(() => {
    function onFsChange() { isFullscreen = !!document.fullscreenElement; }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  });

  // ── Countdown to Dec 2026 ──
  let countdownDays = $state(getDaysUntilEnforcement());
</script>

<svelte:head>
  <title>Ethoz — Pitch Interactivo</title>
  <meta name="description" content="Presentación interactiva de Ethoz, el escudo digital escolar." />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<!-- Audio element -->
<audio
  bind:this={audioEl}
  src="/audio/pitch.m4a"
  preload="metadata"
  ontimeupdate={() => { if (audioEl) currentTime = audioEl.currentTime; }}
  onloadedmetadata={() => { if (audioEl) { duration = audioEl.duration; } }}
  onplay={() => { playing = true; resetControlsTimeout(); }}
  onpause={() => { playing = false; showControls = true; }}
  onended={() => { playing = false; showControls = true; }}
></audio>

<!-- Main Container -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={containerEl}
  class="pitch-container"
  onmousemove={resetControlsTimeout}
  onclick={resetControlsTimeout}
  onkeydown={resetControlsTimeout}
  role="application"
  aria-label="Presentación interactiva Ethoz"
>
  <!-- Back button -->
  <a
    href="/"
    class="absolute left-4 top-4 z-30 flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-secondary hover:text-foreground"
    aria-label="Volver al inicio"
  >
    <ChevronLeft class="size-5" />
  </a>

  <!-- Slide Area -->
  <div class="slide-area">
    {#key currentSlide.id}
      <div
        class="slide"
        in:fly={{ y: 30, duration: 650, easing: quintOut, delay: 180 }}
        out:fade={{ duration: 250 }}
      >
        <!-- SLIDE: INTRO -->
        {#if currentSlide.id === 'intro'}
          <div class="slide-content slide-intro">
            <div class="intro-logo" in:scale={{ duration: 800, easing: backOut, delay: 300 }}>
              <img src="/logos/ethoz-final-light.svg" alt="Ethoz" class="logo-main" />
            </div>
            <p class="intro-subtitle" in:fly={{ y: 20, duration: 600, delay: 600 }}>
              El Escudo Digital Escolar
            </p>
            <div class="intro-badge" in:scale={{ duration: 500, delay: 800 }}>
              <span class="badge-pill">Cumple con Ley 21.719</span>
            </div>
          </div>

        <!-- SLIDE: PROBLEM -->
        {:else if currentSlide.id === 'problem'}
          <div class="slide-content slide-problem">
            <h2 class="slide-heading">¿Dónde está la información<br/>más sensible?</h2>
            <div class="scattered-grid">
              <div class="scatter-item scatter-1" in:fly={{ x: -60, duration: 600, delay: 300 }}>
                <div class="scatter-icon icon-warning"><FileSpreadsheet size={32} /></div>
                <span>Planillas Excel</span>
              </div>
              <div class="scatter-item scatter-2" in:fly={{ y: -40, duration: 600, delay: 450 }}>
                <div class="scatter-icon icon-warning"><BookOpen size={32} /></div>
                <span>Libretas</span>
              </div>
              <div class="scatter-item scatter-3" in:fly={{ x: 60, duration: 600, delay: 600 }}>
                <div class="scatter-icon icon-warning"><Smartphone size={32} /></div>
                <span>WhatsApp</span>
              </div>
            </div>
            <div class="risk-callout" in:fly={{ y: 20, duration: 600, delay: 800 }}>
              <AlertTriangle size={20} />
              <span>Órdenes de alejamiento que no llegan · Retiros no autorizados</span>
            </div>
          </div>

        <!-- SLIDE: LAW -->
        {:else if currentSlide.id === 'law'}
          <div class="slide-content slide-law">
            <div class="law-icon" in:scale={{ duration: 600, delay: 300 }}>
              <Gavel size={56} strokeWidth={1.5} />
            </div>
            <h2 class="slide-heading">Ley 21.719</h2>
            <p class="law-subtitle">Protección de Datos Personales</p>
            <div class="law-impact" in:fly={{ y: 20, duration: 600, delay: 600 }}>
              <p class="impact-text">Cambia las reglas del juego<br/><strong>para todos los colegios</strong></p>
            </div>
          </div>

        <!-- SLIDE: FINES -->
        {:else if currentSlide.id === 'fines'}
          <div class="slide-content slide-fines">
            <div class="countdown-label" in:fly={{ y: -20, duration: 500, delay: 200 }}>
              <Clock size={20} />
              <span>Cuenta regresiva</span>
            </div>
            <div class="fines-date" in:scale={{ duration: 700, delay: 400, easing: backOut }}>
              <span class="date-big">Diciembre 2026</span>
              <span class="date-days">{countdownDays} días restantes</span>
            </div>
            <div class="fines-amount" in:fly={{ y: 30, duration: 700, delay: 700 }}>
              <div class="fine-number">20.000 <span class="fine-unit">UTM</span></div>
              <div class="fine-equiv">
                <span class="fine-arrow">= </span>
                <span class="fine-clp">$1.200 millones CLP</span>
              </div>
            </div>
            <p class="fines-label" in:fade={{ duration: 500, delay: 1000 }}>Multa máxima por infracciones gravísimas</p>
          </div>

        <!-- SLIDE: CLASSIFICATION -->
        {:else if currentSlide.id === 'classification'}
          <div class="slide-content slide-classification">
            <h2 class="slide-heading">Clasificación de Faltas</h2>
            <div class="severity-scale">
              <div class="severity-item severity-leve" in:fly={{ x: -40, duration: 500, delay: 300 }}>
                <div class="severity-dot"></div>
                <span class="severity-label">Leve</span>
                <span class="severity-range">1 – 100 UTM</span>
              </div>
              <div class="severity-item severity-grave" in:fly={{ x: -40, duration: 500, delay: 500 }}>
                <div class="severity-dot"></div>
                <span class="severity-label">Grave</span>
                <span class="severity-range">101 – 5.000 UTM</span>
              </div>
              <div class="severity-item severity-gravisima" in:fly={{ x: -40, duration: 500, delay: 700 }}>
                <div class="severity-dot"></div>
                <span class="severity-label">Gravísima</span>
                <span class="severity-range">5.001 – 20.000 UTM</span>
              </div>
            </div>
          </div>

        <!-- SLIDE: SOLUTION -->
        {:else if currentSlide.id === 'solution'}
          <div class="slide-content slide-solution">
            <div class="solution-shield" in:scale={{ duration: 800, easing: backOut, delay: 200 }}>
              <div class="shield-pulse">
                <Shield size={88} strokeWidth={1.2} />
              </div>
            </div>
            <h2 class="solution-title" in:fly={{ y: 20, duration: 600, delay: 500 }}>
              Tu Escudo Digital
            </h2>
            <p class="solution-sub" in:fly={{ y: 20, duration: 600, delay: 700 }}>
              Protege al colegio y cumple la ley
            </p>
          </div>

        <!-- SLIDE: FEATURES A -->
        {:else if currentSlide.id === 'features-a'}
          <div class="slide-content slide-features">
            <div class="features-grid">
              <div class="feature-card" in:fly={{ x: -50, duration: 600, delay: 300 }}>
                <div class="feature-icon icon-primary"><ClipboardList size={36} strokeWidth={1.5} /></div>
                <h3>Ficha 360°</h3>
                <p>Todo centralizado en una ficha integral por alumno. Nada importante se pierde.</p>
              </div>
              <div class="feature-card" in:fly={{ x: 50, duration: 600, delay: 500 }}>
                <div class="feature-icon icon-destructive"><Bell size={36} strokeWidth={1.5} /></div>
                <h3>Alertas Críticas</h3>
                <p>Llegan al instante, solo a las personas que deben saber. Ni más, ni menos.</p>
              </div>
            </div>
          </div>

        <!-- SLIDE: FEATURES B -->
        {:else if currentSlide.id === 'features-b'}
          <div class="slide-content slide-features">
            <div class="features-grid">
              <div class="feature-card" in:fly={{ x: -50, duration: 600, delay: 300 }}>
                <div class="feature-icon icon-success"><UserCheck size={36} strokeWidth={1.5} /></div>
                <h3>Retiro Seguro</h3>
                <p>En portería, validan quién retira a un alumno en segundos. Sin papeles ni llamadas.</p>
              </div>
              <div class="feature-card" in:fly={{ x: 50, duration: 600, delay: 500 }}>
                <div class="feature-icon icon-primary"><Eye size={36} strokeWidth={1.5} /></div>
                <h3>Control por Rol</h3>
                <p>Cada persona ve solo lo que necesita para su rol. Simple y seguro.</p>
              </div>
            </div>
          </div>

        <!-- SLIDE: IMPLEMENTATION -->
        {:else if currentSlide.id === 'implementation'}
          <div class="slide-content slide-implementation">
            <h2 class="slide-heading">Implementación Simple</h2>
            <div class="steps-timeline">
              <div class="step" in:fly={{ y: 30, duration: 500, delay: 300 }}>
                <div class="step-number">1</div>
                <div class="step-icon"><Building size={28} /></div>
                <span class="step-label">Conectamos<br/>el colegio</span>
              </div>
              <div class="step-connector" in:scale={{ duration: 400, delay: 500 }}></div>
              <div class="step" in:fly={{ y: 30, duration: 500, delay: 550 }}>
                <div class="step-number">2</div>
                <div class="step-icon"><Server size={28} /></div>
                <span class="step-label">Migramos<br/>los datos</span>
              </div>
              <div class="step-connector" in:scale={{ duration: 400, delay: 700 }}></div>
              <div class="step" in:fly={{ y: 30, duration: 500, delay: 800 }}>
                <div class="step-number">3</div>
                <div class="step-icon"><Zap size={28} /></div>
                <span class="step-label">Listo para<br/>operar</span>
              </div>
            </div>
            <p class="impl-note" in:fade={{ duration: 500, delay: 1000 }}>
              En semanas, no meses. Sin capacitaciones eternas.
            </p>
          </div>

        <!-- SLIDE: SECURITY -->
        {:else if currentSlide.id === 'security'}
          <div class="slide-content slide-security">
            <div class="security-icons" in:scale={{ duration: 700, delay: 300 }}>
              <div class="sec-icon-wrap">
                <Lock size={44} strokeWidth={1.5} />
              </div>
              <div class="sec-icon-wrap">
                <Fingerprint size={44} strokeWidth={1.5} />
              </div>
            </div>
            <h2 class="slide-heading">Cifrado Nivel Bancario</h2>
            <div class="security-badges">
              <div class="sec-badge" in:fly={{ y: 20, duration: 500, delay: 500 }}>
                <Check size={18} />
                <span>Encriptación AES-256</span>
              </div>
              <div class="sec-badge" in:fly={{ y: 20, duration: 500, delay: 650 }}>
                <MapPin size={18} />
                <span>Datos almacenados en Chile</span>
              </div>
              <div class="sec-badge" in:fly={{ y: 20, duration: 500, delay: 800 }}>
                <Shield size={18} />
                <span>Cumplimiento normativo total</span>
              </div>
            </div>
          </div>

        <!-- SLIDE: URGENCY -->
        {:else if currentSlide.id === 'urgency'}
          <div class="slide-content slide-urgency">
            <div class="urgency-icon" in:scale={{ duration: 600, delay: 200 }}>
              <Calendar size={56} strokeWidth={1.5} />
            </div>
            <h2 class="urgency-title" in:fly={{ y: 20, duration: 600, delay: 400 }}>La ley no espera</h2>
            <p class="urgency-sub" in:fly={{ y: 20, duration: 600, delay: 600 }}>
              Prepararse hoy significa<br/>estar tranquilos mañana
            </p>
            <div class="pilot-badge" in:scale={{ duration: 500, delay: 800 }}>
              <Zap size={16} />
              <span>Programa Piloto 2026 — Cupos Limitados</span>
            </div>
          </div>

        <!-- SLIDE: CTA -->
        {:else if currentSlide.id === 'cta'}
          <div class="slide-content slide-cta">
            <div class="cta-logo" in:scale={{ duration: 800, easing: backOut, delay: 200 }}>
              <img src="/logos/ethoz-final-light.svg" alt="Ethoz" class="logo-cta" />
            </div>
            <h2 class="cta-title" in:fly={{ y: 20, duration: 600, delay: 400 }}>
              Agenda tu Demo
            </h2>
            <p class="cta-sub" in:fly={{ y: 20, duration: 600, delay: 600 }}>
              Sé de los primeros en cumplir
            </p>
            <a
              href="/demo"
              class="cta-button"
              in:scale={{ duration: 500, delay: 800 }}
            >
              Agendar Demo
              <ArrowRight size={20} />
            </a>
            <p class="cta-url" in:fade={{ duration: 500, delay: 1000 }}>ethoz.cl</p>
          </div>
        {/if}
      </div>
    {/key}
  </div>

  <!-- Subtitles — toggleable on mobile -->
  {#if showSubtitles}
    <div class="subtitle-bar">
      {#key currentSlide.id}
        <p class="subtitle-text" in:fade={{ duration: 400, delay: 200 }}>
          {currentSlide.subtitle}
        </p>
      {/key}
    </div>
  {/if}

  <!-- Controls -->
  <div class="controls-bar" class:visible={showControls || !playing}>
    <!-- Progress bar -->
    <div
      class="progress-bar"
      onclick={handleProgressClick}
      onkeydown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(Math.min(currentTime + 5, duration)); } if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(Math.max(currentTime - 5, 0)); } }}
      role="slider"
      tabindex={0}
      aria-label="Progreso del audio"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div class="progress-track">
        <div class="progress-fill" style="width: {progress}%"></div>
        {#each slides as s, i}
          {#if i > 0}
            <div
              class="slide-marker"
              class:active={i <= currentSlideIndex}
              style="left: {duration ? (s.start / duration) * 100 : 0}%"
            ></div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Control buttons -->
    <div class="controls-row">
      <div class="controls-left">
        <span class="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div class="controls-center">
        <button class="ctrl-btn" onclick={prevSlide} aria-label="Slide anterior" disabled={currentSlideIndex === 0}>
          <SkipBack size={20} />
        </button>
        <button class="ctrl-btn ctrl-play" onclick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          {#if playing}
            <Pause size={28} />
          {:else}
            <Play size={28} />
          {/if}
        </button>
        <button class="ctrl-btn" onclick={nextSlide} aria-label="Siguiente slide" disabled={currentSlideIndex === slides.length - 1}>
          <SkipForward size={20} />
        </button>
      </div>

      <div class="controls-right">
        <button class="ctrl-btn" class:ctrl-active={showSubtitles} onclick={() => showSubtitles = !showSubtitles} aria-label={showSubtitles ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}>
          <Captions class="size-[18px]" />
        </button>
        <button class="ctrl-btn" onclick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {#if muted}
            <VolumeX size={18} />
          {:else}
            <Volume2 size={18} />
          {/if}
        </button>
        <a href="/audio/pitch.m4a" download="Ethoz-Pitch.m4a" class="ctrl-btn hidden-mobile" aria-label="Descargar audio">
          <Download size={18} />
        </a>
        <button class="ctrl-btn hidden-mobile" onclick={toggleFullscreen} aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
          {#if isFullscreen}
            <Minimize size={18} />
          {:else}
            <Maximize size={18} />
          {/if}
        </button>
      </div>
    </div>

    <!-- Slide dots -->
    <div class="slide-dots">
      {#each slides as s, i}
        <button
          class="dot"
          class:active={i === currentSlideIndex}
          onclick={() => goToSlide(i)}
          aria-label="Ir a slide {i + 1}"
        ></button>
      {/each}
    </div>
  </div>

  <!-- Start overlay -->
  {#if !playing && currentTime === 0}
    <div class="start-overlay" transition:fade={{ duration: 400 }}>
      <button class="start-button" onclick={togglePlay}>
        <Play size={44} />
        <span>Iniciar Presentación</span>
      </button>
      <p class="start-hint">Espacio para reproducir · Flechas para navegar · F pantalla completa</p>
    </div>
  {/if}
</div>

<style>
  /* ═══════════════════════════════════════════
     PITCH — LIGHT / CLEAN / TRANSPARENT THEME
     ═══════════════════════════════════════════ */

  .pitch-container {
    position: fixed;
    inset: 0;
    background: var(--background);
    color: var(--foreground);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    cursor: default;
    z-index: 9999;
  }

  /* ── Slide Area ── */
  .slide-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-content {
    max-width: 56rem;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  /* ── Common heading ── */
  .slide-heading {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }

  /* ═══ SLIDE: Intro ═══ */
  .slide-intro { gap: 1.25rem; }

  .intro-logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-main {
    height: clamp(3.5rem, 8vw, 5.5rem);
    width: auto;
    filter: drop-shadow(0 2px 12px oklch(0.546 0.213 264 / 0.12));
    animation: float 3s ease-in-out infinite;
  }

  .intro-subtitle {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: var(--muted-foreground);
    font-weight: 400;
    letter-spacing: -0.01em;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    background: oklch(0.546 0.213 264 / 0.08);
    color: var(--primary);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid oklch(0.546 0.213 264 / 0.15);
  }

  /* ═══ SLIDE: Problem ═══ */
  .slide-problem { gap: 2rem; }

  .scattered-grid {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .scatter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    color: var(--muted-foreground);
    font-weight: 500;
  }

  .scatter-icon {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-warning {
    background: oklch(0.75 0.15 85 / 0.1);
    color: oklch(0.6 0.15 85);
    border: 1px solid oklch(0.75 0.15 85 / 0.2);
  }

  .scatter-1 { transform: rotate(-3deg); }
  .scatter-2 { transform: rotate(2deg) translateY(-8px); }
  .scatter-3 { transform: rotate(-1deg); }

  .risk-callout {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.5rem;
    border-radius: 0.75rem;
    background: oklch(0.55 0.22 25 / 0.06);
    color: oklch(0.45 0.18 25);
    font-size: 0.9rem;
    border: 1px solid oklch(0.55 0.22 25 / 0.12);
  }

  /* ═══ SLIDE: Law ═══ */
  .slide-law { gap: 1.25rem; }

  .law-icon {
    color: var(--primary);
    filter: drop-shadow(0 0 16px oklch(0.546 0.213 264 / 0.2));
  }

  .law-subtitle {
    font-size: 1.125rem;
    color: var(--muted-foreground);
    font-weight: 400;
  }

  .law-impact {
    margin-top: 0.5rem;
    padding: 1.25rem 2rem;
    border-radius: 0.75rem;
    background: oklch(0.546 0.213 264 / 0.05);
    border: 1px solid oklch(0.546 0.213 264 / 0.1);
  }

  .impact-text {
    font-size: 1.25rem;
    color: var(--foreground);
    line-height: 1.5;
  }

  /* ═══ SLIDE: Fines ═══ */
  .slide-fines { gap: 1.5rem; }

  .countdown-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: oklch(0.6 0.15 85);
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .fines-date {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .date-big {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }

  .date-days {
    font-size: 1rem;
    color: oklch(0.6 0.15 85);
    font-variant-numeric: tabular-nums;
  }

  .fines-amount {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .fine-number {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: oklch(0.45 0.2 25);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .fine-unit {
    font-size: 0.6em;
    font-weight: 500;
    color: oklch(0.5 0.15 25);
  }

  .fine-equiv {
    font-size: 1.25rem;
    color: var(--muted-foreground);
  }

  .fine-clp {
    font-weight: 600;
    color: oklch(0.45 0.2 25);
  }

  .fines-label {
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }

  /* ═══ SLIDE: Classification ═══ */
  .slide-classification { gap: 2rem; }

  .severity-scale {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 28rem;
  }

  .severity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    background: var(--secondary);
    border: 1px solid var(--border);
  }

  .severity-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .severity-leve .severity-dot { background: oklch(0.7 0.15 85); box-shadow: 0 0 8px oklch(0.7 0.15 85 / 0.35); }
  .severity-grave .severity-dot { background: oklch(0.6 0.18 55); box-shadow: 0 0 8px oklch(0.6 0.18 55 / 0.35); }
  .severity-gravisima .severity-dot { background: oklch(0.5 0.2 25); box-shadow: 0 0 8px oklch(0.5 0.2 25 / 0.35); }

  .severity-label {
    font-weight: 600;
    font-size: 1.125rem;
    flex: 1;
    text-align: left;
  }

  .severity-leve .severity-label { color: oklch(0.5 0.12 85); }
  .severity-grave .severity-label { color: oklch(0.45 0.15 55); }
  .severity-gravisima .severity-label { color: oklch(0.4 0.18 25); }

  .severity-range {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    font-variant-numeric: tabular-nums;
  }

  /* ═══ SLIDE: Solution ═══ */
  .slide-solution { gap: 1.25rem; }

  .solution-shield {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shield-pulse {
    color: var(--primary);
    filter: drop-shadow(0 0 30px oklch(0.546 0.213 264 / 0.3));
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .solution-title {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--primary);
  }

  .solution-sub {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: var(--muted-foreground);
  }

  /* ═══ SLIDE: Features ═══ */
  .slide-features { gap: 1.5rem; }

  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
    max-width: 44rem;
  }

  @media (max-width: 640px) {
    .features-grid { grid-template-columns: 1fr; }
  }

  .feature-card {
    padding: 2rem;
    border-radius: 1rem;
    background: var(--background);
    border: 1px solid var(--border);
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.04);
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.08);
  }

  .feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .feature-card p {
    font-size: 0.925rem;
    color: var(--muted-foreground);
    line-height: 1.5;
  }

  .feature-icon {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-primary {
    background: oklch(0.546 0.213 264 / 0.08);
    color: var(--primary);
    border: 1px solid oklch(0.546 0.213 264 / 0.12);
  }

  .icon-destructive {
    background: oklch(0.55 0.22 25 / 0.08);
    color: oklch(0.5 0.2 25);
    border: 1px solid oklch(0.55 0.22 25 / 0.12);
  }

  .icon-success {
    background: oklch(0.62 0.19 145 / 0.08);
    color: oklch(0.5 0.17 145);
    border: 1px solid oklch(0.62 0.19 145 / 0.12);
  }

  /* ═══ SLIDE: Implementation ═══ */
  .slide-implementation { gap: 2rem; }

  .steps-timeline {
    display: flex;
    align-items: center;
    gap: 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    padding: 1.5rem;
  }

  .step-number {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: oklch(0.546 0.213 264 / 0.4);
    font-variant-numeric: tabular-nums;
  }

  .step-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.546 0.213 264 / 0.06);
    color: var(--primary);
    border: 1px solid oklch(0.546 0.213 264 / 0.12);
  }

  .step-label {
    font-size: 0.9rem;
    color: var(--muted-foreground);
    line-height: 1.4;
    text-align: center;
  }

  .step-connector {
    width: 3rem;
    height: 2px;
    background: linear-gradient(90deg, oklch(0.546 0.213 264 / 0.2), oklch(0.546 0.213 264 / 0.05));
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .step-connector { width: 2rem; }
  }

  .impl-note {
    font-size: 1rem;
    color: oklch(0.5 0.17 145);
    font-weight: 500;
  }

  /* ═══ SLIDE: Security ═══ */
  .slide-security { gap: 1.5rem; }

  .security-icons {
    display: flex;
    gap: 1.5rem;
    color: var(--primary);
    filter: drop-shadow(0 0 16px oklch(0.546 0.213 264 / 0.15));
  }

  .sec-icon-wrap {
    width: 5rem;
    height: 5rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: oklch(0.546 0.213 264 / 0.06);
    border: 1px solid oklch(0.546 0.213 264 / 0.1);
  }

  .security-badges {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .sec-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    color: var(--foreground);
  }

  .sec-badge :global(svg) {
    color: oklch(0.5 0.17 145);
    flex-shrink: 0;
  }

  /* ═══ SLIDE: Urgency ═══ */
  .slide-urgency { gap: 1.25rem; }

  .urgency-icon {
    color: oklch(0.6 0.15 85);
    filter: drop-shadow(0 0 16px oklch(0.7 0.15 85 / 0.2));
  }

  .urgency-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }

  .urgency-sub {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: var(--muted-foreground);
    line-height: 1.5;
  }

  .pilot-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    border-radius: 9999px;
    background: oklch(0.75 0.15 85 / 0.08);
    color: oklch(0.5 0.12 85);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid oklch(0.75 0.15 85 / 0.15);
    animation: pulse-subtle 2s ease-in-out infinite;
  }

  /* ═══ SLIDE: CTA ═══ */
  .slide-cta { gap: 1.5rem; }

  .cta-logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-cta {
    height: clamp(2.5rem, 5vw, 4rem);
    width: auto;
    filter: drop-shadow(0 2px 12px oklch(0.546 0.213 264 / 0.12));
  }

  .cta-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }

  .cta-sub {
    font-size: 1.25rem;
    color: var(--muted-foreground);
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2.5rem;
    border-radius: 9999px;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 4px 20px oklch(0.546 0.213 264 / 0.2);
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px oklch(0.546 0.213 264 / 0.3);
  }

  .cta-button:active {
    transform: scale(0.98);
  }

  .cta-url {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    letter-spacing: 0.05em;
  }

  /* ═══ SUBTITLE BAR — always visible ═══ */
  .subtitle-bar {
    position: absolute;
    bottom: 9.5rem;
    left: 50%;
    transform: translateX(-50%);
    max-width: 48rem;
    width: calc(100% - 4rem);
    text-align: center;
    pointer-events: none;
    z-index: 10;
  }

  .subtitle-text {
    font-size: clamp(0.875rem, 1.5vw, 1.05rem);
    color: var(--foreground);
    line-height: 1.6;
    padding: 0.75rem 1.5rem;
    background: oklch(1 0 0 / 0.85);
    backdrop-filter: blur(16px);
    border-radius: 0.75rem;
    border: 1px solid var(--border);
    box-shadow: 0 2px 12px oklch(0 0 0 / 0.06);
  }

  /* ═══ CONTROLS BAR ═══ */
  .controls-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem 1.5rem 1rem;
    background: linear-gradient(to top, oklch(1 0 0 / 0.95) 0%, oklch(1 0 0 / 0) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 20;
  }

  .controls-bar.visible {
    opacity: 1;
  }

  /* Progress bar */
  .progress-bar {
    width: 100%;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  .progress-track {
    height: 3px;
    background: oklch(0.9 0 0);
    border-radius: 2px;
    position: relative;
    transition: height 0.15s ease;
  }

  .progress-bar:hover .progress-track {
    height: 5px;
  }

  .progress-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 2px;
    position: relative;
    transition: width 0.1s linear;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary);
    transition: transform 0.15s ease;
  }

  .progress-bar:hover .progress-fill::after {
    transform: translateY(-50%) scale(1);
  }

  .slide-marker {
    position: absolute;
    top: -1px;
    width: 2px;
    height: calc(100% + 2px);
    background: oklch(0.85 0 0);
    transition: background 0.3s ease;
  }

  .slide-marker.active {
    background: oklch(0.546 0.213 264 / 0.3);
  }

  /* Controls row */
  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
    gap: 1rem;
  }

  .controls-left,
  .controls-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 8rem;
  }

  .controls-right {
    justify-content: flex-end;
  }

  .controls-center {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .time-display {
    font-size: 0.8rem;
    color: var(--muted-foreground);
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    text-decoration: none;
  }

  .ctrl-btn:hover {
    color: var(--foreground);
    background: oklch(0.95 0 0);
  }

  .ctrl-btn:disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  .ctrl-play {
    width: 3rem;
    height: 3rem;
    background: var(--primary);
    color: var(--primary-foreground);
  }

  .ctrl-play:hover {
    background: oklch(0.48 0.21 264);
    color: var(--primary-foreground);
    transform: scale(1.05);
  }

  /* Slide dots */
  .slide-dots {
    display: flex;
    justify-content: center;
    gap: 0.375rem;
    padding-top: 0.5rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    border: none;
    background: oklch(0.85 0 0);
    cursor: pointer;
    padding: 10px;
    box-sizing: content-box;
    background-clip: content-box;
    transition: all 0.3s ease;
  }

  .dot.active {
    width: 1.5rem;
    background: var(--primary);
    background-clip: content-box;
  }

  .dot:hover:not(.active) {
    background: oklch(0.7 0 0);
  }

  /* ═══ START OVERLAY ═══ */
  .start-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background: oklch(1 0 0 / 0.9);
    backdrop-filter: blur(20px);
    z-index: 30;
  }

  .start-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2.5rem 3rem;
    border-radius: 1.5rem;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.125rem;
    font-weight: 500;
    font-family: inherit;
    box-shadow: 0 4px 24px oklch(0 0 0 / 0.06);
  }

  .start-button :global(svg) {
    color: var(--primary);
    filter: drop-shadow(0 0 16px oklch(0.546 0.213 264 / 0.3));
  }

  .start-button:hover {
    border-color: oklch(0.546 0.213 264 / 0.2);
    box-shadow: 0 8px 32px oklch(0 0 0 / 0.1);
    transform: scale(1.02);
  }

  .start-hint {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  /* ═══ ANIMATIONS ═══ */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes pulse-glow {
    0%, 100% { filter: drop-shadow(0 0 24px oklch(0.546 0.213 264 / 0.2)); }
    50% { filter: drop-shadow(0 0 40px oklch(0.546 0.213 264 / 0.35)); }
  }

  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* ── Subtitle toggle active state ── */
  .ctrl-active {
    color: var(--primary) !important;
    background: oklch(0.546 0.213 264 / 0.1);
  }

  .hidden-mobile { display: inline-flex; }

  /* ═══ RESPONSIVE ═══ */
  @media (max-width: 640px) {
    .slide-area { padding-bottom: 3.5rem; align-items: flex-start; padding-top: 1rem; }
    .slide-content { padding: 0.75rem 1rem; gap: 0.5rem; }
    .subtitle-bar { bottom: 5.5rem; width: calc(100% - 1.5rem); }
    .subtitle-text { font-size: 0.75rem; padding: 0.4rem 0.75rem; line-height: 1.4; }
    .controls-bar { padding: 0.5rem 0.75rem 0.75rem; }
    .scattered-grid { gap: 1.25rem; }
    .scatter-icon { width: 3.5rem; height: 3.5rem; }
    .risk-callout { font-size: 0.8rem; flex-wrap: wrap; justify-content: center; text-align: center; }
    .controls-left, .controls-right { min-width: auto; }
    .time-display { font-size: 0.7rem; }
    .hidden-mobile { display: none; }
  }

  /* ═══ REDUCED MOTION ═══ */
  @media (prefers-reduced-motion: reduce) {
    .shield-pulse, .pilot-badge { animation: none; }
    .feature-card:hover { transform: none; }
    .cta-button:hover { transform: none; }
  }
</style>
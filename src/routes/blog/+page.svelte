<script lang="ts">
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { Clock, Calendar } from '@lucide/svelte';
  import { allPosts } from '$lib/data/posts';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
</script>

<svelte:head>
  <title>Blog — Ethoz</title>
  <meta name="description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta property="og:url" content="https://ethoz.cl/blog" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Blog — Ethoz" />
  <meta property="og:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Blog — Ethoz" />
  <meta name="twitter:description" content="Artículos sobre protección de datos, seguridad escolar y cumplimiento normativo para colegios en Chile." />
  <link rel="canonical" href="https://ethoz.cl/blog" />
</svelte:head>

<main class="min-h-dvh bg-background">
  <NavBar />

  <div class="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">
    <!-- Header -->
    <div class="mb-10 sm:mb-14">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t('blog.title')}</h1>
      <p class="mt-3 text-lg text-muted-foreground">
        {t('blog.subtitle')}
      </p>
    </div>

    <!-- Posts grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each allPosts as post}
        <a
          href="/blog/{post.slug}"
          class="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20"
        >
          <!-- Cover image -->
          {#if post.coverImage}
            <div class="aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={post.coverImage}
                alt=""
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          {/if}

          <div class="flex flex-1 flex-col p-5">
            <div class="mb-2.5 flex flex-wrap gap-1.5">
              {#each post.tags.slice(0, 2) as tag}
                <Badge variant="secondary" class="text-[10px]">{tag}</Badge>
              {/each}
            </div>

            <h2 class="text-[0.95rem] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            <p class="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {post.description}
            </p>

            <div class="mt-4 flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <Calendar class="size-3" />
                {new Date(post.date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' })}
              </span>
              <span class="flex items-center gap-1">
                <Clock class="size-3" />
                {post.readTime}
              </span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
  <Footer />
</main>

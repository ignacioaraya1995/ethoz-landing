<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { Clock, Calendar, ArrowRight } from '@lucide/svelte';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  let { data }: { data: PageData } = $props();
  const post = $derived(data.post);

  onMount(() => {
    trackEvent('blog_post_viewed', { slug: post.slug, title: post.title });
  });
</script>

<svelte:head>
  <title>{post.title} — Ethoz Blog</title>
  <meta name="description" content={post.description} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/blog/{post.slug}" />
  <meta property="article:published_time" content={post.date} />
  <meta property="article:author" content={post.author} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.description} />
  <link rel="canonical" href="https://ethoz.cl/blog/{post.slug}" />
  {#if post.coverImage}
    <meta property="og:image" content="https://ethoz.cl{post.coverImage}" />
  {/if}
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.date,
      "author": { "@type": "Person", "name": post.author },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "image": post.coverImage ? `https://ethoz.cl${post.coverImage}` : undefined,
      "url": `https://ethoz.cl/blog/${post.slug}`,
      "mainEntityOfPage": `https://ethoz.cl/blog/${post.slug}`
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ethoz.cl/blog" },
        { "@type": "ListItem", "position": 3, "name": post.title }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Article -->
  <article class="mx-auto flex-1 max-w-3xl px-4 pt-28 pb-12 sm:pt-32 sm:pb-16">
    <!-- Header -->
    <header class="mb-10">
      <div class="mb-5 flex flex-wrap gap-2">
        {#each post.tags as tag}
          <Badge variant="secondary" class="text-xs">{tag}</Badge>
        {/each}
      </div>

      <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {post.title}
      </h1>

      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        {post.description}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span class="font-medium text-foreground">{post.author}</span>
        <span class="flex items-center gap-1.5">
          <Calendar class="size-3.5" />
          {new Date(post.date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span class="flex items-center gap-1.5">
          <Clock class="size-3.5" />
          {post.readTime}
        </span>
      </div>

      <!-- Hero image -->
      {#if post.coverImage}
        <div class="mt-8 flex justify-center">
          <div class="w-full max-w-sm overflow-hidden rounded-xl">
            <img
              src={post.coverImage}
              alt={post.title}
              class="h-auto w-full object-cover"
            />
          </div>
        </div>
      {/if}
    </header>

    <!-- Content -->
    <div class="prose prose-lg max-w-none">
      {@html post.content}
    </div>

    <!-- CTA -->
    <div class="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
      <h3 class="text-xl font-bold text-foreground">
        {t('cta.title')}
      </h3>
      <p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {t('cta.subtitle')}
      </p>
      <Button size="xl" href="/demo" class="mt-6">
        {t('cta.primary')}
        <ArrowRight class="size-4" />
      </Button>
    </div>
  </article>
  <Footer />
</main>

<style>
  :global(.prose h2) {
    clear: both;
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: oklch(var(--foreground));
    letter-spacing: -0.025em;
  }

  :global(.prose h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    color: oklch(var(--foreground));
  }

  :global(.prose p) {
    margin-bottom: 1.25rem;
    line-height: 1.75;
    color: oklch(var(--muted-foreground));
  }

  :global(.prose strong) {
    color: oklch(var(--foreground));
    font-weight: 600;
  }

  :global(.prose ul),
  :global(.prose ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
  }

  :global(.prose li) {
    margin-bottom: 0.5rem;
    line-height: 1.75;
    color: oklch(var(--muted-foreground));
  }

  :global(.prose blockquote) {
    border-left: 3px solid oklch(var(--primary));
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: oklch(var(--muted-foreground));
  }

  :global(.prose table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.875rem;
  }

  :global(.prose th),
  :global(.prose td) {
    border: 1px solid oklch(var(--border));
    padding: 0.625rem 0.75rem;
    text-align: left;
  }

  :global(.prose th) {
    background: oklch(var(--muted));
    font-weight: 600;
    color: oklch(var(--foreground));
  }

  :global(.prose td) {
    color: oklch(var(--muted-foreground));
  }

  :global(.prose figure) {
    margin: 1.5rem 0;
  }

  @media (min-width: 640px) {
    :global(.prose figure) {
      float: right;
      margin: 0.5rem 0 1rem 1.5rem;
      max-width: 280px;
    }
  }

  :global(.prose figure::after) {
    content: '';
    display: table;
    clear: both;
  }

  :global(.prose img) {
    border-radius: 0.75rem;
    width: 100%;
    height: auto;
  }

  :global(.prose figcaption) {
    text-align: center;
    font-size: 0.75rem;
    color: oklch(var(--muted-foreground));
    margin-top: 0.375rem;
    font-style: italic;
  }

  :global(.prose a) {
    color: oklch(var(--primary));
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: opacity 0.2s;
  }

  :global(.prose a:hover) {
    opacity: 0.8;
  }

  :global(.prose hr) {
    border-color: oklch(var(--border));
    margin: 2.5rem 0;
  }
</style>

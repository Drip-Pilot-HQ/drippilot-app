You want it in **Markdown**, not that chaotic wall of text. Sensible request for once. Here you go. Copy it into something like `SEO_AUDIT.md` and spare future developers the archaeological dig.

# Full SEO, Accessibility & Performance Audit — Drip Pilot Frontend

## 1. SEO Issues

### 1.1 Missing / Incomplete Metadata (Critical)

**File:** `app/layout.tsx`

**Issues**

- Root title `"Drip Pilot - Data-Driven Premium Landing V3"` appears to be a development placeholder.
- Missing **Open Graph** meta tags.
- Missing **Twitter Card** metadata.
- Missing `metadataBase` (required for absolute OG URLs).
- No canonical URL.
- No robots directive.
- Favicon exists but is not wired in metadata.

**Why it matters**

- Social previews will appear blank.
- Duplicate content risk without canonical.
- Next.js may warn and break OG image URLs.

**Corrected Code**

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://drippilot.com"),
  title: {
    default: "Drip Pilot — AI-Powered Sales Automation",
    template: "%s | Drip Pilot",
  },
  description:
    "Automate your outreach, engage leads instantly, and close deals faster with Drip Pilot — the AI-powered drip campaign platform for high-growth sales teams.",
  keywords: [
    "drip campaigns",
    "sales automation",
    "AI outreach",
    "email automation",
    "CRM integration"
  ],
  robots: { index: true, follow: true },
  icons: { icon: "/assets/favicon.ico" },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drippilot.com",
    siteName: "Drip Pilot",
    title: "Drip Pilot — AI-Powered Sales Automation",
    description:
      "Automate your outreach, engage leads instantly, and close deals faster with Drip Pilot.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drip Pilot — AI-Powered Sales Automation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Drip Pilot — AI-Powered Sales Automation",
    description: "Automate your outreach and close more deals with AI.",
    images: ["/assets/og-image.png"],
  },
};
````



### 1.2 Page-Level Metadata Missing OG/Twitter

**Files**

* `app/pricing/page.tsx`
* `app/about/page.tsx`

Extend page metadata:

```ts
export const metadata: Metadata = {
  title: "Pricing",
  description: "Flexible, predictable pricing for teams of all sizes...",
  openGraph: {
    title: "Pricing | Drip Pilot",
    description: "Flexible, predictable pricing for teams of all sizes...",
    url: "https://drippilot.com/pricing",
  },
};
```



### 1.3 No Structured Data (Schema.org)

Structured data enables rich search results.

#### Organization Schema

```ts
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Drip Pilot",
  url: "https://drippilot.com",
  logo: "https://drippilot.com/assets/logo.png",
  sameAs: [
    "https://twitter.com/drippilot",
    "https://linkedin.com/company/drippilot"
  ],
};
```

Injected in layout:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
/>
```

#### Pricing Schema

```ts
const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Drip Pilot",
  applicationCategory: "BusinessApplication",
  offers: [
    { "@type": "Offer", name: "Starter", price: "49", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "USD" },
  ],
};
```



### 1.4 Logo Alt Text

**Files**

* `Header.tsx`
* `Footer.tsx`

```tsx
<Image src="/assets/logo.png" alt="Drip Pilot" width={100} height={100} />
```



### 1.5 User Avatar Alt Text

**File:** `CTA.tsx`

```tsx
alt=""
```

Decorative image.



### 1.6 Missing 404 Metadata

**File:** `app/not-found.tsx`

```ts
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};
```



### 1.7 Placeholder `href="#"` Links

Example fix:

```tsx
<Link
  href="#"
  aria-disabled="true"
  tabIndex={-1}
  className="pointer-events-none opacity-50"
>
  Log in
</Link>
```



# 2. Heading Structure Issues

### 2.1 Metrics Using `<h3>` Incorrectly

**File:** `Metrics.tsx`

```tsx
<p
  className="text-3xl font-bold text-slate-900"
  aria-label="761,264 messages sent"
>
  761,264+
</p>
```



### 2.2 H2 → H4 Skipping

**Files**

* `CampaignBuilder.tsx`
* `RealTimePush.tsx`
* `CampaignRouting.tsx`

```tsx
<p className="font-bold text-slate-900 leading-tight" aria-hidden="true">
  Sequence Designer
</p>
```



### 2.3 Footer Heading Level

```tsx
<h3 className="font-bold text-slate-900 mb-4">
  {category.category}
</h3>
```



### 2.4 404 Heading Fix

```tsx
<p aria-hidden="true">404</p>

<h1>Oops! You've drifted off-course.</h1>
```



### 2.5 Pricing Section Missing Heading

```tsx
<h2 className="sr-only">Pricing Plans</h2>
```



### 2.6 Duplicate `id="features"`

Remove duplicate from mobile section.



# 3. Accessibility Issues

### 3.1 Mobile Menu ARIA Dialog

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
>
```

Menu toggle:

```tsx
<button
  aria-expanded={isOpen}
  aria-controls="mobile-nav"
>
```



### 3.2 Billing Toggle Accessibility

```tsx
<div role="group" aria-label="Billing cycle">
```

```tsx
<button aria-pressed={billingCycle === "monthly"}>
```



### 3.3 Feature Table Accessibility

Add caption:

```tsx
<caption className="sr-only">
Feature comparison across Starter, Pro, Teams, and Enterprise plans
</caption>
```

Icons:

```tsx
<span aria-label="Included">
  <Check aria-hidden="true" />
</span>
```

```tsx
<span aria-label="Not included">
  <Minus aria-hidden="true" />
</span>
```



### 3.4 Table Header Scope

```tsx
<th scope="col">Service Type</th>
```



### 3.5 Hero Play Button Accessibility

```tsx
<button
  type="button"
  aria-label="Play product demo video"
>
  <PlayCircle aria-hidden="true" />
</button>
```



### 3.6 Decorative Mockups

```tsx
<div aria-hidden="true">
```



### 3.7 Metrics Chart Label

```tsx
<div
  role="img"
  aria-label="Bar chart showing campaign performance trend"
>
```



### 3.8 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse,
  .animate-bounce,
  .animate-spin {
    animation: none;
  }
}
```



### 3.9 Low Color Contrast

Avoid:

```
text-slate-400
```

Prefer:

```
text-slate-500
text-slate-600
```



### 3.10 Focus Rings

Ensure:

```
focus-visible:ring
```

on all interactive elements.



# 4. Performance Issues

### 4.1 External Texture Images

Replace:

```
https://www.transparenttextures.com/patterns/cubes.png
```

With:

```
/public/assets/cubes-pattern.png
```



### 4.2 External Avatar Images

Replace:

```
https://i.pravatar.cc
```

With local assets.



### 4.3 Font Loading

```ts
const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
```



### 4.4 Hero Video Lazy Loading

If video added later:

```
loading="lazy"
preload="none"
```



### 4.5 Large DOM in Features

Avoid rendering mobile and desktop components simultaneously.

Use media query conditional rendering.



### 4.6 Logo Image Optimization

Header:

```tsx
<Image
  src="/assets/logo.png"
  alt="Drip Pilot"
  width={140}
  height={40}
  priority
/>
```

Footer:

```tsx
<Image
  src="/assets/logo.png"
  alt="Drip Pilot"
  width={140}
  height={40}
  loading="lazy"
/>
```



# 5. Semantic HTML Best Practices

### 5.1 Root Wrapper

Outer `<div>` is optional if `header`, `main`, and `footer` already exist.



### 5.2 AnnouncementBar Inside Header

```tsx
<header role="banner">
  <AnnouncementBar />
</header>
```



### 5.3 Decorative Icons

```tsx
<industry.icon aria-hidden="true" />
```



### 5.4 Step Numbers Decorative

```tsx
<span aria-hidden="true">STEP 1</span>
```



### 5.5 Table Category Headers

```tsx
<th scope="colgroup">
```



# Priority Summary

| Priority    | Issue                          | Files                 |
| -- |  |  |
| 🔴 Critical | Add OG/Twitter metadata        | layout.tsx            |
| 🔴 Critical | Self-host external textures    | Features.tsx          |
| 🔴 Critical | Fix duplicate id="features"    | Features.tsx          |
| 🔴 Critical | 404 heading fix + noindex      | not-found.tsx         |
| 🟠 High     | Mobile menu ARIA dialog        | MobileMenu.tsx        |
| 🟠 High     | Accessible tables              | FeatureComparison.tsx |
| 🟠 High     | Billing toggle semantics       | PricingCards.tsx      |
| 🟠 High     | Correct logo alt text          | Header.tsx            |
| 🟠 High     | Pricing section heading        | PricingCards.tsx      |
| 🟠 High     | Footer heading hierarchy       | Footer.tsx            |
| 🟡 Medium   | Metrics heading fix            | Metrics.tsx           |
| 🟡 Medium   | Mockup headings removal        | CampaignBuilder.tsx   |
| 🟡 Medium   | prefers-reduced-motion         | globals.css           |
| 🟡 Medium   | Hero play button accessibility | Hero.tsx              |
| 🟡 Medium   | Replace external avatars       | CTA.tsx               |
| 🟢 Low      | Structured data                | layout.tsx            |
| 🟢 Low      | Improve color contrast         | Global                |
| 🟢 Low      | Fix placeholder links          | Header/Footer         |
| 🟢 Low      | Focus rings for keyboard users | Button.tsx            |

# Landing Page Expert Skill

## Purpose

Optimize business websites and marketing pages for Open Projects Hub.

## When to Use

Use this skill when:

- Creating or redesigning the home page
- Creating marketing or landing pages
- Reviewing conversion paths (CTAs, sign-up flows)
- Designing feature presentation sections
- Reviewing public-facing pages

## Review Checklist

### 1. Hero Section

- [ ] Clear headline: communicates the value proposition in ≤8 words
- [ ] Subheadline: expands on headline (≤20 words)
- [ ] Primary CTA visible above the fold (no scrolling needed on desktop)
- [ ] CTA is an Ant Design `Button type="primary"` with clear action text ("Get started", "Try free")
- [ ] Secondary CTA present ("Learn more", "See features") as Ant Design `Button`
- [ ] No competing CTAs in the hero (one primary action only)
- [ ] Background doesn't distract from headline readability (sufficient contrast)

### 2. Value Proposition

- [ ] Unique selling proposition is clear within first 5 seconds
- [ ] Problem-solution framing: identifies user pain point, presents solution
- [ ] Benefits over features: focused on what user gains, not technical specs
- [ ] Social proof cue near hero (logos, testimonials, user count) if available

### 3. CTA Placement & Design

- [ ] Primary CTA visible above the fold
- [ ] CTA repeated at logical decision points (after features, pricing, testimonials)
- [ ] CTA uses action-oriented text (verb + benefit: "Start your free trial")
- [ ] CTA button has adequate whitespace around it
- [ ] CTA color (#0057c2 primary) stands out on the page background
- [ ] CTA is full-width on mobile
- [ ] Maximum 3 CTAs visible at any time (avoid choice paralysis)
- [ ] No dead-end CTAs (every CTA goes to a functional page)

### 4. Social Proof

- [ ] Logo bar of trusted companies/clients if available
- [ ] Testimonials with real names, roles, and company logos
- [ ] Usage statistics if available ("10,000+ projects managed")
- [ ] Social proof is authentic and specific (not generic "great product")
- [ ] Social proof near decision points (CTA, pricing)

### 5. Testimonials Section

- [ ] Realistic quotes that address common objections
- [ ] Attribution: name, title, company, photo
- [ ] Responsive card layout (1 col mobile, 2 tablet, 3 desktop)
- [ ] Star ratings or metrics if available
- [ ] Not hidden at page bottom — visible above the fold on scroll

### 6. Features Section

- [ ] Features organized by benefit, not by technical capability
- [ ] Each feature has: icon/illustration, title (3-5 words), description (1-2 sentences)
- [ ] Responsive grid using Ant Design `Row`/`Col` with breakpoints
- [ ] Features tiered: most compelling first
- [ ] Screenshots/product imagery for complex features

### 7. Pricing Section (if applicable)

- [ ] Clear plan comparison (cards or table)
- [ ] Feature comparison rows with ✓/✗
- [ ] Monthly vs annual pricing clearly labeled
- [ ] CTA per pricing card
- [ ] "Most popular" or "Recommended" badge on highlight plan
- [ ] FAQ near pricing section
- [ ] No hidden fees language
- [ ] Pricing cards use Ant Design `Card` with `variant="outlined"`

### 8. FAQ Section

- [ ] Collapsible accordion pattern (Ant Design `Collapse`)
- [ ] Questions address real user concerns (not marketing fluff)
- [ ] Answers are concise (max 3 sentences)
- [ ] First question/answer opens by default
- [ ] FAQ ends with CTA or link to support

### 9. Footer

- [ ] Contains: company info, navigation links, social links, copyright
- [ ] Legal pages linked (privacy, terms, cookies)
- [ ] Contact information or contact form link
- [ ] Logo + tagline present
- [ ] Consistent with Ant Design Footer or custom layout
- [ ] Responsive: stacks vertically on mobile

### 10. Conversion Optimization

- [ ] Page load time < 3 seconds
- [ ] Friction points identified (form fields, steps to conversion)
- [ ] Trust signals near conversion point (security badges, guarantees, "no credit card")
- [ ] Mobile conversion path is as easy as desktop
- [ ] A/B testing opportunities identified
- [ ] Analytics-ready: CTA events trackable (data attributes for click tracking)

## Landing Page UX Principles

| Principle                    | Application                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| **Above the fold clarity**   | User must understand what you offer in ≤5 seconds              |
| **F-shaped reading pattern** | Important info top-left; CTAs in natural scan line             |
| **One message per section**  | Don't overload sections with multiple benefits                 |
| **Progressive disclosure**   | Show headline → benefits → proof → CTA                         |
| **Social proof proximity**   | Place testimonials near CTAs and pricing                       |
| **Reduce cognitive load**    | ≤3 CTAs visible, ≤7 menu items, ≤4 pricing tiers               |
| **Mobile-first content**     | Mobile layout constraints force sharper content prioritization |

## Ant Design Components for Landing Pages

| Section       | Recommended Ant Design Component                 |
| ------------- | ------------------------------------------------ |
| Hero layout   | Custom layout with Typography + Button           |
| Features grid | `Row`/`Col` with `Card`                          |
| Testimonials  | `Card` with `Avatar` + `Typography.Text`         |
| Pricing       | `Card` with `Tag` ("Popular")                    |
| FAQ           | `Collapse`                                       |
| Logos bar     | `Row` with centered `Col` images                 |
| CTA section   | `Card` with `Button` type="primary"              |
| Footer        | Custom layout with `Space` and `Typography.Link` |

## Output Format

```markdown
## Landing Page Expert Review

**Conversion Score: X/10**

**Overall UX Score: X/10**

### Critical

1. **Issue** — Why it hurts conversion — Recommendation

### High

1. **Issue** — Why it hurts conversion — Recommendation

### Medium

1. **Issue** — Recommendation

### Conversion Recommendations

1. Move CTA above the fold — Current position requires scroll
2. Add social proof near pricing section
3. Reduce hero headline to 8 words

### Marketing Recommendations

1. Add customer logos below hero
2. Include specific metrics in feature descriptions
3. Add "no credit card required" near sign-up CTA

### Quick Wins

1. Fix CTA text from "Submit" to "Start free trial"
2. Replace generic testimonial with specific quote
3. Add trust badges near sign-up button
```

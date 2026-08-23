export interface MediaAsset {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly attachmentId?: number
  readonly srcSet?: string
}

export interface HeroSlide extends MediaAsset {
  readonly title: string
  readonly description: string
}

export interface ContentLink {
  readonly label: string
  readonly to: string
}

export interface SiteContent {
  readonly brandName: string
  readonly logo: MediaAsset
  readonly tagline: string
  readonly navigation: readonly ContentLink[]
  readonly servicesNavigationLabel: string
  readonly headerAction: ContentLink
  readonly exploreLabel: string
  readonly contactLabel: string
  readonly contact: {
    readonly email: string
    readonly phoneLabel: string
    readonly phoneHref: string
    readonly addressLines: readonly string[]
  }
  readonly legalLinks: readonly ContentLink[]
}

export interface EnquiryInterestOption {
  readonly value: string
  readonly label: string
}

export interface ContactLocation {
  readonly label: string
  readonly addressLines: readonly string[]
}

export interface ContactPageContent {
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly hero: {
    readonly eyebrow: string
    readonly title: string
    readonly summary: string
    readonly directContactTitle: string
  }
  readonly form: {
    readonly eyebrow: string
    readonly title: string
    readonly introduction: string
    readonly consentLabel: string
    readonly submitLabel: string
    readonly interests: readonly EnquiryInterestOption[]
  }
  readonly locations: {
    readonly eyebrow: string
    readonly title: string
    readonly items: readonly ContactLocation[]
  }
}

export interface HeroContent {
  readonly eyebrow: string
  readonly title: string
  readonly summary: string
  readonly primaryAction: ContentLink
  readonly secondaryAction: ContentLink
  readonly highlights: readonly string[]
  readonly slides: readonly HeroSlide[]
}

export interface StoryContent {
  readonly eyebrow: string
  readonly title: string
  readonly body: string
  readonly action: ContentLink
  readonly image: MediaAsset
}

export interface ConversionOption {
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly action: ContentLink
  readonly intent: string
}

export interface ConversionPanelContent {
  readonly eyebrow: string
  readonly title: string
  readonly items: readonly ConversionOption[]
}

export interface BusinessLine {
  readonly name: string
  readonly descriptor: string
  readonly summary: string
  readonly action: ContentLink
  readonly image: MediaAsset
}

export interface BusinessLinesContent {
  readonly eyebrow: string
  readonly title: string
  readonly summary: string
  readonly items: readonly BusinessLine[]
}

export interface ExcellencePoint {
  readonly number: string
  readonly title: string
  readonly body: string
}

export interface ExcellenceContent {
  readonly eyebrow: string
  readonly title: string
  readonly summary: string
  readonly items: readonly ExcellencePoint[]
}

export interface ProductItem {
  readonly name: string
  readonly description: string
  readonly action: ContentLink
  readonly image: MediaAsset
}

export interface ProductRangeContent {
  readonly eyebrow: string
  readonly title: string
  readonly action: ContentLink
  readonly items: readonly ProductItem[]
}

export interface TestimonialItem {
  readonly quote: string
  readonly name: string
  readonly role: string
}

export interface TestimonialsContent {
  readonly eyebrow: string
  readonly title: string
  readonly items: readonly TestimonialItem[]
}

export interface FaqItem {
  readonly question: string
  readonly answer: string
}

export interface FaqContent {
  readonly eyebrow: string
  readonly title: string
  readonly items: readonly FaqItem[]
}

export interface ArticleSummary {
  readonly title: string
  readonly excerpt: string
  readonly date: string
  readonly dateTime: string
  readonly category: string
  readonly to: string
  readonly image: MediaAsset
}

export interface NewsHeaderContent {
  readonly eyebrow: string
  readonly title: string
  readonly action: ContentLink
}

export interface NewsContent extends NewsHeaderContent {
  readonly items: readonly ArticleSummary[]
}

export interface PartnershipContent extends StoryContent {
  readonly secondaryAction: ContentLink
}

export interface HomePageContent {
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly hero: HeroContent
  readonly conversion: ConversionPanelContent
  readonly story: StoryContent
  readonly businessLines: BusinessLinesContent
  readonly excellence: ExcellenceContent
  readonly products: ProductRangeContent
  readonly testimonials: TestimonialsContent
  readonly faqs: FaqContent
  readonly articles: NewsContent
  readonly partnership: PartnershipContent
}

export interface PageHeroContent {
  readonly eyebrow: string
  readonly title: string
  readonly summary: string
  readonly primaryAction: ContentLink
  readonly secondaryAction?: ContentLink
  readonly image?: MediaAsset
  readonly imageCaption?: string
  readonly facts?: readonly {
    readonly value: string
    readonly label: string
  }[]
}

export interface NarrativeSectionContent {
  readonly kind: 'narrative'
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly paragraphs: readonly string[]
  readonly image: MediaAsset
  readonly imagePosition?: 'start' | 'end'
  readonly action?: ContentLink
  readonly note?: string
}

export interface PrincipleItem {
  readonly kicker?: string
  readonly title: string
  readonly body: string
}

export interface PrinciplesSectionContent {
  readonly kind: 'principles'
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly summary?: string
  readonly items: readonly PrincipleItem[]
  readonly tone?: 'paper' | 'brand' | 'rice'
}

export interface OfferingItem {
  readonly name: string
  readonly description: string
  readonly details?: readonly string[]
  readonly image: MediaAsset
  readonly action: ContentLink
}

export interface OfferingsSectionContent {
  readonly kind: 'offerings'
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly summary?: string
  readonly items: readonly OfferingItem[]
  readonly columns?: 2 | 3
}

export interface CalloutSectionContent {
  readonly kind: 'callout'
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly body: string
  readonly primaryAction: ContentLink
  readonly secondaryAction?: ContentLink
  readonly image?: MediaAsset
}

export type InteriorSectionContent =
  NarrativeSectionContent | PrinciplesSectionContent | OfferingsSectionContent | CalloutSectionContent

export interface InteriorPageContent {
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly hero: PageHeroContent
  readonly sections: readonly InteriorSectionContent[]
}

export interface ArticleParagraphBlock {
  readonly kind: 'paragraph'
  readonly text: string
}

export interface ArticleHeadingBlock {
  readonly kind: 'heading'
  readonly text: string
}

export interface ArticleListBlock {
  readonly kind: 'list'
  readonly items: readonly string[]
}

export interface ArticleCalloutBlock {
  readonly kind: 'callout'
  readonly title: string
  readonly body: string
}

export type ArticleBlock = ArticleParagraphBlock | ArticleHeadingBlock | ArticleListBlock | ArticleCalloutBlock

export interface ArticleContent {
  readonly slug: string
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly eyebrow: string
  readonly title: string
  readonly summary: string
  readonly date: string
  readonly datePublished: string
  readonly dateModified?: string
  readonly category: string
  readonly image: MediaAsset
  readonly blocks: readonly ArticleBlock[]
  readonly html?: string
  readonly source?: 'wordpress' | 'fallback'
}

export interface LegalPageContent {
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly eyebrow: string
  readonly title: string
  readonly introduction: string
  readonly reviewNotice: string
  readonly sections: readonly {
    readonly title: string
    readonly paragraphs: readonly string[]
    readonly items?: readonly string[]
  }[]
}

export interface BlogPageContent {
  readonly seo: {
    readonly title: string
    readonly description: string
  }
  readonly hero: PageHeroContent
  readonly news: NewsHeaderContent
}

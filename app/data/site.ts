import type { SiteContent } from '~/types/content'

export const siteContent = {
  brandName: 'Heekmah Group',
  logo: {
    src: '/media/heekmah-logo.webp',
    alt: '',
    width: 150,
    height: 150,
  },
  tagline: 'Quality food products and practical agricultural solutions, built for Nigeria’s growing food system.',
  navigation: [
    { label: 'About us', to: '/about-us/' },
    { label: 'Heekmah Rice', to: '/heekmah-rice/' },
    { label: 'Integral Services', to: '/heekmah-integral-services/' },
    { label: 'Blog', to: '/blog/' },
    { label: 'Contact', to: '/contact-us/' },
  ],
  servicesNavigationLabel: 'Our Services',
  headerAction: {
    label: 'Enquire now',
    to: '/contact-us/?interest=general-enquiry',
  },
  exploreLabel: 'Explore',
  contactLabel: 'Contact',
  contact: {
    email: 'info@heekmahgroup.com',
    phoneLabel: '+234 905 555 4302',
    phoneHref: '+2349055554302',
    addressLines: ['No. 40, IBM Haruna Crescent,', 'Utako, Abuja'],
  },
  legalLinks: [
    { label: 'Privacy', to: '/privacy-policy/' },
    { label: 'Terms', to: '/terms-conditon/' },
    { label: 'Refund policy', to: '/refund_returns/' },
  ],
} as const satisfies SiteContent

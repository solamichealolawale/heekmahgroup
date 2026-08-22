import type { ContactPageContent } from '~/types/content'

export const contactPageContent = {
  seo: {
    title: 'Contact Heekmah Group | Product, Service and Partnership Enquiries',
    description:
      'Contact Heekmah Group about rice orders, distribution, agricultural services, farm inputs and partnerships in Nigeria.',
  },
  hero: {
    eyebrow: 'Contact Heekmah Group',
    title: 'Let’s discuss what you need.',
    summary:
      'Use the form for product orders, distribution, agricultural services or partnerships. Choose the closest enquiry type so it reaches the right team.',
    directContactTitle: 'Prefer to contact us directly?',
  },
  form: {
    eyebrow: 'Send an enquiry',
    title: 'Tell us how we can help',
    introduction: 'Share the essential details below. Fields marked with an asterisk are required.',
    consentLabel: 'I agree that Heekmah Group may use these details to respond to my enquiry.',
    submitLabel: 'Send enquiry',
    interests: [
      { value: 'general-enquiry', label: 'General enquiry' },
      { value: 'rice-order', label: 'Order Heekmah rice' },
      { value: 'find-a-distributor', label: 'Find a distributor' },
      { value: 'distribution', label: 'Become a distributor or supplier' },
      { value: 'agricultural-services', label: 'Agricultural services' },
      { value: 'parboiled-rice', label: 'Heekmah Parboiled Rice' },
      { value: 'broken-rice', label: 'Heekmah Broken Rice' },
      { value: 'rice-bran', label: 'Heekmah Rice Bran' },
      { value: 'reject-rice', label: 'Heekmah Reject Rice' },
      { value: 'topper', label: 'Topper crop growth enhancer' },
      { value: 'partnership', label: 'Partnership' },
    ],
  },
  locations: {
    eyebrow: 'Where to find us',
    title: 'Our locations',
    items: [
      {
        label: 'Abuja office',
        addressLines: ['No. 40, IBM Haruna Crescent,', 'Utako, Abuja'],
      },
      {
        label: 'Sokoto factory',
        addressLines: ['No. 2, Dingyadi Junction, Kasarawa,', 'Airport Road, Sokoto'],
      },
    ],
  },
} as const satisfies ContactPageContent

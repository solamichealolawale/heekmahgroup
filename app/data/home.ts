import type { HomePageContent } from '~/types/content'

const mediaBase = 'https://heekmahgroup.com/wp-content/uploads'

export const homePageContent = {
  seo: {
    title: 'Heekmah Group | Rice, Farm Inputs and Agricultural Services',
    description:
      'Heekmah Group supports Nigeria’s food system through premium rice production, farm inputs, mechanisation and farmer-focused agricultural services.',
  },
  hero: {
    eyebrow: 'Heekmah Group · Nigeria',
    title: 'Innovative solutions for sustainable agriculture',
    summary:
      'From premium rice production to farm inputs and mechanisation, Heekmah Group works across the agricultural value chain to support food security and agricultural excellence.',
    primaryAction: {
      label: 'Talk to our team',
      to: '/contact-us/?interest=general-enquiry',
    },
    secondaryAction: {
      label: 'Explore our companies',
      to: '#companies',
    },
    highlights: ['Rice production', 'Farm inputs', 'Mechanisation'],
    slides: [
      {
        src: `${mediaBase}/2024/12/pexels-agro-oliveira-289675200-13157324-1-scaled.webp`,
        alt: 'Green agricultural machinery lined up inside a manufacturing facility',
        width: 2560,
        height: 1620,
        attachmentId: 8739,
      },
      {
        src: `${mediaBase}/2025/01/heekah.webp`,
        alt: 'Stacked bags of Heekmah Rice ready for distribution',
        width: 2560,
        height: 1620,
        attachmentId: 8886,
      },
      {
        src: `${mediaBase}/2025/01/outgrowers.webp`,
        alt: 'Heekmah team reviewing seedlings inside a greenhouse',
        width: 2560,
        height: 1620,
        attachmentId: 8882,
      },
      {
        src: `${mediaBase}/2025/01/chemical.webp`,
        alt: 'Crop protection work in a rice field',
        width: 2560,
        height: 1620,
        attachmentId: 8892,
      },
      {
        src: `${mediaBase}/2024/12/pexels-agro-oliveira-289675200-13157324-3-scaled.webp`,
        alt: 'A young seedling held in a farmer’s hand',
        width: 2560,
        height: 1620,
        attachmentId: 8747,
      },
    ],
    imageCaption: 'From field to table',
  },
  conversion: {
    eyebrow: 'Start here',
    title: 'How can we help?',
    items: [
      {
        eyebrow: 'Buy and stock',
        title: 'Order Heekmah rice',
        description: 'For households, retailers, caterers and bulk buyers.',
        action: {
          label: 'Make an enquiry',
          to: '/contact-us/?interest=rice-order',
        },
        intent: 'rice-order',
      },
      {
        eyebrow: 'Farm support',
        title: 'Request agricultural services',
        description: 'Mechanisation, farm inputs and practical agribusiness support.',
        action: {
          label: 'Request a service',
          to: '/contact-us/?interest=agricultural-services',
        },
        intent: 'agricultural-services',
      },
      {
        eyebrow: 'Grow with us',
        title: 'Become a distributor',
        description: 'Join our distribution, paddy supply or partnership network.',
        action: {
          label: 'Register your interest',
          to: '/contact-us/?interest=distribution',
        },
        intent: 'distribution',
      },
    ],
  },
  story: {
    eyebrow: 'The Heekmah story',
    title: 'A dream to help end hunger and malnutrition',
    body: 'Heekmah Group began with a commitment to improve access to quality farm inputs and nutritious food products. That purpose continues to guide our work across Nigeria’s agri-food sector.',
    action: {
      label: 'Discover more about us',
      to: '/about-us/',
    },
    image: {
      src: `${mediaBase}/2024/12/5931316636135047846-rotated.jpg`,
      alt: 'Heekmah team members at an agricultural facility',
      width: 1280,
      height: 720,
    },
  },
  businessLines: {
    eyebrow: 'Two companies, one purpose',
    title: 'Driving excellence through innovation',
    summary:
      'Heekmah Group brings food production and agricultural services together to serve homes, farms and businesses.',
    items: [
      {
        name: 'Heekmah Rice Nigeria Limited',
        descriptor: 'Food products',
        summary:
          'Stone-free rice with a rich taste, processed for homes and businesses and available in a range of practical package sizes.',
        action: {
          label: 'Explore Heekmah Rice',
          to: '/heekmah-rice/',
        },
        image: {
          src: `${mediaBase}/2024/12/IMG_4683-scaled.webp`,
          alt: 'Stacked bags of Heekmah Rice ready for distribution',
          width: 2560,
          height: 1909,
        },
      },
      {
        name: 'Heekmah Integral Services Limited',
        descriptor: 'Agricultural solutions',
        summary:
          'Farm inputs, mechanisation and practical services that help farmers improve productivity and strengthen farm output.',
        action: {
          label: 'Explore Integral Services',
          to: '/heekmah-integral-services/',
        },
        image: {
          src: `${mediaBase}/2025/01/PHOTO-2025-01-07-09-38-33.webp`,
          alt: 'Heekmah agricultural products and services',
          width: 1040,
          height: 780,
        },
      },
    ],
  },
  excellence: {
    eyebrow: 'How we work',
    title: 'How we ensure excellence',
    summary: 'Quality is built through the way we process, support farmers and make our products available.',
    items: [
      {
        number: '01',
        title: 'Advanced technology',
        body: 'Precision processing supports consistently clean, premium-quality rice.',
      },
      {
        number: '02',
        title: 'Out-grower programme',
        body: 'Farmers receive support through inputs, agro-chemicals, training and market access.',
      },
      {
        number: '03',
        title: 'Sustainability focus',
        body: 'Our agricultural practices are built around consistent quality and responsible growth.',
      },
      {
        number: '04',
        title: 'Nationwide reach',
        body: 'Products are made accessible to households, farmers and businesses across Nigeria.',
      },
    ],
  },
  products: {
    eyebrow: 'Our products',
    title: 'Products tailored to real needs',
    action: {
      label: 'Find a distributor',
      to: '/contact-us/?interest=find-a-distributor',
    },
    items: [
      {
        name: 'Heekmah Parboiled Rice',
        description: 'Stone-free, long-grain rice with a rich taste and non-sticky texture.',
        action: {
          label: 'Enquire about this product',
          to: '/contact-us/?interest=parboiled-rice',
        },
        image: {
          src: `${mediaBase}/2025/01/parr-rice.webp`,
          alt: 'Heekmah Parboiled Rice packaging',
          width: 800,
          height: 800,
        },
      },
      {
        name: 'Heekmah Broken Rice',
        description: 'Affordable broken rice for home cooking and catering needs.',
        action: {
          label: 'Enquire about this product',
          to: '/contact-us/?interest=broken-rice',
        },
        image: {
          src: `${mediaBase}/2024/12/PHOTO-2024-12-16-20-46-50-2.webp`,
          alt: 'Heekmah Broken Rice packaging',
          width: 800,
          height: 800,
        },
      },
      {
        name: 'Heekmah Rice Bran',
        description: 'A nutrient-rich byproduct used for livestock feed and vegetable oil production.',
        action: {
          label: 'Enquire about this product',
          to: '/contact-us/?interest=rice-bran',
        },
        image: {
          src: `${mediaBase}/2025/01/tinney_trimz-removebg-preview.webp`,
          alt: 'Heekmah Rice Bran product',
          width: 800,
          height: 800,
        },
      },
      {
        name: 'Heekmah Reject Rice',
        description: 'Versatile rice for local dishes, processing and commercial use.',
        action: {
          label: 'Enquire about this product',
          to: '/contact-us/?interest=reject-rice',
        },
        image: {
          src: `${mediaBase}/2025/01/reject-rice.webp`,
          alt: 'Heekmah Reject Rice packaging',
          width: 800,
          height: 800,
        },
      },
      {
        name: 'Topper®',
        description: 'An eco-friendly crop growth enhancer designed to support better farm yield.',
        action: {
          label: 'Enquire about this product',
          to: '/contact-us/?interest=topper',
        },
        image: {
          src: `${mediaBase}/2024/12/IMG_4692-scaled.webp`,
          alt: 'Topper crop enhancer from Heekmah Integral Services',
          width: 1512,
          height: 1123,
        },
      },
    ],
  },
  testimonials: {
    eyebrow: 'In their words',
    title: 'What our clients say',
    items: [
      {
        quote:
          'Heekmah Rice is clean, stone-free and cooks perfectly every time. My family loves the long-grain quality and rich taste.',
        name: 'Fatima S.',
        role: 'Homeowner',
      },
      {
        quote:
          'Topper® crop enhancer improved the health of my crops and increased my harvest. I have recommended it to farming colleagues.',
        name: 'Adebayo F.',
        role: 'Farmer',
      },
      {
        quote:
          'Heekmah Integral Services brought the equipment and expertise that made our work easier and more efficient. Their professionalism stood out.',
        name: 'Ahmed A.',
        role: 'CEO',
      },
    ],
  },
  faqs: {
    eyebrow: 'Common questions',
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What makes Heekmah different from others?',
        answer:
          'Heekmah Rice is processed with advanced technology to keep it clean, stone-free and consistently high quality. Our out-grower programme also supports reliable supply and responsible production.',
      },
      {
        question: 'What services does Heekmah Integral Services Limited provide?',
        answer:
          'We provide mechanisation services, agribusiness consultancy and agricultural products including fertilisers, pesticides and our Topper® crop growth enhancer.',
      },
      {
        question: 'How can I become a distributor or paddy supplier?',
        answer:
          'Contact our team through the website to discuss joining our distribution network or supply chain. We welcome reliable distributors and paddy aggregators.',
      },
    ],
  },
  articles: {
    eyebrow: 'From the field',
    title: 'Latest news and insights',
    action: {
      label: 'View all articles',
      to: '/blog/',
    },
    items: [
      {
        title: 'Building Partnerships for Agricultural Development: Lessons from Heekmah Group’s Collaborations',
        excerpt:
          'Why partnerships between private organisations, government bodies and research institutions matter for agricultural development.',
        date: '8 January 2025',
        dateTime: '2025-01-08',
        category: 'Innovations',
        to: '/building-partnerships-for-agricultural-development-lessons-from-heekmah-groups-collaborations/',
        image: {
          src: `${mediaBase}/2025/01/DRB_6064-2048x1463.webp`,
          alt: 'Agricultural partners meeting in the field',
          width: 2048,
          height: 1463,
        },
      },
      {
        title: 'Kebbi State Agriculture: A Growing Hub for Nigeria’s Food Basket',
        excerpt: 'A look at Kebbi State’s fertile land, key crops and growing contribution to Nigeria’s food security.',
        date: '8 January 2025',
        dateTime: '2025-01-08',
        category: 'Innovations',
        to: '/kebbi-state-agriculture-a-growing-hub-for-nigerias-food-basket/',
        image: {
          src: `${mediaBase}/2025/01/PHOTO-2025-01-06-16-13-44.webp`,
          alt: 'Agricultural work in Kebbi State',
          width: 1280,
          height: 720,
        },
      },
      {
        title: 'Transforming Agriculture Through Innovation: The Role of Research in Modern Farming',
        excerpt: 'How research-backed farming can improve productivity, sustainability and long-term food security.',
        date: '8 January 2025',
        dateTime: '2025-01-08',
        category: 'Innovations',
        to: '/transforming-agriculture-through-innovation-the-role-of-research-in-modern-farming/',
        image: {
          src: `${mediaBase}/2025/01/DRB_6429-1-2048x1365.webp`,
          alt: 'Modern farming and agricultural research work',
          width: 2048,
          height: 1365,
        },
      },
    ],
  },
  partnership: {
    eyebrow: 'Work with Heekmah',
    title: 'Shape the future of agriculture with us',
    body: 'Become a distributor, supplier or partner and help strengthen innovation and excellence across Nigeria’s agricultural sector.',
    action: {
      label: 'Start a conversation',
      to: '/contact-us/?interest=partnership',
    },
    secondaryAction: {
      label: 'Call our team',
      to: 'tel:+2349055554302',
    },
    image: {
      src: `${mediaBase}/2025/01/DRB_6375-2-2048x1402.webp`,
      alt: 'Heekmah Group working with agricultural partners',
      width: 2048,
      height: 1402,
    },
  },
} as const satisfies HomePageContent

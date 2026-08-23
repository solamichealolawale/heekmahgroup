import type { BlogPageContent, InteriorPageContent, LegalPageContent, PageHeroContent } from '~/types/content'

const mediaBase = 'https://heekmahgroup.com/wp-content/uploads'

export const aboutPageContent = {
  seo: {
    title: 'About Heekmah Group | Building Nigeria’s Agri-food Future',
    description:
      'Learn how Heekmah Group grew from agricultural input distribution into rice processing and practical agricultural services in Nigeria.',
  },
  hero: {
    eyebrow: 'About Heekmah Group',
    title: 'Built for progress across the agricultural value chain.',
    summary:
      'We develop food products and agricultural solutions that help farmers, families and businesses participate in a stronger Nigerian food system.',
    primaryAction: { label: 'Work with Heekmah', to: '/contact-us/?interest=partnership' },
    secondaryAction: { label: 'Explore our companies', to: '#our-story' },
    image: {
      src: `${mediaBase}/2025/01/DRB_6375-1-scaled.webp`,
      alt: 'Heekmah Group team members during an agricultural field visit',
      width: 2560,
      height: 1707,
    },
    imageCaption: 'Agriculture strengthened through practical collaboration',
    facts: [
      { value: '15+ years', label: 'Growing with Nigeria’s agricultural sector' },
      { value: '240 MT', label: 'Daily rice-processing capacity' },
    ],
  },
  sections: [
    {
      kind: 'narrative',
      id: 'our-story',
      eyebrow: 'Our story',
      title: 'A commitment that grew into an integrated group',
      paragraphs: [
        'Heekmah Group began with a clear ambition: to help address hunger and malnutrition by improving access to quality agricultural inputs and nutritious food products.',
        'What started with the distribution of agrochemicals grew into a recognised agricultural business, including a relationship with Syngenta and the development of the Topper® crop growth enhancer.',
        'The same practical approach shaped our rice business. An operation that began at one metric tonne per day has grown into an automated facility with capacity to process 240 metric tonnes daily. The scale has changed; the focus on dependable quality has not.',
      ],
      image: {
        src: `${mediaBase}/2024/12/5931316636135047846-rotated.jpg`,
        alt: 'Heekmah Group leadership and team members',
        width: 1280,
        height: 720,
      },
      imagePosition: 'start',
      note: 'From agricultural inputs to food processing, each step has been shaped by a practical need in the market.',
    },
    {
      kind: 'principles',
      id: 'direction',
      eyebrow: 'Our direction',
      title: 'The purpose behind the work',
      summary: 'Our mission and vision guide how we invest, serve customers and work with farmers.',
      tone: 'rice',
      items: [
        {
          kicker: 'Mission',
          title: 'Make agricultural progress practical',
          body: 'To provide dependable services, innovative products and sustainable solutions that improve farmer productivity and support family nutritional security.',
        },
        {
          kicker: 'Vision',
          title: 'Build a trusted agricultural hub',
          body: 'To become a leading source of quality agricultural inputs, sustainable farming solutions and nutritious food products.',
        },
        {
          kicker: 'Commitment',
          title: 'Keep quality close to the customer',
          body: 'We connect food processing, farm support and market access so that better products and better agricultural outcomes reinforce one another.',
        },
      ],
    },
    {
      kind: 'principles',
      id: 'growth',
      eyebrow: 'How we have grown',
      title: 'Progress measured in capability, not noise',
      tone: 'brand',
      items: [
        {
          kicker: '01',
          title: 'Agricultural inputs',
          body: 'Built practical experience by supplying the products farmers need to protect crops and improve output.',
        },
        {
          kicker: '02',
          title: 'Research-backed products',
          body: 'Developed Topper® and supported field evaluation through the Institute for Agricultural Research at Ahmadu Bello University.',
        },
        {
          kicker: '03',
          title: 'Food processing',
          body: 'Expanded rice processing from a small daily operation to an automated 240-metric-tonne facility.',
        },
        {
          kicker: '04',
          title: 'Farmer and market links',
          body: 'Strengthened out-grower, distribution and partnership networks that connect production with demand.',
        },
      ],
    },
    {
      kind: 'callout',
      id: 'contact',
      eyebrow: 'Build with us',
      title: 'Let’s turn a practical opportunity into lasting value.',
      body: 'Talk to our team about distribution, paddy supply, agricultural services or a strategic partnership.',
      primaryAction: { label: 'Start a conversation', to: '/contact-us/?interest=partnership' },
      secondaryAction: { label: 'Call +234 905 555 4302', to: 'tel:+2349055554302' },
      image: {
        src: `${mediaBase}/2025/01/DRB_6428-1-scaled.webp`,
        alt: 'Heekmah Group representatives speaking with agricultural partners',
        width: 2560,
        height: 1707,
      },
    },
  ],
} as const satisfies InteriorPageContent

export const ricePageContent = {
  seo: {
    title: 'Heekmah Rice | Premium Nigerian Rice for Homes and Businesses',
    description:
      'Explore Heekmah parboiled rice, broken rice and rice bran, processed at our automated 240-metric-tonne-per-day facility in Sokoto.',
  },
  hero: {
    eyebrow: 'Heekmah Rice Nigeria Limited',
    title: 'Clean, dependable rice for Nigerian tables.',
    summary:
      'We process quality Nigerian rice for households, retailers, caterers and bulk buyers, with consistent standards from paddy intake to finished pack.',
    primaryAction: { label: 'Request a rice quote', to: '/contact-us/?interest=rice-order' },
    secondaryAction: { label: 'View our products', to: '#rice-products' },
    image: {
      src: `${mediaBase}/2025/01/parr-rice.webp`,
      alt: 'A close view of clean long-grain rice',
      width: 800,
      height: 800,
    },
    imageCaption: 'Processed in Sokoto and made for homes and businesses',
    facts: [
      { value: '240 MT/day', label: 'Automated processing capacity' },
      { value: '10–50 kg', label: 'Parboiled rice pack sizes' },
    ],
  },
  sections: [
    {
      kind: 'narrative',
      id: 'facility',
      eyebrow: 'Our processing facility',
      title: 'Quality built into the process',
      paragraphs: [
        'Our automated rice-processing facility is located at Dingyadi Junction, Airport Road, Sokoto. It has capacity to process 240 metric tonnes of rice each day.',
        'Technology supports the work, but the goal is straightforward: deliver clean, stone-free rice with a rich taste and a dependable cooking experience.',
        'By working with farmers and market partners, we connect local production with the needs of homes, retailers and commercial kitchens.',
      ],
      image: {
        src: `${mediaBase}/2025/01/PHOTO-2025-01-06-16-13-45.webp`,
        alt: 'Inside Heekmah Rice processing operations',
        width: 1280,
        height: 720,
      },
      imagePosition: 'end',
      action: { label: 'Discuss a bulk order', to: '/contact-us/?interest=rice-order' },
    },
    {
      kind: 'principles',
      id: 'why-heekmah-rice',
      eyebrow: 'Why Heekmah Rice',
      title: 'Four parts of dependable quality',
      summary: 'From processing to availability, each part of the operation serves the same promise.',
      tone: 'brand',
      items: [
        {
          kicker: '01',
          title: 'Advanced processing',
          body: 'Automated equipment helps maintain consistent cleaning, polishing and product quality.',
        },
        {
          kicker: '02',
          title: 'Premium quality',
          body: 'Our parboiled rice is long-grain, stone-free and made for a non-sticky result when properly prepared.',
        },
        {
          kicker: '03',
          title: 'Farmer support',
          body: 'Our out-grower relationships connect inputs, production support and a route to market.',
        },
        {
          kicker: '04',
          title: 'Practical availability',
          body: 'Multiple pack sizes and distribution relationships make ordering easier for different kinds of buyers.',
        },
      ],
    },
    {
      kind: 'offerings',
      id: 'rice-products',
      eyebrow: 'Our rice products',
      title: 'Choose the product that fits the job',
      summary: 'Ask our team about current availability, pack sizes and delivery options for your location.',
      columns: 3,
      items: [
        {
          name: 'Heekmah Parboiled Rice',
          description: 'Polished, stone-free long-grain rice with a rich taste and non-sticky texture.',
          details: ['50 kg', '25 kg', '10 kg'],
          image: {
            src: `${mediaBase}/2025/01/parr-rice.webp`,
            alt: 'Heekmah Parboiled Rice packaging',
            width: 800,
            height: 800,
          },
          action: { label: 'Enquire about parboiled rice', to: '/contact-us/?interest=parboiled-rice' },
        },
        {
          name: 'Heekmah Broken Rice',
          description: 'An affordable option for home cooking, catering and other high-volume uses.',
          details: ['50 kg'],
          image: {
            src: `${mediaBase}/2025/01/reject-rice.webp`,
            alt: 'Heekmah broken rice product packaging',
            width: 800,
            height: 800,
          },
          action: { label: 'Enquire about broken rice', to: '/contact-us/?interest=broken-rice' },
        },
        {
          name: 'Heekmah Rice Bran',
          description: 'A nutrient-rich milling byproduct used for livestock feed and vegetable-oil production.',
          details: ['Available by the tonne'],
          image: {
            src: `${mediaBase}/2025/01/tinney_trimz-removebg-preview.webp`,
            alt: 'Heekmah Rice Bran product',
            width: 800,
            height: 800,
          },
          action: { label: 'Enquire about rice bran', to: '/contact-us/?interest=rice-bran' },
        },
      ],
    },
    {
      kind: 'narrative',
      id: 'outgrowers',
      eyebrow: 'Planting seeds of progress',
      title: 'A stronger supply chain starts with farmers',
      paragraphs: [
        'Our out-grower work supports farmers with agricultural inputs and a clearer route to market. This helps strengthen paddy supply while creating practical value in farming communities.',
        'The relationship is designed around shared outcomes: better production, more dependable supply and quality rice that reaches the customer.',
      ],
      image: {
        src: `${mediaBase}/2025/01/outgrowers.webp`,
        alt: 'Heekmah Group distributing agricultural inputs to out-growers',
        width: 1280,
        height: 720,
      },
      imagePosition: 'start',
      action: { label: 'Ask about paddy supply', to: '/contact-us/?interest=distribution' },
    },
    {
      kind: 'callout',
      id: 'quote',
      eyebrow: 'Ordering Heekmah Rice',
      title: 'Tell us the product, quantity and delivery location.',
      body: 'Our team will confirm availability and the next practical step for household, retail, catering or bulk requirements.',
      primaryAction: { label: 'Request a quote', to: '/contact-us/?interest=rice-order' },
      secondaryAction: { label: 'Call +234 905 555 4302', to: 'tel:+2349055554302' },
    },
  ],
} as const satisfies InteriorPageContent

export const servicesPageContent = {
  seo: {
    title: 'Heekmah Integral Services | Farm Inputs and Agricultural Support',
    description:
      'Explore Heekmah Integral Services for Topper crop enhancer, agrochemicals, farm equipment, mechanisation and agribusiness support.',
  },
  hero: {
    eyebrow: 'Heekmah Integral Services Limited',
    title: 'Practical support for productive farms.',
    summary:
      'We supply agricultural inputs and equipment, deliver mechanisation services and help farmers and investors make clearer agribusiness decisions.',
    primaryAction: { label: 'Request agricultural support', to: '/contact-us/?interest=agricultural-services' },
    secondaryAction: { label: 'Explore products', to: '#farm-products' },
    image: {
      src: `${mediaBase}/2025/01/PHOTO-2025-01-07-09-38-33.webp`,
      alt: 'Heekmah agricultural products and field services',
      width: 1040,
      height: 780,
    },
    imageCaption: 'Inputs, equipment and expertise for real farm needs',
    facts: [
      { value: 'Inputs', label: 'Crop protection and growth support' },
      { value: 'Services', label: 'Mechanisation and agribusiness guidance' },
    ],
  },
  sections: [
    {
      kind: 'narrative',
      id: 'approach',
      eyebrow: 'Our approach',
      title: 'Support that starts with the farm problem',
      paragraphs: [
        'Heekmah Integral Services works with farmers, organisations and investors across the agricultural corridor. We focus on the inputs, equipment and decisions that can improve productivity and farm income.',
        'Our range covers crop growth and protection products, small farm equipment and larger mechanisation needs. Agribusiness consultancy adds commercial perspective where planning and investment decisions are involved.',
      ],
      image: {
        src: `${mediaBase}/2025/01/chemical.webp`,
        alt: 'Agricultural inputs supplied by Heekmah Integral Services',
        width: 1280,
        height: 720,
      },
      imagePosition: 'end',
      action: { label: 'Tell us what your farm needs', to: '/contact-us/?interest=agricultural-services' },
    },
    {
      kind: 'offerings',
      id: 'farm-products',
      eyebrow: 'Farm products',
      title: 'Tools and inputs for the work at hand',
      summary: 'Contact our team for current product availability, suitable use and ordering information.',
      columns: 2,
      items: [
        {
          name: 'Topper® crop growth enhancer',
          description: 'An organic crop growth enhancer developed to support plant health and farm yield.',
          image: {
            src: `${mediaBase}/2024/12/IMG_4692-scaled.webp`,
            alt: 'Topper crop growth enhancer product',
            width: 1512,
            height: 1123,
          },
          action: { label: 'Enquire about Topper', to: '/contact-us/?interest=topper' },
        },
        {
          name: 'Agrochemicals',
          description: 'Fertilisers, pesticides and herbicides selected for practical crop-management needs.',
          image: {
            src: `${mediaBase}/2024/12/agro-chemicals.webp`,
            alt: 'Agrochemical products for crop management',
            width: 800,
            height: 800,
          },
          action: { label: 'Ask about agrochemicals', to: '/contact-us/?interest=agricultural-services' },
        },
        {
          name: 'Knapsack sprayers',
          description: 'Portable sprayers for applying crop-protection and plant-care products in the field.',
          image: {
            src: `${mediaBase}/2024/12/istockphoto-153705705-612x612-1-1.webp`,
            alt: 'Knapsack sprayer used for field application',
            width: 612,
            height: 612,
          },
          action: { label: 'Ask about sprayers', to: '/contact-us/?interest=agricultural-services' },
        },
        {
          name: 'Water pumps',
          description: 'Irrigation equipment that helps move water where crops need it.',
          image: {
            src: `${mediaBase}/2024/12/pexels-dinukagunawardana-17903068-1.webp`,
            alt: 'Water pump supporting farm irrigation',
            width: 1280,
            height: 853,
          },
          action: { label: 'Ask about water pumps', to: '/contact-us/?interest=agricultural-services' },
        },
      ],
    },
    {
      kind: 'principles',
      id: 'services',
      eyebrow: 'Agricultural services',
      title: 'Capability beyond the product shelf',
      summary: 'Some agricultural challenges need equipment, judgement and coordination as well as inputs.',
      tone: 'rice',
      items: [
        {
          kicker: 'Mechanisation',
          title: 'Get the right work done efficiently',
          body: 'Access practical mechanisation support for field operations and production needs.',
        },
        {
          kicker: 'Consultancy',
          title: 'Make clearer agribusiness decisions',
          body: 'Assess opportunities, priorities and operating considerations before committing capital.',
        },
        {
          kicker: 'Supply',
          title: 'Coordinate dependable procurement',
          body: 'Source agricultural and general supplies for organisations and projects through one accountable team.',
        },
      ],
    },
    {
      kind: 'narrative',
      id: 'research',
      eyebrow: 'Agricultural innovation',
      title: 'Research gives practical products a stronger foundation',
      paragraphs: [
        'Heekmah has worked with the Institute for Agricultural Research at Ahmadu Bello University on field evaluation of Topper®.',
        'That relationship reflects a wider principle: agricultural innovation is most useful when evidence, field experience and farmer needs inform one another.',
      ],
      image: {
        src: `${mediaBase}/2025/01/heekmah.webp`,
        alt: 'Heekmah agricultural field research activity',
        width: 1280,
        height: 720,
      },
      imagePosition: 'start',
      action: {
        label: 'Read about research and farming',
        to: '/transforming-agriculture-through-innovation-the-role-of-research-in-modern-farming/',
      },
    },
    {
      kind: 'callout',
      id: 'request-service',
      eyebrow: 'Plan the next step',
      title: 'Start with the farm, project or investment objective.',
      body: 'Share the location, scale and support you need. Our team will help identify the most relevant product or service path.',
      primaryAction: { label: 'Request a service', to: '/contact-us/?interest=agricultural-services' },
      secondaryAction: { label: 'Call +234 905 555 4302', to: 'tel:+2349055554302' },
      image: {
        src: `${mediaBase}/2025/01/PHOTO-2025-01-07-09-38-31.webp`,
        alt: 'Heekmah team supporting agricultural work in the field',
        width: 1280,
        height: 720,
      },
    },
  ],
} as const satisfies InteriorPageContent

export const blogHeroContent = {
  eyebrow: 'Field notes and insights',
  title: 'Ideas shaped by the work of agriculture.',
  summary: 'Perspectives on research, partnerships and the places helping to strengthen Nigeria’s food system.',
  primaryAction: { label: 'Discuss a partnership', to: '/contact-us/?interest=partnership' },
  image: {
    src: `${mediaBase}/2025/01/DRB_6064-scaled.webp`,
    alt: 'Agricultural partners in conversation during field work',
    width: 2560,
    height: 1829,
  },
  imageCaption: 'Notes from the field, the market and our partnerships',
} as const satisfies PageHeroContent

export const blogPageContent = {
  seo: {
    title: 'Agricultural Insights and News | Heekmah Group',
    description:
      'Read Heekmah Group perspectives on agricultural research, partnerships, farmer support and food-system development in Nigeria.',
  },
  hero: blogHeroContent,
  news: {
    eyebrow: 'From the field',
    title: 'Ideas, field notes and useful context',
    action: {
      label: 'View all articles',
      to: '/blog/',
    },
  },
  callout: {
    kind: 'callout',
    id: 'share-an-idea',
    eyebrow: 'Work with Heekmah',
    title: 'Good agricultural ideas become useful through implementation.',
    body: 'Talk to our team about research, distribution, farmer support or a commercial partnership.',
    primaryAction: { label: 'Start a conversation', to: '/contact-us/?interest=partnership' },
    secondaryAction: { label: 'Call +234 905 555 4302', to: 'tel:+2349055554302' },
  },
  articleConversion: {
    eyebrow: 'Continue the conversation',
    title: 'Have a related project or partnership in mind?',
    body: 'Tell us what you are working on and where Heekmah Group may be able to contribute.',
    action: { label: 'Talk to our team', to: '/contact-us/?interest=partnership' },
  },
} as const satisfies BlogPageContent

export const termsPageContent = {
  seo: {
    title: 'Website Terms and Conditions | Heekmah Group',
    description: 'Terms governing use of the Heekmah Group website.',
  },
  eyebrow: 'Legal',
  title: 'Website terms and conditions',
  introduction:
    'These terms describe the basis on which visitors may use the Heekmah Group website and its published information.',
  reviewNotice:
    'These website terms apply alongside any separate written terms agreed for a product order, service or commercial relationship.',
  sections: [
    {
      title: 'Using this website',
      paragraphs: [
        'By accessing this website, you agree to use it lawfully and in a way that does not restrict or inhibit its use by others.',
        'Website content is provided for general information. It is not professional, legal, financial or agricultural advice for a specific situation.',
      ],
    },
    {
      title: 'Content and intellectual property',
      paragraphs: [
        'Unless otherwise stated, the website’s text, branding, graphics and other original materials belong to Heekmah Group or are used with permission.',
        'You may view and print reasonable extracts for personal, non-commercial use. Other reproduction, distribution or commercial use requires prior written permission.',
      ],
    },
    {
      title: 'Links and availability',
      paragraphs: [
        'Links to third-party websites are provided for convenience. Heekmah Group does not control their content, availability or privacy practices.',
        'We may update, suspend or withdraw parts of the website without notice. We do not promise that the site will always be available or free from errors.',
      ],
    },
    {
      title: 'Liability and governing law',
      paragraphs: [
        'To the extent permitted by law, Heekmah Group is not responsible for indirect loss arising solely from reliance on general website content or use of a third-party link.',
        'These terms are governed by the laws of the Federal Republic of Nigeria. Disputes should first be raised with Heekmah Group in good faith before other remedies are pursued.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [
        'Questions about these terms can be sent to info@heekmahgroup.com or addressed to No. 40, IBM Haruna Crescent, Utako, Abuja.',
      ],
    },
  ],
} as const satisfies LegalPageContent

export const refundPageContent = {
  seo: {
    title: 'Refund and Returns Policy | Heekmah Group',
    description: 'General information about returns and refunds for eligible Heekmah Group purchases.',
  },
  eyebrow: 'Customer information',
  title: 'Refund and returns policy',
  introduction:
    'This page summarises the return conditions currently published on the Heekmah Group website. Contact our team before returning any product.',
  reviewNotice:
    'Return eligibility depends on product condition, order type, delivery status and any written terms agreed for the transaction. Contact us before returning goods.',
  sections: [
    {
      title: 'Return window and eligibility',
      paragraphs: [
        'The current policy provides a 30-day return window from the date of purchase. An item must be unused, in its original condition and in its original packaging to be considered.',
        'Proof of purchase is required. Perishable or opened food products generally cannot be returned unless the product was supplied damaged, defective or incorrect.',
      ],
    },
    {
      title: 'How to request a return',
      paragraphs: [
        'Email info@heekmahgroup.com or call +234 905 555 4302 before sending anything back. Include the order details, reason for the request and photographs where the item is damaged or incorrect.',
        'The team will confirm whether the request is eligible and provide the correct return location and instructions.',
      ],
    },
    {
      title: 'Refunds and exchanges',
      paragraphs: [
        'Approved refunds should be processed after the returned item has been received and inspected. Processing times can depend on the original payment method and financial institution.',
        'Where appropriate and stock is available, a damaged, defective or incorrect item may be replaced instead of refunded.',
      ],
    },
    {
      title: 'Return delivery costs',
      paragraphs: [
        'The current policy states that customers are responsible for return delivery costs unless Heekmah Group supplied a damaged, defective or incorrect item. Delivery charges are not normally refundable.',
      ],
    },
  ],
} as const satisfies LegalPageContent

export const privacyPageContent = {
  seo: {
    title: 'Privacy Policy | Heekmah Group',
    description: 'How Heekmah Group handles information submitted through this website.',
  },
  eyebrow: 'Privacy',
  title: 'Privacy policy',
  introduction:
    'This policy explains the information Heekmah Group receives through this website and how we use and protect it.',
  reviewNotice:
    'This notice covers the public website and enquiry form. A separate agreement may apply when you become a customer, supplier, distributor, employee or commercial partner.',
  sections: [
    {
      title: 'Information we collect',
      paragraphs: [
        'When you send an enquiry, we collect the details you choose to provide, including your name, email address, telephone number, organisation, enquiry type and message.',
        'The website may also process limited technical information needed to deliver pages, protect the enquiry form from misuse and understand where an enquiry was submitted. Raw IP addresses are not stored with enquiry records.',
      ],
    },
    {
      title: 'How we use your information',
      paragraphs: [
        'We use enquiry information to respond, route your request to the appropriate team, keep an operational record of the conversation and protect the service from abuse.',
        'We do not sell personal information submitted through the website.',
      ],
    },
    {
      title: 'Sharing and service providers',
      paragraphs: [
        'Information may be handled by authorised Heekmah Group personnel and service providers that support our hosting, email or website operations. They should receive only the access needed to provide those services.',
        'We may also disclose information where required by law or to protect people, property or legal rights.',
      ],
    },
    {
      title: 'Retention and security',
      paragraphs: [
        'We keep enquiry records only for as long as they are reasonably needed to respond, manage the resulting relationship, meet record-keeping obligations or resolve a dispute. Records that are no longer needed should be securely deleted during regular administrative reviews.',
        'We limit administrative access and use reasonable technical and organisational safeguards. No internet service can guarantee absolute security.',
      ],
    },
    {
      title: 'Your choices and contact',
      paragraphs: [
        'You may ask about personal information you submitted, request a correction or request deletion where applicable. We may need to verify the request and may retain information that must be kept for legal or operational reasons.',
        'Send privacy questions or requests to info@heekmahgroup.com, call +234 905 555 4302, or write to No. 40, IBM Haruna Crescent, Utako, Abuja.',
      ],
    },
  ],
} as const satisfies LegalPageContent

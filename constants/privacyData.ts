export interface PrivacySection {
  id: string;
  title: string;
  content: string | string[];
  subsections?: {
    title: string;
    items: string[];
  }[];
  callout?: {
    icon: string;
    title: string;
    text: string;
  };
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      'Drip Pilot ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate lead management platform and related services (the "Service").',
      "By accessing or using our Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, do not use our Service.",
    ],
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    content:
      "We collect information to provide and improve our services efficiently.",
    subsections: [
      {
        title: "2.1 Personal Information",
        items: [
          "Name and contact information (email, phone number, address)",
          "Business information (company name, license numbers, brokerage affiliation)",
          "Account credentials (username, password)",
          "Payment information (processed securely through third-party payment processors)",
          "Communication preferences",
        ],
      },
      {
        title: "2.2 Lead Information",
        items: [
          "Lead contact details (name, phone number, email address)",
          "Property preferences and search criteria",
          "Communication history and interactions",
          "Lead source and acquisition date",
        ],
      },
      {
        title: "2.3 Automatically Collected Information",
        items: [
          "Device Information and Usage Data: We collect technical data, including your IP address, browser type, operating system, and interaction logs, to optimize service delivery and site security.",
          "Essential Functional Cookies: We utilize strictly necessary functional cookies primarily for session management and authentication purposes. These cookies are essential for the secure operation of the platform and to provide a consistent user experience.",
          "Browser Identification for Notifications: To provide real-time push notifications on your device, we utilize browser identification techniques (such as browser fingerprinting). This process is necessary to accurately route notifications to your specific device; disabling this functionality will prevent the delivery of real-time alerts.",
        ],
      },
    ],
  },
  {
    id: "information-usage",
    title: "3. How We Use Your Information",
    content: "We use the information we collect for the following purposes:",
    subsections: [
      {
        title: "Usage Purposes",
        items: [
          "Service Provision: To provide, maintain, and improve our lead management platform.",
          "Communication: To facilitate SMS and email communications between agents and leads.",
          "Account Management: To create and manage user accounts, process payments, and provide customer support.",
          "Security & Compliance: To detect, prevent, and address technical issues and security threats.",
        ],
      },
    ],
  },
  {
    id: "sharing",
    title: "4. Information Sharing and Disclosure",
    content: "We handle your information with strict confidentiality.",
    subsections: [
      {
        title: "4.1 Service Providers",
        items: [
          "Twilio: SMS messaging services and phone number management",
          "Mailgun: Email delivery services",
          "Cloud hosting providers: Data storage and platform infrastructure",
          "Payment processors: Secure payment processing",
        ],
      },
      {
        title: "4.2 Legal Requirements",
        items: [
          "We may disclose your information when required by law or to comply with legal processes, protect our rights, prevent fraud, or enforce our Terms of Service.",
        ],
      },
    ],
    callout: {
      icon: "ShieldCheck",
      title: "4.3 SMS Consent & Third-Party Marketing Disclosure",
      text: "Drip Pilot does not share, sell, rent, or otherwise disclose your mobile information (including phone numbers and SMS opt-in data) to third parties or affiliates for marketing or promotional purposes. SMS consent remains private.",
    },
  },
  {
    id: "responsibilities",
    title: "5. Lead Data and User Responsibilities",
    content: [
      "Drip Pilot is a platform that facilitates communication between sales professionals and their leads across a wide range of industries, including but not limited to real estate, insurance, automotive, home services, and SaaS.",
      "We do not directly collect consent from leads — this responsibility belongs to our users, who must ensure they have the proper consent before initiating contact.",
    ],
    subsections: [
      {
        title: "5.1 User Obligations",
        items: [
          "Only import leads who have provided valid consent to receive communication via SMS, email, or other supported channels.",
          "Maintain documentation of lead consent and opt-in records.",
          "Immediately honor all opt-out requests from leads.",
          "Comply with all applicable local, state, and federal regulations, including TCPA, CAN-SPAM, and carrier guidelines.",
        ],
      },
      {
        title: "5.2 Lead Rights",
        items: [
          "Opt-out by replying 'STOP' to any message.",
          "Request information about how your data is being used.",
          "Contact us directly to address any privacy concerns.",
          "Right to request deletion of your information.",
        ],
      },
    ],
  },
  {
    id: "security",
    title: "6. Data Security",
    content:
      "We implement appropriate technical and organizational security measures to protect your information.",
    subsections: [
      {
        title: "Security Measures",
        items: [
          "Technical: Encryption of data in transit and at rest, regular security audits, and access controls.",
          "Organizational: Secure data centers, employee training, and incident response procedures.",
        ],
      },
    ],
  },
  {
    id: "rights",
    title: "7. Your Privacy Rights",
    content:
      "Depending on your location, you may have certain rights regarding your personal information:",
    subsections: [
      {
        title: "Data Access & Control",
        items: [
          "Access your personal data and correct inaccurate information.",
          "Request data deletion and data portability.",
          "Object to or restrict certain processing.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "8. Contact Information",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:",
  },
  {
    id: "compliance",
    title: "9. Compliance and Certifications",
    content:
      "Our privacy practices are designed to comply with applicable laws and regulations:",
    subsections: [
      {
        title: "Regulations",
        items: [
          "CCPA",
          "GDPR",
          "TCPA",
          "CAN-SPAM Act",
          "Real Estate Regulations",
        ],
      },
    ],
  },
];

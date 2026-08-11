import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart upload',
        desc: 'Drag & drop your assets. We auto-optimize them for the best performance across all platforms.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Instant Design',
        desc: 'Our AI creates stunning visuals in seconds, saving you time and effort.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Create engaging video content in minutes, not hours.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$10',
        desc: 'Try the platform at no cost.',
        credits: '25',
        features: [
            '25 credits',
            'Standard quality',
            'No watermark',
            'Slower generation speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$29',
        desc: 'Creators & small teams.',
        credits: '80',
        features: [
            '80 credits',
            'HD quality',
            'No watermark',
            'Video generation',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Scale',
        price: '$99',
        desc: 'Scale across team and agencies.',
        credits: '300',
        features: [
            '300 credits',
            'FHD quality',
            'No watermark',
            'Faster generation speed',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does the AI Ads Generator work?',
        answer: 'We leverage cutting-edge AI technology to analyze your brand and target audience, then automatically generate compelling ad creatives that resonate with your customers.'
    },
    {
        question: 'Do I own the generated images?',
        answer: 'Yes, you retain full ownership of all images generated using our platform.'
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time with no hidden fees.'
    },
    {
        question: 'What input format do you support?',
        answer: 'We accept JPG, PNG, and WEBP formats for image uploads. For video synthesis, we support MP4 and MOV formats.'
    }
];

export const footerLinks = [
    {
        title: "Quick Links",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];
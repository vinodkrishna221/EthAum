export const PILOTS = [
    {
        id: '1',
        title: '30-Day Enterprise Access',
        companyName: 'AI Analytics Pro',
        price: 500,
        originalPrice: 5000,
        description: 'Full access to our enterprise analytics suit including predictive AI models and custom reporting. This pilot is designed for Series B+ companies looking to optimize their data stack.',
        shortDescription: 'Full access to our enterprise analytics suit including predictive AI models and custom reporting.',
        features: ['Unlimited Data Points', '3 Custom Models', 'Priority Support', 'API Access', 'Dedicated Success Manager'],
        spotsRemaining: 3,
        logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
        requirements: [
            'Must have existing data warehouse (Snowflake/BigQuery)',
            'Minimum 10k monthly active users',
            'Technical point of contact'
        ],
        deliverables: [
            'Full infrastructure audit',
            'Custom predictive model deployment',
            'Executive dashboard setup',
            '30-day ROI report'
        ]
    },
    {
        id: '2',
        title: 'Cloud Security Audit',
        companyName: 'SecureOps',
        price: 299,
        originalPrice: 1500,
        description: 'Comprehensive security audit of your AWS/Azure infrastructure with actionable report.',
        shortDescription: 'Comprehensive security audit of your AWS/Azure infrastructure with actionable report.',
        features: ['Full Infrastructure Scan', 'Compliance Check', 'Vulnerability Assessment'],
        spotsRemaining: 5,
        logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        requirements: ['AWS or Azure account access', 'Read-only IAM role'],
        deliverables: ['Security Assessment Report', 'Compliance Checklist', 'Remediation Plan']
    },
    {
        id: '3',
        title: 'HR Automation Suite',
        companyName: 'PeopleFlow',
        price: 99,
        originalPrice: 499,
        description: 'Automate your onboarding and offboarding processes with our AI-driven workflow engine.',
        shortDescription: 'Automate your onboarding and offboarding processes with our AI-driven workflow engine.',
        features: ['50 Employees', 'Slack Integration', 'Email Templates'],
        spotsRemaining: 12,
        logoUrl: '',
        requirements: ['HRIS system access', 'Slack workspace'],
        deliverables: ['Automated Onboarding Workflow', 'Employee Portal Setup', 'Manager Training']
    },
    {
        id: '4',
        title: 'Marketing Content AI',
        companyName: 'CopyGenius',
        price: 199,
        originalPrice: 800,
        description: 'Generate SEO-optimized blog posts and social media content in seconds.',
        shortDescription: 'Generate SEO-optimized blog posts and social media content in seconds.',
        features: ['100k Words/mo', 'SEO Analysis', 'Plagiarism Checker'],
        spotsRemaining: 8,
        logoUrl: '',
        requirements: ['Content strategy brief', 'Target keywords'],
        deliverables: ['30 SEO Articles', 'Social Media Calendar', 'Content Strategy Guide']
    },
    {
        id: '5',
        title: 'DevOps Pipeline Optimizer',
        companyName: 'BuildFaster',
        price: 999,
        originalPrice: 5000,
        description: 'Analyze and optimize your CI/CD pipelines to reduce build times by up to 50%.',
        shortDescription: 'Analyze and optimize your CI/CD pipelines to reduce build times by up to 50%.',
        features: ['GitHub/GitLab', 'Caching Strategy', 'Cost Analysis'],
        spotsRemaining: 2,
        logoUrl: '',
        requirements: ['CI/CD pipeline access', 'Build logs'],
        deliverables: ['Pipeline Optimization Report', 'Implementation Scripts', 'Cost Savings Analysis']
    }
];

/**
 * Review Verification Service
 * 
 * Provides basic AI-like verification logic for review authenticity.
 * This is a simplified implementation that can be enhanced with actual
 * ML models or external AI services in production.
 */

export interface VerificationResult {
    isAuthentic: boolean;
    confidenceScore: number; // 0-100
    flags: string[];
    checks: {
        contentQuality: CheckResult;
        spamDetection: CheckResult;
        authenticityScore: CheckResult;
    };
}

interface CheckResult {
    passed: boolean;
    score: number;
    details: string;
}

// Spam/low-quality patterns
const SPAM_PATTERNS = [
    /buy now/i,
    /click here/i,
    /limited time/i,
    /act now/i,
    /free money/i,
    /\$\$\$/,
    /!!!+/,
    /http[s]?:\/\/(?!.*ethaum)/i, // External links
];

const GENERIC_PHRASES = [
    'great product',
    'highly recommend',
    'best ever',
    'amazing product',
    'would recommend',
    'love it',
    'hate it',
    'worst ever',
    'terrible product',
    'don\'t buy',
];

/**
 * Check content quality - length, coherence, specificity
 */
function checkContentQuality(content: string, title?: string, pros?: string, cons?: string): CheckResult {
    const flags: string[] = [];
    let score = 100;

    // Check minimum content length
    if (content.length < 50) {
        score -= 30;
        flags.push('Content too short');
    } else if (content.length < 100) {
        score -= 15;
        flags.push('Content relatively short');
    }

    // Check for specific details (numbers, feature names, etc.)
    const hasNumbers = /\d+/.test(content);
    const hasSpecificTerms = /(?:feature|integration|dashboard|api|support|team|workflow|process)/i.test(content);

    if (!hasNumbers && !hasSpecificTerms) {
        score -= 20;
        flags.push('Lacks specific details');
    }

    // Check if pros and cons are both provided (indicates thoughtful review)
    if (pros && cons) {
        score += 10;
    } else if (!pros && !cons) {
        score -= 10;
        flags.push('No pros/cons provided');
    }

    // Check title quality
    if (title) {
        if (title.length < 10) {
            score -= 5;
            flags.push('Title too short');
        }
    } else {
        score -= 5;
        flags.push('No title provided');
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
        passed: score >= 50,
        score,
        details: flags.length > 0 ? flags.join('; ') : 'Content quality acceptable',
    };
}

/**
 * Detect spam patterns and promotional content
 */
function detectSpam(content: string, title?: string, pros?: string, cons?: string): CheckResult {
    const fullText = `${title || ''} ${content} ${pros || ''} ${cons || ''}`.toLowerCase();
    const flags: string[] = [];
    let score = 100;

    // Check for spam patterns
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(fullText)) {
            score -= 25;
            flags.push(`Spam pattern detected: ${pattern.source}`);
        }
    }

    // Check for excessive capitalization
    const capsRatio = (fullText.match(/[A-Z]/g) || []).length / fullText.length;
    if (capsRatio > 0.3) {
        score -= 15;
        flags.push('Excessive capitalization');
    }

    // Check for repetitive text
    const words = fullText.split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = uniqueWords.size / words.length;
    if (repetitionRatio < 0.5 && words.length > 10) {
        score -= 20;
        flags.push('High word repetition');
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
        passed: score >= 60,
        score,
        details: flags.length > 0 ? flags.join('; ') : 'No spam detected',
    };
}

/**
 * Calculate authenticity score based on content analysis
 */
function calculateAuthenticityScore(
    content: string,
    title?: string,
    pros?: string,
    cons?: string,
    rating?: number
): CheckResult {
    const fullText = `${title || ''} ${content} ${pros || ''} ${cons || ''}`.toLowerCase();
    const flags: string[] = [];
    let score = 100;

    // Check for overly generic phrases
    let genericCount = 0;
    for (const phrase of GENERIC_PHRASES) {
        if (fullText.includes(phrase.toLowerCase())) {
            genericCount++;
        }
    }
    if (genericCount > 2) {
        score -= genericCount * 10;
        flags.push(`Contains ${genericCount} generic phrases`);
    }

    // Check sentiment consistency
    // If rating is extreme (1 or 5) but content is neutral, flag it
    if (rating) {
        const positiveWords = (fullText.match(/(?:great|excellent|amazing|love|best|fantastic|wonderful|awesome)/gi) || []).length;
        const negativeWords = (fullText.match(/(?:terrible|awful|worst|hate|bad|horrible|poor|disappointing)/gi) || []).length;

        if (rating >= 4 && negativeWords > positiveWords) {
            score -= 20;
            flags.push('Rating inconsistent with content sentiment');
        }
        if (rating <= 2 && positiveWords > negativeWords) {
            score -= 20;
            flags.push('Rating inconsistent with content sentiment');
        }
    }

    // Check for balanced feedback (both positive and negative points)
    const hasBalancedFeedback = pros && cons && pros.length > 10 && cons.length > 10;
    if (hasBalancedFeedback) {
        score += 10;
    }

    // Check for first-person perspective (indicates personal experience)
    const firstPersonIndicators = /\b(I|we|my|our|me|us)\b/i.test(content);
    if (firstPersonIndicators) {
        score += 5;
    } else {
        score -= 10;
        flags.push('Lacks first-person perspective');
    }

    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));

    return {
        passed: score >= 50,
        score,
        details: flags.length > 0 ? flags.join('; ') : 'Review appears authentic',
    };
}

/**
 * Main verification function
 * Analyzes review content and returns verification result
 */
export function verifyReview(
    content: string,
    title?: string,
    pros?: string,
    cons?: string,
    rating?: number
): VerificationResult {
    const contentQuality = checkContentQuality(content, title, pros, cons);
    const spamDetection = detectSpam(content, title, pros, cons);
    const authenticityScore = calculateAuthenticityScore(content, title, pros, cons, rating);

    // Calculate overall confidence score (weighted average)
    const overallScore = Math.round(
        contentQuality.score * 0.3 +
        spamDetection.score * 0.35 +
        authenticityScore.score * 0.35
    );

    // Collect all flags
    const allFlags: string[] = [];
    if (!contentQuality.passed) allFlags.push(contentQuality.details);
    if (!spamDetection.passed) allFlags.push(spamDetection.details);
    if (!authenticityScore.passed) allFlags.push(authenticityScore.details);

    return {
        isAuthentic: overallScore >= 60 && spamDetection.passed,
        confidenceScore: overallScore,
        flags: allFlags,
        checks: {
            contentQuality,
            spamDetection,
            authenticityScore,
        },
    };
}

/**
 * Quick check if review should be auto-approved
 * Returns true if review passes all checks with high confidence
 */
export function shouldAutoApprove(verificationResult: VerificationResult): boolean {
    return (
        verificationResult.isAuthentic &&
        verificationResult.confidenceScore >= 80 &&
        verificationResult.checks.spamDetection.passed &&
        verificationResult.checks.contentQuality.passed
    );
}

/**
 * Quick check if review should be auto-rejected
 * Returns true if review clearly fails multiple checks
 */
export function shouldAutoReject(verificationResult: VerificationResult): boolean {
    return (
        !verificationResult.checks.spamDetection.passed &&
        verificationResult.confidenceScore < 40
    );
}

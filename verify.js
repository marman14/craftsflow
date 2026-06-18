const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'public');

const expectedPages = [
  'index.html',
  'services/index.html',
  'services/website-development/index.html',
  'services/landing-pages/index.html',
  'services/ecommerce/index.html',
  'services/ui-ux-design/index.html',
  'services/branding/index.html',
  'services/social-media-marketing/index.html',
  'services/social-media-management/index.html',
  'services/seo/index.html',
  'services/paid-ads/index.html',
  'services/email-marketing/index.html',
  'services/content-marketing/index.html',
  'services/virtual-assistant/index.html',
  'services/exclusive-leads/index.html',
  'services/appointment-setting/index.html',
  'services/crm-automation/index.html',
  'services/ai-phone-assistant/index.html',
  'services/ai-chat-assistant/index.html',
  'services/lead-follow-up/index.html',
  'services/reviews-reactivation/index.html',
  'services/agent-branding/index.html',
  'services/local-seo-social/index.html',
  'services/virtual-tours/index.html',
  'services/referral-network/index.html',
  'industries/realtors/index.html',
  'industries/builders/index.html',
  'industries/brokerages/index.html',
  'industries/local-business/index.html',
  'how-it-works/index.html',
  'pricing/index.html',
  'case-studies/index.html',
  'about/index.html',
  'faq/index.html',
  'contact/index.html',
  'invest/index.html',
  'case-studies/james-phoenix/index.html',
  'case-studies/dallas-builder/index.html',
  'case-studies/chicago-law-firm/index.html',
  'case-studies/sarah-austin/index.html',
  'case-studies/dallas-condos/index.html',
  'case-studies/dental-clinic/index.html'
];

let failed = false;

console.log('--- STARTING SITE VERIFICATION ---');

// 1. Verify existence of all expected pages
expectedPages.forEach(pagePath => {
  const fullPath = path.join(ROOT_DIR, pagePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`ERROR: Expected page does not exist: ${pagePath}`);
    failed = true;
  }
});

// 2. Perform HTML and link checks
expectedPages.forEach(pagePath => {
  const fullPath = path.join(ROOT_DIR, pagePath);
  if (!fs.existsSync(fullPath)) return;

  const content = fs.readFileSync(fullPath, 'utf8');

  // Verify exactly one <h1>
  const h1Matches = content.match(/<h1[\s>]/g);
  if (!h1Matches) {
    console.error(`ERROR: No <h1> found on: ${pagePath}`);
    failed = true;
  } else if (h1Matches.length > 1) {
    console.error(`ERROR: Multiple <h1> tags (${h1Matches.length}) found on: ${pagePath}`);
    failed = true;
  }

  // Verify Title exists
  if (!content.includes('<title>')) {
    console.error(`ERROR: No <title> tag found on: ${pagePath}`);
    failed = true;
  }

  // Verify Meta Description
  if (!content.includes('<meta name="description"')) {
    console.error(`ERROR: No meta description found on: ${pagePath}`);
    failed = true;
  }

  // Verify Canonical
  if (!content.includes('<link rel="canonical"')) {
    console.error(`ERROR: No canonical tag found on: ${pagePath}`);
    failed = true;
  }

  // Link Checker: Scan all href attributes
  const hrefRegex = /href="([^"]+)"/g;
  let match;
  const pageDir = path.dirname(fullPath);

  while ((match = hrefRegex.exec(content)) !== null) {
    const link = match[1];

    // Skip external links, anchors, and placeholders
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) {
      continue;
    }

    // Resolve relative path
    const resolvedPath = path.resolve(pageDir, link);
    
    // Check if path exists
    if (!fs.existsSync(resolvedPath)) {
      console.error(`ERROR: Broken link on [${pagePath}]: "${link}" -> resolved to non-existent path: ${path.relative(ROOT_DIR, resolvedPath)}`);
      failed = true;
    }
  }

  // Check all images have alt tags
  const imgRegex = /<img\s+([^>]+)>/g;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const attrs = imgMatch[1];
    if (!attrs.includes('alt=')) {
      console.warn(`WARNING: <img> tag lacks alt attribute on: ${pagePath} - snippet: <img ${attrs.substring(0, 40)}...`);
    }
  }
});

console.log('--- VERIFICATION COMPLETED ---');
if (failed) {
  console.log('Status: FAILED. Please review the errors listed above.');
  process.exit(1);
} else {
  console.log(`Status: PASSED. All ${expectedPages.length} pages successfully compiled and checked!`);
  process.exit(0);
}

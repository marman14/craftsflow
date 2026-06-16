const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const OUTPUT_DIR = __dirname;

// Read template files
let layoutTemplate, headerTemplate, footerTemplate;
try {
  layoutTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'layout.html'), 'utf8');
  headerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'header.html'), 'utf8');
  footerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'footer.html'), 'utf8');
} catch (err) {
  console.log('Templates not created yet. Builder will run but pages will be built once templates are created.');
}

// Helper to recursively find all files in a directory
function getFilesRecursive(dir, fileList = []) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function parseMetadata(content) {
  const metaRegex = /<!--\s*([\s\S]*?)\s*-->/;
  const match = content.match(metaRegex);
  const metadata = {
    title: 'Craftsflow | Premium Digital Growth',
    description: 'We grow real estate brands, builders, and businesses with exclusive leads, AI systems, world-class websites, and social media that converts.',
    breadcrumbs: 'Home'
  };

  let pageContent = content;

  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        metadata[key] = value;
      }
    });
    // Remove the comment block from page content
    pageContent = content.replace(metaRegex, '').trim();
  }

  return { metadata, pageContent };
}

function generateBreadcrumbsHTML(breadcrumbsStr, rootPrefix) {
  if (!breadcrumbsStr) return '';
  const parts = breadcrumbsStr.split('>').map(p => p.trim());
  let html = `<nav class="breadcrumbs" aria-label="Breadcrumb"><div class="breadcrumbs-container">`;
  
  parts.forEach((part, index) => {
    if (index > 0) {
      html += ` <span class="breadcrumb-separator" aria-hidden="true">/</span> `;
    }
    
    if (index === parts.length - 1) {
      html += `<span class="breadcrumb-current" aria-current="page">${part}</span>`;
    } else {
      let href = '';
      if (part.toLowerCase() === 'home') {
        href = rootPrefix + 'index.html';
      } else if (part.toLowerCase() === 'services') {
        href = rootPrefix + 'services/index.html';
      } else if (part.toLowerCase() === 'investment') {
        href = rootPrefix + 'pricing/index.html';
      } else if (part.toLowerCase() === 'industries') {
        href = '#'; // Non-clickable parent link
      } else {
        // Fallback guess based on name
        href = rootPrefix + `${part.toLowerCase().replace(/\s+/g, '-')}/index.html`;
      }
      html += `<a href="${href}" class="breadcrumb-link">${part}</a>`;
    }
  });
  
  html += `</div></nav>`;
  return html;
}

function build() {
  console.log('Compiling templates...');
  
  // Reload templates in case they changed
  try {
    layoutTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'layout.html'), 'utf8');
    headerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'header.html'), 'utf8');
    footerTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'footer.html'), 'utf8');
  } catch (err) {
    console.error('Error reading templates. Make sure templates folder contains layout.html, header.html, footer.html');
    return;
  }

  const files = getFilesRecursive(PAGES_DIR);
  console.log(`Found ${files.length} pages to compile.`);

  files.forEach(filePath => {
    // Relative path from pages directory
    const relativePath = path.relative(PAGES_DIR, filePath);
    const pathParts = relativePath.split(path.sep);
    
    // Determine output relative directory and prefix
    let outputDir = OUTPUT_DIR;
    let rootPrefix = './';
    let cleanUrlPath = '';
    
    if (pathParts.length > 1) {
      // It's in a subdirectory
      const subDirs = pathParts.slice(0, -1);
      outputDir = path.join(OUTPUT_DIR, ...subDirs);
      rootPrefix = '../'.repeat(subDirs.length);
      cleanUrlPath = subDirs.join('/') + '/';
    }
    
    // Get file name without extension
    const ext = path.extname(relativePath);
    const baseName = path.basename(relativePath, ext);
    
    let destPath;
    if (baseName === 'index') {
      destPath = path.join(outputDir, 'index.html');
    } else {
      // Put pages in their own subdirectories for clean URLs (except index.html)
      const pageSubDir = path.join(outputDir, baseName);
      if (!fs.existsSync(pageSubDir)) {
        fs.mkdirSync(pageSubDir, { recursive: true });
      }
      destPath = path.join(pageSubDir, 'index.html');
      rootPrefix = rootPrefix === './' ? '../' : rootPrefix + '../';
      cleanUrlPath += baseName + '/';
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const { metadata, pageContent } = parseMetadata(content);
    
    // Generate active nav states
    const activeStates = {
      activeHome: '',
      activeServices: '',
      activeIndustries: '',
      activeHow: '',
      activePricing: '',
      activeCase: '',
      activeAbout: '',
      activeFAQ: '',
      activeContact: ''
    };
    
    if (relativePath === 'index.html') {
      activeStates.activeHome = 'active';
    } else if (relativePath.startsWith('services')) {
      activeStates.activeServices = 'active';
    } else if (relativePath.startsWith('industries')) {
      activeStates.activeIndustries = 'active';
    } else if (relativePath.startsWith('how-it-works')) {
      activeStates.activeHow = 'active';
    } else if (relativePath.startsWith('pricing')) {
      activeStates.activePricing = 'active';
    } else if (relativePath.startsWith('case-studies')) {
      activeStates.activeCase = 'active';
    } else if (relativePath.startsWith('about')) {
      activeStates.activeAbout = 'active';
    } else if (relativePath.startsWith('faq')) {
      activeStates.activeFAQ = 'active';
    } else if (relativePath.startsWith('contact')) {
      activeStates.activeContact = 'active';
    }

    // Replace header menu active links
    let header = headerTemplate;
    Object.keys(activeStates).forEach(key => {
      header = header.replace(new RegExp(`{{${key}}}`, 'g'), activeStates[key]);
    });

    // Generate breadcrumbs HTML
    // Homepage does not show breadcrumbs
    const isHome = relativePath === 'index.html';
    const breadcrumbsHTML = isHome ? '' : generateBreadcrumbsHTML(metadata.breadcrumbs, rootPrefix);

    // Assemble page
    let pageHTML = layoutTemplate
      .replace(/{{title}}/g, metadata.title)
      .replace(/{{description}}/g, metadata.description)
      .replace(/{{rootPrefix}}/g, rootPrefix)
      .replace(/{{header}}/g, header)
      .replace(/{{footer}}/g, footerTemplate)
      .replace(/{{breadcrumbs}}/g, breadcrumbsHTML)
      .replace(/{{body}}/g, pageContent)
      .replace(/{{canonical}}/g, `https://craftsflow.com/${cleanUrlPath}`);

    // Clean up templates variables inside the footer/header
    pageHTML = pageHTML.replace(/{{rootPrefix}}/g, rootPrefix);

    // Ensure directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, pageHTML, 'utf8');
    console.log(`Generated: ${path.relative(OUTPUT_DIR, destPath)}`);
  });
  
  console.log('Build complete!');
}

if (require.main === module) {
  build();
}

module.exports = { build };

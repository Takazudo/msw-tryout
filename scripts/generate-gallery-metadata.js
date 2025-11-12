/**
 * Script to generate enriched metadata for gallery items
 * Run with: node scripts/generate-gallery-metadata.js
 */

const users = ['Bob', 'Alice', 'Takazudo'];

const descriptions = [
  'Just finished this amazing build!',
  'My modular case is finally complete',
  'Love how this turned out',
  'Working on my dream setup',
  'Another successful DIY project',
  'This case sounds incredible',
  'Finally got my rack layout perfect',
  'So happy with this build',
  'Custom case for my modules',
  'Been working on this for months',
  'My latest eurorack creation',
  'DIY modular synth case done',
  'This build exceeded my expectations',
  'Hand-crafted with love',
  'Perfect fit for my modules',
  'Clean cable management achieved',
  'Proud of this one',
  'Ready to make some noise',
  'My workspace is complete',
  'Custom panel design worked perfectly',
  'Time to patch some cables',
  'This setup is pure joy',
  'Built this beauty over the weekend',
  'My modular journey continues',
  'Sweet new case for the studio',
  'DIY eurorack at its finest',
  'The perfect size for my needs',
  'Love the finish on this one',
  'Great project to work on',
  'My synth corner is looking good',
];

const hashtags = [
  '#eurorack',
  '#modularsynth',
  '#DIY',
  '#synthesizer',
  '#DIYcase',
  '#modular',
  '#synth',
  '#eurorack',
  '#modularsynthesizer',
  '#synthcase',
  '#handmade',
  '#DIYaudio',
  '#musicproduction',
  '#electronicmusic',
  '#synthlife',
  '#gearpost',
  '#studiosetup',
  '#homestudio',
  '#musicgear',
  '#analogsynth',
  '#patchcables',
  '#rackcase',
  '#woodworking',
  '#maker',
  '#DIYproject',
  '#customcase',
  '#studioporn',
  '#geartalk',
];

/**
 * Get random item from array
 */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random date in 2024-2025
 */
function randomDate() {
  const start = new Date('2024-01-01T00:00:00Z');
  const end = new Date('2025-11-12T00:00:00Z');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

/**
 * Get random hashtags (3-10 unique tags)
 */
function randomHashtags() {
  const count = randomInt(3, 10);
  const selected = [];
  const available = [...hashtags];

  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
  }

  return selected;
}

/**
 * Generate metadata for a single item
 */
function generateMetadata() {
  return {
    user: randomItem(users),
    description: randomItem(descriptions),
    created_at: randomDate(),
    hashtags: randomHashtags(),
  };
}

// Read the gallery data file
const fs = require('fs');
const path = require('path');

const galleryDataPath = path.join(__dirname, '../netlify/functions/gallery-data.js');
const content = fs.readFileSync(galleryDataPath, 'utf-8');

// Extract the galleryData array
const arrayMatch = content.match(/export const galleryData = \[([\s\S]*?)\];/);
if (!arrayMatch) {
  console.error('Could not find galleryData array');
  process.exit(1);
}

// Parse the existing data
const dataString = '[' + arrayMatch[1] + ']';
const galleryData = eval(dataString);

console.log(`Found ${galleryData.length} items`);

// Add metadata to each item
const enrichedData = galleryData.map((item) => ({
  ...item,
  ...generateMetadata(),
}));

// Generate the new file content
const newArrayContent = enrichedData
  .map((item, index) => {
    const lines = [
      '  {',
      `    slug: '${item.slug}',`,
      `    imageAlt: '${item.imageAlt}',`,
      `    blurhash: '${item.blurhash}',`,
      `    user: '${item.user}',`,
      `    description: '${item.description}',`,
      `    created_at: '${item.created_at}',`,
      `    hashtags: [${item.hashtags.map((tag) => `'${tag}'`).join(', ')}],`,
      '  }',
    ];
    return lines.join('\n');
  })
  .join(',\n');

const newContent = `// Gallery data for Takazudo Modular Panels
// Contains 260 images with slugs, blurhash values, and metadata

export const galleryData = [
${newArrayContent}
];

/**
 * Get thumbnail URL for a given slug
 */
export function getThumbnailUrl(slug) {
  return \`https://takazudomodular.com/static/images/p/\${slug}/600w.webp\`;
}

/**
 * Get enlarged image URL for a given slug
 */
export function getEnlargedImageUrl(slug) {
  return \`https://takazudomodular.com/static/images/p/\${slug}/1600w.webp\`;
}

/**
 * Find a gallery item by its slug
 */
export function getGalleryItemBySlug(slug) {
  return galleryData.find((item) => item.slug === slug);
}
`;

// Write the new file
fs.writeFileSync(galleryDataPath, newContent, 'utf-8');
console.log(`✓ Updated ${galleryDataPath}`);
console.log(`✓ Added metadata to ${enrichedData.length} items`);

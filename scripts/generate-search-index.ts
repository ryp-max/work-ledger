import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface SearchItem {
  title: string;
  slug: string;
  dateRange: string;
  tags: string[];
  shipped?: string;
  inProgress?: string;
  grain?: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'weeks');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'search-index.json');

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

function extractSection(content: string, heading: string): string | undefined {
  const regex = new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = content.match(regex);
  if (match) {
    return match[1].trim().slice(0, 200); // Limit to 200 chars
  }
  return undefined;
}

function generateSearchIndex(): void {
  const items: SearchItem[] = [];
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content directory found, creating empty index');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([]));
    return;
  }
  
  const years = fs.readdirSync(CONTENT_DIR).filter(dir => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && /^\d{4}$/.test(dir);
  });
  
  for (const year of years) {
    const yearDir = path.join(CONTENT_DIR, year);
    const files = fs.readdirSync(yearDir).filter(f => f.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(yearDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const weekNum = parseInt(file.replace('week-', '').replace('.mdx', ''));
      
      items.push({
        title: data.title || `Week ${weekNum}`,
        slug: `/weeks/${year}/${weekNum.toString().padStart(2, '0')}`,
        dateRange: formatDateRange(data.date_start, data.date_end),
        tags: data.tags || [],
        shipped: extractSection(content, 'Shipped'),
        inProgress: extractSection(content, 'In Progress'),
        grain: extractSection(content, 'Grain'),
      });
    }
  }
  
  // Sort newest first
  items.sort((a, b) => {
    const aWeek = parseInt(a.slug.split('/').pop() || '0');
    const bWeek = parseInt(b.slug.split('/').pop() || '0');
    const aYear = parseInt(a.slug.split('/')[2] || '0');
    const bYear = parseInt(b.slug.split('/')[2] || '0');
    
    if (aYear !== bYear) return bYear - aYear;
    return bWeek - aWeek;
  });
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2));
  console.log(`Generated search index with ${items.length} items`);
}

generateSearchIndex();

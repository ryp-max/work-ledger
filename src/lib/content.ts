import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { WeekFrontmatterSchema, type WeekMeta, type WeekEntry, type TagMeta } from './schemas';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'weeks');

function getWeekSlug(year: number, week: number): string {
  return `/weeks/${year}/${week.toString().padStart(2, '0')}`;
}

function parseWeekFile(filePath: string): WeekEntry | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    const parsed = WeekFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      console.error(`Invalid frontmatter in ${filePath}:`, parsed.error);
      return null;
    }
    
    const frontmatter = parsed.data;
    
    return {
      year: frontmatter.year,
      week: frontmatter.week,
      dateStart: frontmatter.date_start,
      dateEnd: frontmatter.date_end,
      status: frontmatter.status,
      title: frontmatter.title,
      tags: frontmatter.tags,
      slug: getWeekSlug(frontmatter.year, frontmatter.week),
      frontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

export function getAllWeeks(): WeekMeta[] {
  const weeks: WeekMeta[] = [];
  
  if (!fs.existsSync(CONTENT_DIR)) {
    return weeks;
  }
  
  const years = fs.readdirSync(CONTENT_DIR).filter(dir => {
    const fullPath = path.join(CONTENT_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && /^\d{4}$/.test(dir);
  });
  
  for (const year of years) {
    const yearDir = path.join(CONTENT_DIR, year);
    const files = fs.readdirSync(yearDir).filter(f => f.endsWith('.mdx'));
    
    for (const file of files) {
      const entry = parseWeekFile(path.join(yearDir, file));
      if (entry) {
        const { frontmatter, content, ...meta } = entry;
        weeks.push(meta);
      }
    }
  }
  
  // Sort newest first (by year desc, then week desc)
  return weeks.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.week - a.week;
  });
}

export function getWeeksByYear(year: number): WeekMeta[] {
  return getAllWeeks().filter(w => w.year === year);
}

export function getWeek(year: number, week: number): WeekEntry | null {
  const yearDir = path.join(CONTENT_DIR, year.toString());
  const fileName = `week-${week.toString().padStart(2, '0')}.mdx`;
  const filePath = path.join(yearDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return parseWeekFile(filePath);
}

export function getAllYears(): number[] {
  const weeks = getAllWeeks();
  const years = [...new Set(weeks.map(w => w.year))];
  return years.sort((a, b) => b - a);
}

export function getAllTags(): TagMeta[] {
  const weeks = getAllWeeks();
  const tagCounts = new Map<string, number>();
  
  for (const week of weeks) {
    for (const tag of week.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  
  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getLatestWeek(): WeekMeta | null {
  const weeks = getAllWeeks();
  return weeks[0] || null;
}

export function getWeeksByTag(tag: string): WeekMeta[] {
  return getAllWeeks().filter(w => w.tags.includes(tag));
}

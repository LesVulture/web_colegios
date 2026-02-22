import { FABRICS } from './fabrics';
import { CATEGORIES } from './categories';
import { TECHNOLOGIES } from './technologies';

export function getFabricsByCategory(categoryId: string): typeof FABRICS[number][] {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  const ids: readonly string[] = category.fabricIds;
  return FABRICS.filter(f => ids.includes(f.id));
}

export function getCategoriesByFabric(fabricId: string): typeof CATEGORIES[number][] {
  return CATEGORIES.filter(c => {
    const ids: readonly string[] = c.fabricIds;
    return ids.includes(fabricId);
  });
}

export function getFabricBySlug(slug: string): typeof FABRICS[number] | undefined {
  return FABRICS.find(f => f.id === slug);
}

export function getFabricByBase(base: string): typeof FABRICS[number] | undefined {
  return FABRICS.find(f => f.base === base);
}

export function getTechnologyById(id: string): typeof TECHNOLOGIES[number] | undefined {
  return TECHNOLOGIES.find(t => t.id === id);
}

export function getCategoryBySlug(slug: string): typeof CATEGORIES[number] | undefined {
  return CATEGORIES.find(c => c.id === slug);
}

export function getFabricsByTechnology(techId: string): typeof FABRICS[number][] {
  return FABRICS.filter(f => {
    const techs: readonly string[] = f.technologies;
    return techs.includes(techId);
  });
}

export function parseNumericWeight(weight: string): number {
  const match = weight.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function parseNumericWidth(width: string): number {
  const match = width.match(/^(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

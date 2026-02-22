import { FABRICS } from './fabrics';
import { CATEGORIES } from './categories';
import { TECHNOLOGIES } from './technologies';
import type { Fabric, Category, Technology } from './types';

// Pre-built Maps for O(1) lookups
const FABRIC_MAP = new Map<string, Fabric>(FABRICS.map(f => [f.id, f]));
const FABRIC_BASE_MAP = new Map<string, Fabric>(FABRICS.map(f => [f.base, f]));
const TECH_MAP = new Map<string, Technology>(TECHNOLOGIES.map(t => [t.id, t]));
const CATEGORY_MAP = new Map<string, Category>(CATEGORIES.map(c => [c.id, c]));

// Hoisted regex — avoid re-creation per call
const LEADING_INT_RE = /^(\d+)/;

export function getFabricsByCategory(categoryId: string): Fabric[] {
  const category = CATEGORY_MAP.get(categoryId);
  if (!category) return [];
  const idSet = new Set<string>(category.fabricIds);
  return FABRICS.filter(f => idSet.has(f.id));
}

export function getCategoriesByFabric(fabricId: string): Category[] {
  return CATEGORIES.filter(c => {
    const ids: readonly string[] = c.fabricIds;
    return ids.includes(fabricId);
  });
}

export function getFabricBySlug(slug: string): Fabric | undefined {
  return FABRIC_MAP.get(slug);
}

export function getFabricByBase(base: string): Fabric | undefined {
  return FABRIC_BASE_MAP.get(base);
}

export function getTechnologyById(id: string): Technology | undefined {
  return TECH_MAP.get(id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORY_MAP.get(slug);
}

export function getFabricsByTechnology(techId: string): Fabric[] {
  return FABRICS.filter(f => {
    const techs: readonly string[] = f.technologies;
    return techs.includes(techId);
  });
}

export function parseNumericWeight(weight: string): number {
  const match = weight.match(LEADING_INT_RE);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseNumericWidth(width: string): number {
  const match = width.match(LEADING_INT_RE);
  return match ? parseInt(match[1], 10) : 0;
}

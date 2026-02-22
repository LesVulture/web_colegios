'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'
import { FabricCard } from './fabric-card'
import { TechIcon } from './tech-icon'
import { TECHNOLOGIES } from '@/lib/content'
import { parseNumericWeight, parseNumericWidth } from '@/lib/content/helpers'
import { cn } from '@/lib/utils'
import type { Fabric } from '@/lib/content/types'

type SortField = 'weight' | 'width' | null
type SortDirection = 'asc' | 'desc'

export function FilterableFabricGrid({
  fabrics,
  categorySlug,
}: {
  fabrics: readonly Fabric[]
  categorySlug: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      setSearchQuery(value)
    }, 250)
  }

  const fuse = useMemo(
    () =>
      new Fuse([...fabrics], {
        keys: ['name'],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [fabrics]
  )

  const availableTechs = useMemo(() => {
    const techIds = new Set(fabrics.flatMap((f) => [...f.technologies]))
    return TECHNOLOGIES.filter((t) => techIds.has(t.id))
  }, [fabrics])

  const filteredFabrics = useMemo(() => {
    let result: Fabric[] =
      searchQuery.trim().length >= 2
        ? fuse.search(searchQuery).map((r) => r.item)
        : [...fabrics]

    if (selectedTechs.size > 0) {
      result = result.filter((f) =>
        f.technologies.some((t) => selectedTechs.has(t))
      )
    }

    if (sortField !== null) {
      const parseFn =
        sortField === 'weight' ? parseNumericWeight : parseNumericWidth
      result = result.toSorted((a, b) => {
        const va = parseFn(a[sortField])
        const vb = parseFn(b[sortField])
        return sortDirection === 'asc' ? va - vb : vb - va
      })
    }

    return result
  }, [fabrics, searchQuery, selectedTechs, sortField, sortDirection, fuse])

  function toggleTech(techId: string) {
    setSelectedTechs((prev) => {
      const next = new Set(prev)
      if (next.has(techId)) {
        next.delete(techId)
      } else {
        next.add(techId)
      }
      return next
    })
  }

  function clearFilters() {
    setSearchQuery('')
    setInputValue('')
    setSelectedTechs(new Set())
    setSortField(null)
  }

  function toggleSort(field: 'weight' | 'width') {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const hasActiveFilters = searchQuery || selectedTechs.size > 0 || sortField

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="search"
          name="fabric-search"
          autoComplete="off"
          aria-label="Buscar tela"
          value={inputValue}
          onChange={handleSearchChange}
          placeholder="Buscar tela…"
          className="w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2.5 text-sm min-h-[44px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
        />
        {inputValue && (
          <button
            onClick={() => {
              setInputValue('')
              setSearchQuery('')
            }}
            aria-label="Limpiar búsqueda"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center size-10 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Technology filter chips */}
      {availableTechs.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {availableTechs.map((tech) => (
            <button
              key={tech.id}
              onClick={() => toggleTech(tech.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium min-h-[44px] transition-colors',
                selectedTechs.has(tech.id)
                  ? 'bg-brand-primary text-brand-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              )}
            >
              <TechIcon icon={tech.icon} size={14} />
              {tech.name}
            </button>
          ))}
        </div>
      )}

      {/* Sort controls + result count row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar:</span>
          {(['weight', 'width'] as const).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm min-h-[44px] transition-colors',
                sortField === field
                  ? 'bg-brand-primary text-brand-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              )}
            >
              {field === 'weight' ? 'Gramaje' : 'Ancho'}
              {sortField === field && (
                <span className="text-xs">
                  {sortDirection === 'asc' ? '\u2191' : '\u2193'}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {filteredFabrics.length} de {fabrics.length} telas
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-brand-primary underline hover:text-brand-primary/80 min-h-[44px] px-1"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Fabric grid or empty state */}
      {filteredFabrics.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {filteredFabrics.map((fabric) => (
            <FabricCard
              key={fabric.id}
              fabric={fabric}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No se encontraron telas con estos filtros.
          </p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-brand-primary underline hover:text-brand-primary/80 min-h-[44px] px-2"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}

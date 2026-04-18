"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZES = [10, 20, 50, 100]

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)
  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <div className="flex flex-col-reverse items-center justify-between gap-4 pt-6 sm:flex-row">
      <div className="text-eyebrow tabular text-muted-foreground/70">
        {total === 0 ? (
          "No results"
        ) : (
          <>
            Showing <span className="text-foreground">{start}</span>–
            <span className="text-foreground">{end}</span> of{" "}
            <span className="text-foreground">{total}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-eyebrow-sm text-muted-foreground/70">
            Per page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger size="sm" className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={isFirst}
            onClick={() => onPageChange(page - 1)}
            className="cursor-pointer"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={14}
              strokeWidth={1.8}
            />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-eyebrow-sm tabular px-3 text-muted-foreground">
            <span className="text-foreground">{page}</span>{" "}
            <span className="text-muted-foreground/50">/</span> {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={isLast}
            onClick={() => onPageChange(page + 1)}
            className="cursor-pointer"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              strokeWidth={1.8}
            />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchInputProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  placeholder?: string
  delay?: number
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search questions...",
  delay = 300,
}: SearchInputProps) {
  const [local, setLocal] = useState(value ?? "")
  const isFirstRender = useRef(true)

  // Sync external value -> local (e.g. URL change, reset)
  useEffect(() => {
    setLocal(value ?? "")
  }, [value])

  // Debounce local -> onChange
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const trimmed = local.trim()
    const next = trimmed === "" ? undefined : trimmed
    if (next === value) return

    const t = setTimeout(() => onChange(next), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local])

  return (
    <div className="relative w-full max-w-sm">
      <HugeiconsIcon
        icon={Search01Icon}
        size={15}
        strokeWidth={1.6}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9 pr-8 text-[13px]"
      />
      {local && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            setLocal("")
            onChange(undefined)
          }}
          className="absolute right-1.5 top-1/2 size-6 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={11} strokeWidth={1.8} />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

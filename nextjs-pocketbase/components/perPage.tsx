'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { changePerPage } from "@/app/actions"

export function PerPageSelect({ 
  currentPerPage 
}: { 
  currentPerPage: number 
}) {
  const [perPage, setPerPage] = useState(currentPerPage)

  const handlePerPageChange = async (value: string) => {
    setPerPage(Number(value))
    const formData = new FormData()
    formData.append('perPage', value)
    await changePerPage(formData)
  }

  return (
    <Select 
      value={perPage.toString()} 
      onValueChange={handlePerPageChange}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[5, 10, 15, 20].map((num) => (
          <SelectItem key={num} value={num.toString()}>
            {num}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
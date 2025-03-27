// app/tasks/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function changePage(formData: FormData) {
  const page = Number(formData.get('page'))
  const totalPages = Number(formData.get('totalPages'))
  const direction = formData.get('direction')
  const currentPerPage = Number(formData.get('perPage'))

  let newPage = page

  if (direction === 'prev') {
    newPage = Math.max(1, page - 1)
  } else if (direction === 'next') {
    newPage = Math.min(totalPages, page + 1)
  }

  redirect(`/page=${newPage}&perPage=${currentPerPage}`)
}

export async function changePerPage(formData: FormData) {
  const perPage = formData.get('perPage')
  redirect(`/page=1&perPage=${perPage}`)
}
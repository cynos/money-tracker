export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDecimal(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDateMonth(isoString: string): string {
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
  }).format(date) // hasil: "23/09"
}

export function formatDateTime(dateInput) {
  const date = new Date(dateInput)

  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12

  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 0-based
  const day = date.getDate()

  return `${hour12}:${minutes} ${ampm} ${year}/${month}/${day}`
}

export function formatIsoToTimeDate(isoString: string): string {
  const date = new Date(isoString)

  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const day = date.getDate()
  const month = date.getMonth() + 1 // karena bulan mulai dari 0

  return `${hours}:${minutes} ${day}/${month}`
}

export function getInitial(text, uppercase = true) {
  if (!text) return ''
  const trimmed = text.trim()
  if (!trimmed) return ''
  const firstChar = trimmed.charAt(0)
  return uppercase ? firstChar.toUpperCase() : firstChar
}

export function formDataToNestedObject(
  form: HTMLFormElement,
): Record<string, string | object | string[]> {
  const formData = new FormData(form)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: Record<string, any> = {}

  formData.forEach((value, key) => {
    const isArray = key.endsWith('[]')
    const keys = isArray ? key.slice(0, -2).split('.') : key.split('.')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: Record<string, any> = obj

    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        if (isArray) {
          if (!Array.isArray(current[k])) {
            current[k] = []
          }
          current[k].push(value.toString())
        } else {
          current[k] = value.toString()
        }
      } else {
        current[k] = current[k] || {}
        current = current[k]
      }
    })
  })

  return obj
}

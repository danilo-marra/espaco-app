export const dateFormatter = new Intl.DateTimeFormat('pt-BR')
export const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

// Função para formatar a máscara de hora
export const maskTime = (value: string) => {
  // Remove all non-digits
  let maskedValue = value.replace(/\D/g, '')

  // Format as HH:MM
  if (value.length >= 2) {
    const hours = maskedValue.slice(0, 2)
    const minutes = maskedValue.slice(2, 4)

    // Validate hours
    if (Number.parseInt(hours) > 23) {
      maskedValue = `23${maskedValue.slice(2)}`
    }

    // Validate minutes
    if (Number.parseInt(minutes) > 59) {
      maskedValue = `${maskedValue.slice(0, 2)}59`
    }

    return (
      maskedValue.slice(0, 2) +
      (maskedValue.length > 2 ? `:${maskedValue.slice(2, 4)}` : '')
    )
  }

  return value
}

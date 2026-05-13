export const MENU = [
  {
    id: 1,
    name: 'Brookies',
    price: 22000,
    emoji: '🍪',
    description: 'Perpaduan brownie & cookie',
    color: '#D4537E',
    ingredients: { tepung: 90, telur: 2, butter: 60, gula: 70, coklat: 40 },
  },
  {
    id: 2,
    name: 'Brownies',
    price: 25000,
    emoji: '🍫',
    description: 'Classic fudgy brownies',
    color: '#8B4513',
    ingredients: { tepung: 100, telur: 2, butter: 50, gula: 80, coklat: 60 },
  },
  {
    id: 3,
    name: 'Matcha Brownies',
    price: 28000,
    emoji: '🍵',
    description: 'Brownies matcha premium',
    color: '#639922',
    ingredients: { tepung: 100, telur: 2, butter: 50, gula: 75, matcha: 20 },
  },
]

export const INGREDIENTS_META = {
  tepung:  { label: 'Tepung',        unit: 'g' },
  telur:   { label: 'Telur',         unit: 'butir' },
  butter:  { label: 'Butter',        unit: 'g' },
  gula:    { label: 'Gula',          unit: 'g' },
  coklat:  { label: 'Coklat Bubuk',  unit: 'g' },
  matcha:  { label: 'Matcha Powder', unit: 'g' },
}

export const DAYS_ID    = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
export const MONTHS_ID  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

export function formatDateID(date = new Date()) {
  return `${DAYS_ID[date.getDay()]}, ${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`
}

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export const PIN = '1234'

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { FC } from 'hono/jsx'

const app = new Hono()

// Enable CORS
app.use('/api/*', cors())

// Mock data для демонстрации
const mockVehicles = [
  {
    id: 1,
    name: 'HOWO 165',
    plate: 'А123ВС',
    type: 'Самосвал',
    driver: 'Иванов И.И.',
    driverId: 1,
    fuelLevel: 75,
    status: 'active',
    mileage: 125000,
    lastService: 124500,
    nextService: 130000,
    location: 'Объект №5',
    latitude: 42.8746,
    longitude: 74.5698,
    photos: ['/static/images/howo.jpg', '/static/images/howo2.jpg'],
    maintenanceCostPerMonth: 25000,
    fuelConsumptionPerKm: 0.35,
    avgKmPerMonth: 3000
  },
  {
    id: 2,
    name: 'Камаз 6520',
    plate: 'В456СЕ',
    type: 'Самосвал',
    driver: 'Петров П.П.',
    driverId: 2,
    fuelLevel: 45,
    status: 'active',
    mileage: 98000,
    lastService: 95000,
    nextService: 105000,
    location: 'Объект №3',
    latitude: 42.8650,
    longitude: 74.5900,
    photos: ['/static/images/kamaz.jpg'],
    maintenanceCostPerMonth: 22000,
    fuelConsumptionPerKm: 0.30,
    avgKmPerMonth: 2500
  },
  {
    id: 3,
    name: 'Caterpillar 320',
    plate: 'Е789КМ',
    type: 'Экскаватор',
    driver: 'Сидоров С.С.',
    driverId: 3,
    fuelLevel: 20,
    status: 'warning',
    mileage: 5600,
    lastService: 5000,
    nextService: 6000,
    location: 'Объект №1',
    latitude: 42.8820,
    longitude: 74.6100,
    photos: ['/static/images/cat.jpg'],
    maintenanceCostPerMonth: 30000,
    fuelConsumptionPerKm: 0.40,
    avgKmPerMonth: 800
  }
]

const mockDrivers = [
  {
    id: 1,
    name: 'Иванов И.И.',
    phone: '+996 555 111222',
    telegram: '@ivanov_driver',
    experience: '7 лет',
    license: 'CE',
    birthDate: '1985-05-15',
    passportSeries: 'AN',
    passportNumber: '1234567',
    passportIssueDate: '2015-06-20',
    passportIssuer: 'МВД КР',
    photo: '/static/images/driver1.jpg',
    passportPhoto: '/static/images/passport1.jpg',
    licensePhoto: '/static/images/license1.jpg',
    address: 'г. Бишкек, ул. Ленина 123',
    status: 'active',
    hireDate: '2020-03-15',
    currentVehicle: 'HOWO 165 (А123ВС)'
  },
  {
    id: 2,
    name: 'Петров П.П.',
    phone: '+996 777 333444',
    telegram: '@petrov_driver',
    experience: '10 лет',
    license: 'CE',
    birthDate: '1980-08-22',
    passportSeries: 'AN',
    passportNumber: '7654321',
    passportIssueDate: '2010-04-15',
    passportIssuer: 'МВД КР',
    photo: '/static/images/driver2.jpg',
    passportPhoto: '/static/images/passport2.jpg',
    licensePhoto: '/static/images/license2.jpg',
    address: 'г. Бишкек, ул. Советская 45',
    status: 'active',
    hireDate: '2018-06-01',
    currentVehicle: 'Камаз 6520 (В456СЕ)'
  },
  {
    id: 3,
    name: 'Сидоров С.С.',
    phone: '+996 555 999888',
    telegram: '@sidorov_driver',
    experience: '12 лет',
    license: 'D',
    birthDate: '1978-12-10',
    passportSeries: 'AN',
    passportNumber: '9876543',
    passportIssueDate: '2008-09-25',
    passportIssuer: 'МВД КР',
    photo: '/static/images/driver3.jpg',
    passportPhoto: '/static/images/passport3.jpg',
    licensePhoto: '/static/images/license3.jpg',
    address: 'г. Бишкек, пр. Манаса 78',
    status: 'active',
    hireDate: '2017-01-20',
    currentVehicle: 'Caterpillar 320 (Е789КМ)'
  }
]

const mockFuelings = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: 'HOWO 165',
    vehiclePlate: 'А123ВС',
    driver: 'Иванов И.И.',
    liters: 250,
    amount: 18750,
    date: '2025-11-27 08:30',
    location: 'АЗС №5',
    latitude: 42.8746,
    longitude: 74.5698,
    photo: '/static/images/fueling1.jpg'
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleName: 'Камаз 6520',
    vehiclePlate: 'В456СЕ',
    driver: 'Петров П.П.',
    liters: 180,
    amount: 13500,
    date: '2025-11-27 10:15',
    location: 'АЗС №3',
    latitude: 42.8650,
    longitude: 74.5900,
    photo: '/static/images/fueling2.jpg'
  },
  {
    id: 3,
    vehicleId: 1,
    vehicleName: 'HOWO 165',
    vehiclePlate: 'А123ВС',
    driver: 'Иванов И.И.',
    liters: 230,
    amount: 17250,
    date: '2025-11-25 14:20',
    location: 'АЗС №5',
    latitude: 42.8746,
    longitude: 74.5698,
    photo: '/static/images/fueling1.jpg'
  },
  {
    id: 4,
    vehicleId: 3,
    vehicleName: 'Caterpillar 320',
    vehiclePlate: 'Е789КМ',
    driver: 'Сидоров С.С.',
    liters: 150,
    amount: 11250,
    date: '2025-11-24 09:45',
    location: 'АЗС №1',
    latitude: 42.8820,
    longitude: 74.6100,
    photo: '/static/images/fueling3.jpg'
  }
]

const mockRepairs = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: 'HOWO 165',
    vehiclePlate: 'А123ВС',
    driver: 'Иванов И.И.',
    description: 'Замена масла и фильтров',
    parts: [
      { name: 'Масло моторное', quantity: 20, unit: 'л', price: 150, total: 3000 },
      { name: 'Фильтр масляный', quantity: 1, unit: 'шт', price: 800, total: 800 },
      { name: 'Фильтр воздушный', quantity: 1, unit: 'шт', price: 700, total: 700 }
    ],
    partsCost: 4500,
    laborCost: 2000,
    totalCost: 6500,
    date: '2025-11-25',
    photos: ['/static/images/repair1.jpg', '/static/images/repair2.jpg'],
    status: 'completed',
    mechanic: 'Сергеев М.М.'
  },
  {
    id: 2,
    vehicleId: 3,
    vehicleName: 'Caterpillar 320',
    vehiclePlate: 'Е789КМ',
    driver: 'Сидоров С.С.',
    description: 'Ремонт гидравлики',
    parts: [
      { name: 'Шланг гидравлический', quantity: 2, unit: 'шт', price: 3500, total: 7000 },
      { name: 'Уплотнители комплект', quantity: 1, unit: 'компл', price: 1500, total: 1500 }
    ],
    partsCost: 8500,
    laborCost: 5000,
    totalCost: 13500,
    date: '2025-11-26',
    photos: ['/static/images/repair3.jpg'],
    status: 'in_progress',
    mechanic: 'Сергеев М.М.'
  },
  {
    id: 3,
    vehicleId: 2,
    vehicleName: 'Камаз 6520',
    vehiclePlate: 'В456СЕ',
    driver: 'Петров П.П.',
    description: 'Замена тормозных колодок',
    parts: [
      { name: 'Колодки тормозные передние', quantity: 1, unit: 'компл', price: 4200, total: 4200 },
      { name: 'Жидкость тормозная', quantity: 2, unit: 'л', price: 350, total: 700 }
    ],
    partsCost: 4900,
    laborCost: 3000,
    totalCost: 7900,
    date: '2025-11-22',
    photos: ['/static/images/repair4.jpg'],
    status: 'completed',
    mechanic: 'Сергеев М.М.'
  }
]

const mockDriverRequests = [
  {
    id: 1,
    name: 'Алексеев А.А.',
    phone: '+996 555 123456',
    telegram: '@alexeev_driver',
    experience: '5 лет',
    license: 'CE',
    date: '2025-11-27 09:00',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Николаев Н.Н.',
    phone: '+996 777 654321',
    telegram: '@nikolaev_driver',
    experience: '8 лет',
    license: 'D',
    date: '2025-11-26 15:30',
    status: 'pending'
  }
]

const mockVehiclePurchaseRequests = [
  {
    id: 1,
    vehicleType: 'Самосвал',
    brand: 'HOWO',
    model: 'ZZ3257N3847A',
    quantity: 2,
    estimatedPrice: 4500000,
    totalCost: 9000000,
    reason: 'Расширение парка для нового объекта',
    requestedBy: 'Начальник отдела',
    requestDate: '2025-11-20',
    status: 'pending',
    priority: 'high',
    expectedDelivery: '2025-12-15',
    notes: 'Требуется для объекта №7'
  },
  {
    id: 2,
    vehicleType: 'Экскаватор',
    brand: 'Caterpillar',
    model: '330',
    quantity: 1,
    estimatedPrice: 8500000,
    totalCost: 8500000,
    reason: 'Замена старой техники',
    requestedBy: 'Главный инженер',
    requestDate: '2025-11-18',
    status: 'approved',
    priority: 'medium',
    expectedDelivery: '2025-12-30',
    notes: 'На замену CAT 320'
  },
  {
    id: 3,
    vehicleType: 'Погрузчик',
    brand: 'Liugong',
    model: 'CLG856H',
    quantity: 1,
    estimatedPrice: 3200000,
    totalCost: 3200000,
    reason: 'Новый объект требует дополнительную технику',
    requestedBy: 'Начальник отдела',
    requestDate: '2025-11-15',
    status: 'rejected',
    priority: 'low',
    expectedDelivery: '2026-01-10',
    notes: 'Отклонено по бюджету'
  }
]

const mockPartsRequests = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: 'HOWO 165',
    vehiclePlate: 'А123ВС',
    partName: 'Рулевая рейка',
    partNumber: 'WG9725470200',
    quantity: 1,
    unit: 'шт',
    estimatedPrice: 45000,
    totalCost: 45000,
    supplier: 'ООО "Хово Запчасти"',
    reason: 'Требует замены, выработан ресурс',
    requestedBy: 'Механик Сергеев М.М.',
    requestDate: '2025-11-26',
    driver: 'Иванов И.И.',
    status: 'pending',
    priority: 'high',
    expectedDelivery: '2025-12-05',
    notes: 'Срочно требуется для техники'
  },
  {
    id: 2,
    vehicleId: 1,
    vehicleName: 'HOWO 165',
    vehiclePlate: 'А123ВС',
    partName: 'Комплект тормозных дисков',
    partNumber: 'WG9100443001',
    quantity: 2,
    unit: 'компл',
    estimatedPrice: 12000,
    totalCost: 24000,
    supplier: 'ООО "Хово Запчасти"',
    reason: 'Плановая замена',
    requestedBy: 'Механик Сергеев М.М.',
    requestDate: '2025-11-25',
    driver: 'Иванов И.И.',
    status: 'approved',
    priority: 'medium',
    expectedDelivery: '2025-12-01',
    notes: 'Согласовано'
  },
  {
    id: 3,
    vehicleId: 2,
    vehicleName: 'Камаз 6520',
    vehiclePlate: 'В456СЕ',
    partName: 'Генератор 28В',
    partNumber: '6582.3771000',
    quantity: 1,
    unit: 'шт',
    estimatedPrice: 18500,
    totalCost: 18500,
    supplier: 'ООО "КамАЗ Сервис"',
    reason: 'Вышел из строя',
    requestedBy: 'Механик Сергеев М.М.',
    requestDate: '2025-11-24',
    driver: 'Петров П.П.',
    status: 'ordered',
    priority: 'high',
    expectedDelivery: '2025-11-30',
    notes: 'Заказ размещен'
  },
  {
    id: 4,
    vehicleId: 3,
    vehicleName: 'Caterpillar 320',
    vehiclePlate: 'Е789КМ',
    partName: 'Гидравлический насос',
    partNumber: '14X-49-11301',
    quantity: 1,
    unit: 'шт',
    estimatedPrice: 125000,
    totalCost: 125000,
    supplier: 'ООО "CAT Parts"',
    reason: 'Течь масла',
    requestedBy: 'Механик Сергеев М.М.',
    requestDate: '2025-11-23',
    driver: 'Сидоров С.С.',
    status: 'pending',
    priority: 'high',
    expectedDelivery: '2025-12-10',
    notes: 'Требует срочной замены'
  }
]

const mockNotifications = [
  {
    id: 1,
    type: 'fuel_low',
    title: 'Низкий уровень топлива',
    message: 'Caterpillar 320 (Е789КМ) - уровень топлива 20%. Требуется заправка!',
    vehicleId: 3,
    priority: 'high',
    date: '2025-11-27 11:30'
  },
  {
    id: 2,
    type: 'service_due',
    title: 'Требуется замена масла',
    message: 'HOWO 165 (А123ВС) - осталось 500 км до замены масла',
    vehicleId: 1,
    priority: 'medium',
    date: '2025-11-27 10:00'
  },
  {
    id: 3,
    type: 'driver_request',
    title: 'Новая заявка водителя',
    message: 'Алексеев А.А. подал заявку на регистрацию',
    priority: 'medium',
    date: '2025-11-27 09:00'
  }
]

// API Routes
app.get('/api/vehicles', (c) => {
  return c.json(mockVehicles)
})

app.get('/api/vehicles/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const vehicle = mockVehicles.find(v => v.id === id)
  if (!vehicle) {
    return c.json({ error: 'Vehicle not found' }, 404)
  }
  return c.json(vehicle)
})

app.get('/api/fuelings', (c) => {
  return c.json(mockFuelings)
})

app.get('/api/fuelings/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const fueling = mockFuelings.find(f => f.id === id)
  if (!fueling) {
    return c.json({ error: 'Fueling not found' }, 404)
  }
  return c.json(fueling)
})

app.get('/api/repairs', (c) => {
  return c.json(mockRepairs)
})

app.get('/api/repairs/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const repair = mockRepairs.find(r => r.id === id)
  if (!repair) {
    return c.json({ error: 'Repair not found' }, 404)
  }
  return c.json(repair)
})

app.get('/api/driver-requests', (c) => {
  return c.json(mockDriverRequests)
})

app.post('/api/driver-requests/:id/approve', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Водитель одобрен' })
})

app.post('/api/driver-requests/:id/reject', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Заявка отклонена' })
})

app.get('/api/notifications', (c) => {
  return c.json(mockNotifications)
})

app.get('/api/currency', (c) => {
  return c.json({
    som_to_usd: 87.5,
    som_to_rub: 0.95,
    som_to_eur: 94.2,
    updated: '2025-11-27 12:00'
  })
})

app.get('/api/drivers', (c) => {
  return c.json(mockDrivers)
})

app.get('/api/drivers/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const driver = mockDrivers.find(d => d.id === id)
  if (!driver) {
    return c.json({ error: 'Driver not found' }, 404)
  }
  return c.json(driver)
})

app.get('/api/vehicle-purchase-requests', (c) => {
  return c.json(mockVehiclePurchaseRequests)
})

app.get('/api/vehicle-purchase-requests/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const request = mockVehiclePurchaseRequests.find(r => r.id === id)
  if (!request) {
    return c.json({ error: 'Request not found' }, 404)
  }
  return c.json(request)
})

app.post('/api/vehicle-purchase-requests/:id/approve', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Заявка одобрена' })
})

app.post('/api/vehicle-purchase-requests/:id/reject', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Заявка отклонена' })
})

app.get('/api/parts-requests', (c) => {
  return c.json(mockPartsRequests)
})

app.get('/api/parts-requests/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const request = mockPartsRequests.find(r => r.id === id)
  if (!request) {
    return c.json({ error: 'Request not found' }, 404)
  }
  return c.json(request)
})

app.post('/api/parts-requests/:id/approve', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Заявка одобрена' })
})

app.post('/api/parts-requests/:id/reject', (c) => {
  const id = parseInt(c.req.param('id'))
  return c.json({ success: true, message: 'Заявка отклонена' })
})

app.get('/api/vehicles/:id/history', (c) => {
  const id = parseInt(c.req.param('id'))
  const vehicle = mockVehicles.find(v => v.id === id)
  if (!vehicle) {
    return c.json({ error: 'Vehicle not found' }, 404)
  }
  
  const fuelings = mockFuelings.filter(f => f.vehicleId === id)
  const repairs = mockRepairs.filter(r => r.vehicleId === id)
  
  return c.json({
    vehicle,
    fuelings,
    repairs
  })
})

app.get('/api/maintenance-forecast', (c) => {
  const vehicleId = c.req.query('vehicleId')
  
  if (vehicleId) {
    const id = parseInt(vehicleId)
    const vehicle = mockVehicles.find(v => v.id === id)
    if (!vehicle) {
      return c.json({ error: 'Vehicle not found' }, 404)
    }
    
    // Расчет прогноза для одной техники
    const monthlyKm = vehicle.avgKmPerMonth
    const fuelCost = monthlyKm * vehicle.fuelConsumptionPerKm * 75 // 75 сом/литр
    const maintenanceCost = vehicle.maintenanceCostPerMonth
    const totalCost = fuelCost + maintenanceCost
    
    return c.json({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehiclePlate: vehicle.plate,
      monthlyKm,
      fuelConsumption: vehicle.fuelConsumptionPerKm,
      estimatedFuelCost: Math.round(fuelCost),
      estimatedMaintenanceCost: maintenanceCost,
      estimatedTotalCost: Math.round(totalCost)
    })
  }
  
  // Расчет прогноза для всего парка
  const forecasts = mockVehicles.map(vehicle => {
    const monthlyKm = vehicle.avgKmPerMonth
    const fuelCost = monthlyKm * vehicle.fuelConsumptionPerKm * 75
    const maintenanceCost = vehicle.maintenanceCostPerMonth
    const totalCost = fuelCost + maintenanceCost
    
    return {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehiclePlate: vehicle.plate,
      monthlyKm,
      fuelConsumption: vehicle.fuelConsumptionPerKm,
      estimatedFuelCost: Math.round(fuelCost),
      estimatedMaintenanceCost: maintenanceCost,
      estimatedTotalCost: Math.round(totalCost)
    }
  })
  
  const totalFuelCost = forecasts.reduce((sum, f) => sum + f.estimatedFuelCost, 0)
  const totalMaintenanceCost = forecasts.reduce((sum, f) => sum + f.estimatedMaintenanceCost, 0)
  const grandTotal = totalFuelCost + totalMaintenanceCost
  
  return c.json({
    vehicles: forecasts,
    summary: {
      totalFuelCost,
      totalMaintenanceCost,
      grandTotal
    }
  })
})

app.post('/api/login', async (c) => {
  const body = await c.req.json()
  if (body.username === 'admin' && body.password === 'admin') {
    return c.json({ success: true, token: 'demo-token-12345' })
  }
  return c.json({ success: false, message: 'Неверный логин или пароль' }, 401)
})

// Main page
app.get('/', (c) => {
  return c.html(
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Система контроля транспортного отдела</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <link href="/static/style.css" rel="stylesheet" />
        <script>{`
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: '#3b82f6',
                  secondary: '#1e40af',
                  dark: '#0f172a',
                  darker: '#020617'
                }
              }
            }
          }
        `}</script>
      </head>
      <body class="bg-darker text-gray-100">
        <div id="app"></div>
        <script src="/static/app.js"></script>
      </body>
    </html>
  )
})

export default app

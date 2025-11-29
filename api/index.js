// Vercel Serverless Function для Hono
// Этот файл нужен для деплоя на Vercel

export default async function handler(req, res) {
  // Простой прокси для статических файлов и API
  const url = new URL(req.url, `https://${req.headers.host}`);
  
  // Обработка API запросов
  if (url.pathname.startsWith('/api/')) {
    return handleAPI(req, res, url);
  }
  
  // Отдача главной страницы
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(getHTML());
}

function handleAPI(req, res, url) {
  const path = url.pathname;
  
  // Mock data
  const mockVehicles = [
    {
      id: 1,
      name: 'HOWO 165',
      plate: 'А123ВС',
      type: 'Самосвал',
      driver: 'Иванов И.И.',
      fuelLevel: 75,
      status: 'active',
      mileage: 125000,
      lastService: 124500,
      nextService: 130000,
      location: 'Объект №5',
      photos: ['/static/images/howo.jpg', '/static/images/howo2.jpg']
    },
    {
      id: 2,
      name: 'Камаз 6520',
      plate: 'В456СЕ',
      type: 'Самосвал',
      driver: 'Петров П.П.',
      fuelLevel: 45,
      status: 'active',
      mileage: 98000,
      lastService: 95000,
      nextService: 105000,
      location: 'Объект №3',
      photos: ['/static/images/kamaz.jpg']
    },
    {
      id: 3,
      name: 'Caterpillar 320',
      plate: 'Е789КМ',
      type: 'Экскаватор',
      driver: 'Сидоров С.С.',
      fuelLevel: 20,
      status: 'warning',
      mileage: 5600,
      lastService: 5000,
      nextService: 6000,
      location: 'Объект №1',
      photos: ['/static/images/cat.jpg']
    }
  ];
  
  const mockFuelings = [
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'HOWO 165',
      driver: 'Иванов И.И.',
      liters: 250,
      amount: 18750,
      date: '2025-11-27 08:30',
      location: 'АЗС №5',
      photo: '/static/images/fueling1.jpg'
    },
    {
      id: 2,
      vehicleId: 2,
      vehicleName: 'Камаз 6520',
      driver: 'Петров П.П.',
      liters: 180,
      amount: 13500,
      date: '2025-11-27 10:15',
      location: 'АЗС №3',
      photo: '/static/images/fueling2.jpg'
    }
  ];
  
  const mockRepairs = [
    {
      id: 1,
      vehicleId: 1,
      vehicleName: 'HOWO 165',
      description: 'Замена масла и фильтров',
      parts: 'Масло 20л, Фильтр масляный, Фильтр воздушный',
      partsCost: 4500,
      laborCost: 2000,
      totalCost: 6500,
      date: '2025-11-25',
      photos: ['/static/images/repair1.jpg', '/static/images/repair2.jpg'],
      status: 'completed'
    },
    {
      id: 2,
      vehicleId: 3,
      vehicleName: 'Caterpillar 320',
      description: 'Ремонт гидравлики',
      parts: 'Шланг гидравлический 2шт, Уплотнители',
      partsCost: 8500,
      laborCost: 5000,
      totalCost: 13500,
      date: '2025-11-26',
      photos: ['/static/images/repair3.jpg'],
      status: 'in_progress'
    }
  ];
  
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
  ];
  
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
  ];
  
  res.setHeader('Content-Type', 'application/json');
  
  // Routes
  if (path === '/api/vehicles') {
    return res.status(200).json(mockVehicles);
  }
  
  if (path.match(/^\/api\/vehicles\/\d+$/)) {
    const id = parseInt(path.split('/')[3]);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    return res.status(200).json(vehicle);
  }
  
  if (path === '/api/fuelings') {
    return res.status(200).json(mockFuelings);
  }
  
  if (path.match(/^\/api\/fuelings\/\d+$/)) {
    const id = parseInt(path.split('/')[3]);
    const fueling = mockFuelings.find(f => f.id === id);
    if (!fueling) {
      return res.status(404).json({ error: 'Fueling not found' });
    }
    return res.status(200).json(fueling);
  }
  
  if (path === '/api/repairs') {
    return res.status(200).json(mockRepairs);
  }
  
  if (path.match(/^\/api\/repairs\/\d+$/)) {
    const id = parseInt(path.split('/')[3]);
    const repair = mockRepairs.find(r => r.id === id);
    if (!repair) {
      return res.status(404).json({ error: 'Repair not found' });
    }
    return res.status(200).json(repair);
  }
  
  if (path === '/api/driver-requests') {
    return res.status(200).json(mockDriverRequests);
  }
  
  if (path.match(/^\/api\/driver-requests\/\d+\/(approve|reject)$/)) {
    return res.status(200).json({ success: true, message: 'Действие выполнено' });
  }
  
  if (path === '/api/notifications') {
    return res.status(200).json(mockNotifications);
  }
  
  if (path === '/api/currency') {
    return res.status(200).json({
      som_to_usd: 87.5,
      som_to_rub: 0.95,
      som_to_eur: 94.2,
      updated: '2025-11-27 12:00'
    });
  }
  
  if (path === '/api/login' && req.method === 'POST') {
    return res.status(200).json({ success: true, token: 'demo-token-12345' });
  }
  
  return res.status(404).json({ error: 'Not found' });
}

function getHTML() {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Система контроля транспортного отдела</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <link href="/static/style.css" rel="stylesheet">
    <script>
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
    </script>
</head>
<body class="bg-darker text-gray-100">
    <div id="app"></div>
    <script src="/static/app.js"></script>
</body>
</html>`;
}

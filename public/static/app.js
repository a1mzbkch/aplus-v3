// Transport Control System - GenSpark Dark Theme
// Main Application Logic

class App {
  constructor() {
    this.currentPage = 'login'
    this.currentPageParam = null
    this.isAuthenticated = false
    this.user = null
    this.notifications = []
    this.vehicles = []
    this.fuelings = []
    this.repairs = []
    this.driverRequests = []
    this.drivers = []
    this.vehiclePurchaseRequests = []
    this.partsRequests = []
    this.maintenanceForecast = null
    this.currency = null
    
    this.init()
  }

  init() {
    // Check if user is logged in
    const token = localStorage.getItem('authToken')
    if (token) {
      this.isAuthenticated = true
      this.user = { name: 'Администратор', role: 'admin' }
      this.loadData()
      this.currentPage = 'dashboard'
    }
    
    this.render()
    this.startNotificationPolling()
  }

  async loadData() {
    try {
      const [vehicles, fuelings, repairs, driverRequests, drivers, vehiclePurchaseRequests, partsRequests, notifications, maintenanceForecast, currency] = await Promise.all([
        axios.get('/api/vehicles'),
        axios.get('/api/fuelings'),
        axios.get('/api/repairs'),
        axios.get('/api/driver-requests'),
        axios.get('/api/drivers'),
        axios.get('/api/vehicle-purchase-requests'),
        axios.get('/api/parts-requests'),
        axios.get('/api/notifications'),
        axios.get('/api/maintenance-forecast'),
        axios.get('/api/currency')
      ])
      
      this.vehicles = vehicles.data
      this.fuelings = fuelings.data
      this.repairs = repairs.data
      this.driverRequests = driverRequests.data
      this.drivers = drivers.data
      this.vehiclePurchaseRequests = vehiclePurchaseRequests.data
      this.partsRequests = partsRequests.data
      this.notifications = notifications.data
      this.maintenanceForecast = maintenanceForecast.data
      this.currency = currency.data
      
      this.render()
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  async login(username, password) {
    try {
      const response = await axios.post('/api/login', { username, password })
      
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token)
        this.isAuthenticated = true
        this.user = { name: 'Администратор', role: 'admin' }
        this.currentPage = 'dashboard'
        await this.loadData()
        this.showToast('Вход выполнен успешно!', 'success')
      }
    } catch (error) {
      this.showToast('Неверный логин или пароль', 'error')
    }
  }

  logout() {
    localStorage.removeItem('authToken')
    this.isAuthenticated = false
    this.user = null
    this.currentPage = 'login'
    this.render()
  }

  navigateTo(page, param = null) {
    this.currentPage = page
    this.currentPageParam = param
    this.render()
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div')
    toast.className = 'notification-toast'
    
    const icon = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    }[type]
    
    const color = {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#fb923c',
      info: '#3b82f6'
    }[type]
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="width: 32px; height: 32px; background: ${color}20; color: ${color}; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
          ${icon}
        </div>
        <div style="flex: 1; color: #f1f5f9;">${message}</div>
      </div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  async approveDriver(id) {
    try {
      await axios.post(`/api/driver-requests/${id}/approve`)
      this.showToast('Водитель одобрен', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при одобрении', 'error')
    }
  }

  async rejectDriver(id) {
    try {
      await axios.post(`/api/driver-requests/${id}/reject`)
      this.showToast('Заявка отклонена', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при отклонении', 'error')
    }
  }

  startNotificationPolling() {
    // Poll for new notifications every 30 seconds
    setInterval(() => {
      if (this.isAuthenticated) {
        this.loadData()
      }
    }, 30000)
  }

  renderLoginPage() {
    return `
      <div class="login-container">
        <div class="login-box">
          <div class="login-logo">
            <i class="fas fa-truck"></i>
          </div>
          <h1 class="login-title">Система контроля</h1>
          <p class="login-subtitle">Транспортный отдел</p>
          
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label">Логин</label>
              <input type="text" class="form-input" id="username" placeholder="admin" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Пароль</label>
              <input type="password" class="form-input" id="password" placeholder="••••••••" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              <i class="fas fa-sign-in-alt"></i>
              Войти
            </button>
          </form>
          
          <p style="text-align: center; color: #64748b; font-size: 0.875rem; margin-top: 1.5rem;">
            Демо: admin / admin
          </p>
        </div>
      </div>
    `
  }

  renderSidebar() {
    const menuItems = [
      { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
      { id: 'vehicles', icon: 'fa-truck', label: 'Техника' },
      { id: 'fuelings', icon: 'fa-gas-pump', label: 'Заправки' },
      { id: 'repairs', icon: 'fa-wrench', label: 'Ремонты' },
      { id: 'drivers', icon: 'fa-users', label: 'Водители' },
      { id: 'vehicle-requests', icon: 'fa-shopping-cart', label: 'Заявки на технику' },
      { id: 'parts-requests', icon: 'fa-cogs', label: 'Заявки на запчасти' },
      { id: 'forecast', icon: 'fa-calculator', label: 'Прогноз расходов' },
      { id: 'reports', icon: 'fa-file-excel', label: 'Отчеты' }
    ]

    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <i class="fas fa-truck"></i>
          </div>
          <div class="sidebar-title">Транспорт</div>
        </div>
        
        <div class="sidebar-menu">
          ${menuItems.map(item => `
            <a class="sidebar-link ${this.currentPage === item.id ? 'active' : ''}" onclick="app.navigateTo('${item.id}')">
              <i class="fas ${item.icon}"></i>
              <span>${item.label}</span>
              ${item.id === 'drivers' && this.driverRequests.length > 0 ? 
                `<span class="badge badge-warning" style="margin-left: auto;">${this.driverRequests.length}</span>` : ''}
              ${item.id === 'vehicle-requests' && this.vehiclePurchaseRequests.filter(r => r.status === 'pending').length > 0 ? 
                `<span class="badge badge-warning" style="margin-left: auto;">${this.vehiclePurchaseRequests.filter(r => r.status === 'pending').length}</span>` : ''}
              ${item.id === 'parts-requests' && this.partsRequests.filter(r => r.status === 'pending').length > 0 ? 
                `<span class="badge badge-warning" style="margin-left: auto;">${this.partsRequests.filter(r => r.status === 'pending').length}</span>` : ''}
            </a>
          `).join('')}
        </div>
      </div>
    `
  }

  renderTopbar() {
    return `
      <div class="topbar">
        <div class="topbar-search" style="position: relative;">
          <i class="fas fa-search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #64748b;"></i>
          <input type="text" placeholder="Поиск техники, водителя..." />
        </div>
        
        <div class="topbar-actions">
          <div class="topbar-notification" onclick="app.toggleNotifications()" style="position: relative; cursor: pointer;">
            <i class="fas fa-bell"></i>
            ${this.notifications.length > 0 ? '<div class="notification-badge"></div>' : ''}
          </div>
          
          <div class="topbar-user" onclick="app.logout()">
            <div class="user-avatar">А</div>
            <div>
              <div style="font-size: 0.875rem; font-weight: 500;">${this.user.name}</div>
              <div style="font-size: 0.75rem; color: #64748b;">Выйти</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  toggleNotifications() {
    // Remove existing dropdown if any
    const existing = document.querySelector('.notifications-dropdown')
    if (existing) {
      existing.remove()
      return
    }
    
    const dropdown = document.createElement('div')
    dropdown.className = 'notifications-dropdown'
    dropdown.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      width: 380px;
      max-height: 500px;
      overflow-y: auto;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      z-index: 1000;
      animation: slideDown 0.2s ease;
    `
    
    dropdown.innerHTML = `
      <div style="padding: 1rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 1.125rem; font-weight: 600;">Уведомления</h3>
        <span class="badge badge-danger">${this.notifications.length}</span>
      </div>
      <div>
        ${this.notifications.length > 0 ? this.notifications.map(notif => `
          <div style="padding: 1rem; border-bottom: 1px solid #334155; cursor: pointer;" onclick="app.handleNotificationClick(${notif.vehicleId || 'null'})">
            <div style="display: flex; gap: 1rem;">
              <div style="width: 40px; height: 40px; background: ${notif.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 146, 60, 0.1)'}; color: ${notif.priority === 'high' ? '#ef4444' : '#fb923c'}; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-${notif.type === 'fuel_low' ? 'gas-pump' : notif.type === 'service_due' ? 'wrench' : 'user-plus'}"></i>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${notif.title}</div>
                <div style="font-size: 0.875rem; color: #94a3b8; margin-bottom: 0.5rem;">${notif.message}</div>
                <div style="font-size: 0.75rem; color: #64748b;">${notif.date}</div>
              </div>
            </div>
          </div>
        `).join('') : '<div style="padding: 2rem; text-align: center; color: #64748b;">Нет уведомлений</div>'}
      </div>
    `
    
    document.body.appendChild(dropdown)
    
    // Close on click outside
    setTimeout(() => {
      document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !e.target.closest('.topbar-notification')) {
          dropdown.remove()
          document.removeEventListener('click', closeDropdown)
        }
      })
    }, 0)
  }

  handleNotificationClick(vehicleId) {
    const dropdown = document.querySelector('.notifications-dropdown')
    if (dropdown) dropdown.remove()
    
    if (vehicleId) {
      this.showVehicleDetails(vehicleId)
    } else {
      this.navigateTo('drivers')
    }
  }

  renderDashboard() {
    const activeVehicles = this.vehicles.filter(v => v.status === 'active').length
    const totalFuel = this.vehicles.reduce((sum, v) => sum + v.fuelLevel, 0)
    const avgFuel = this.vehicles.length > 0 ? Math.round(totalFuel / this.vehicles.length) : 0
    const lowFuelVehicles = this.vehicles.filter(v => v.fuelLevel < 30).length
    const totalRepairCost = this.repairs.reduce((sum, r) => sum + r.totalCost, 0)

    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Dashboard</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Обзор основных показателей транспортного отдела</p>
        
        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">
              <i class="fas fa-truck"></i>
            </div>
            <div class="stat-value">${activeVehicles}/${this.vehicles.length}</div>
            <div class="stat-label">Активная техника</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
              <i class="fas fa-gas-pump"></i>
            </div>
            <div class="stat-value">${avgFuel}%</div>
            <div class="stat-label">Средний уровень топлива</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(251, 146, 60, 0.1); color: #fb923c;">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="stat-value">${lowFuelVehicles}</div>
            <div class="stat-label">Низкий уровень топлива</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
              <i class="fas fa-wrench"></i>
            </div>
            <div class="stat-value">${totalRepairCost.toLocaleString()} ₵</div>
            <div class="stat-label">Затраты на ремонт</div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
          <!-- Recent Vehicles -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Техника</h3>
              <button class="btn btn-primary btn-sm" onclick="app.navigateTo('vehicles')">
                Все
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
            <div class="table-container">
              ${this.vehicles.slice(0, 5).map(vehicle => `
                <div class="table-row" onclick="app.navigateTo('vehicle-detail', ${vehicle.id})" style="padding: 1rem; border-bottom: 1px solid #1e293b;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; margin-bottom: 0.25rem;">${vehicle.name}</div>
                      <div style="font-size: 0.875rem; color: #64748b;">${vehicle.plate} • ${vehicle.driver}</div>
                    </div>
                    <div style="text-align: right;">
                      <div class="badge ${vehicle.fuelLevel < 30 ? 'badge-danger' : vehicle.fuelLevel < 50 ? 'badge-warning' : 'badge-success'}">
                        <i class="fas fa-gas-pump"></i>
                        ${vehicle.fuelLevel}%
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Recent Notifications -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Уведомления</h3>
              <button class="btn btn-primary btn-sm" onclick="app.navigateTo('notifications')">
                Все
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
            <div>
              ${this.notifications.slice(0, 5).map(notif => `
                <div style="padding: 1rem; border-bottom: 1px solid #1e293b;">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <div style="width: 40px; height: 40px; background: ${notif.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 146, 60, 0.1)'}; color: ${notif.priority === 'high' ? '#ef4444' : '#fb923c'}; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                      <i class="fas fa-${notif.type === 'fuel_low' ? 'gas-pump' : notif.type === 'service_due' ? 'wrench' : 'user-plus'}"></i>
                    </div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; margin-bottom: 0.25rem;">${notif.title}</div>
                      <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">${notif.message}</div>
                      <div style="font-size: 0.75rem; color: #475569;">${notif.date}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderVehicles() {
    // Группируем технику по типам
    const vehiclesByType = {}
    this.vehicles.forEach(vehicle => {
      if (!vehiclesByType[vehicle.type]) {
        vehiclesByType[vehicle.type] = []
      }
      vehiclesByType[vehicle.type].push(vehicle)
    })
    
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Техника</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Управление транспортными средствами</p>
        
        ${Object.keys(vehiclesByType).map(type => `
          <div style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-${type === 'Самосвал' ? 'truck' : type === 'Экскаватор' ? 'hard-hat' : 'truck-moving'}"></i>
              </div>
              ${type}
              <span style="font-size: 1rem; color: #64748b; font-weight: 400;">(${vehiclesByType[type].length})</span>
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
              ${vehiclesByType[type].map(vehicle => `
                <div class="card" style="cursor: pointer;" onclick="app.navigateTo('vehicle-detail', ${vehicle.id})">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
                  <i class="fas fa-truck"></i>
                </div>
                <div style="flex: 1;">
                  <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">${vehicle.name}</h3>
                  <div style="color: #64748b; font-size: 0.875rem;">${vehicle.plate} • ${vehicle.type}</div>
                </div>
                <div class="badge ${vehicle.status === 'active' ? 'badge-success' : 'badge-warning'}">
                  ${vehicle.status === 'active' ? 'Активна' : 'Требует внимания'}
                </div>
              </div>
              
              <!-- Fuel Level -->
              <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="font-size: 0.875rem; color: #94a3b8;">Уровень топлива</span>
                  <span style="font-weight: 600; color: ${vehicle.fuelLevel < 30 ? '#ef4444' : vehicle.fuelLevel < 50 ? '#fb923c' : '#22c55e'};">${vehicle.fuelLevel}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${vehicle.fuelLevel}%; background: ${vehicle.fuelLevel < 30 ? '#ef4444' : vehicle.fuelLevel < 50 ? '#fb923c' : '#22c55e'};"></div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Водитель</div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${vehicle.driver}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Местоположение</div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${vehicle.location}</div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b; margin-top: 1rem;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Пробег</div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${vehicle.mileage.toLocaleString()} км</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">До ТО</div>
                  <div style="font-size: 0.875rem; font-weight: 500; color: ${(vehicle.nextService - vehicle.mileage) < 1000 ? '#fb923c' : '#22c55e'};">
                    ${(vehicle.nextService - vehicle.mileage).toLocaleString()} км
                  </div>
                </div>
              </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `
  }

  renderVehicleDetail(vehicleId) {
    const vehicle = this.vehicles.find(v => v.id === vehicleId)
    if (!vehicle) {
      return `
        <div style="text-align: center; padding: 4rem 2rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #fb923c; margin-bottom: 1rem;"></i>
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Техника не найдена</h2>
          <button class="btn btn-primary" onclick="app.navigateTo('vehicles')">
            Вернуться к списку техники
          </button>
        </div>
      `
    }
    
    const vehicleFuelings = this.fuelings.filter(f => f.vehicleId === vehicleId)
    const vehicleRepairs = this.repairs.filter(r => r.vehicleId === vehicleId)
    const driver = this.drivers.find(d => d.id === vehicle.driverId)
    
    return `
      <div>
        <!-- Header with back button -->
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary" onclick="app.navigateTo('vehicles')">
            <i class="fas fa-arrow-left"></i>
            Назад
          </button>
          <div style="flex: 1;">
            <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${vehicle.name} (${vehicle.plate})</h1>
            <p style="color: #64748b;">${vehicle.type} • ${vehicle.location}</p>
          </div>
          <div class="badge badge-${vehicle.status === 'active' ? 'success' : 'warning'}" style="font-size: 1rem; padding: 0.5rem 1rem;">
            <i class="fas fa-circle"></i>
            ${vehicle.status === 'active' ? 'Активна' : 'Требует внимания'}
          </div>
        </div>
        
        <!-- Photos Section -->
        <div class="card" style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-images"></i>
            Фотографии транспорта и документов
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            ${vehicle.photos.map((photo, index) => `
              <div>
                <h3 style="font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  <i class="fas fa-truck"></i> Фото транспорта ${index + 1}
                </h3>
                <div style="aspect-ratio: 16/9; background: #1e293b; border-radius: 12px; overflow: hidden; border: 2px solid #334155;">
                  <img src="${photo}" alt="Vehicle ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%231e293b%27 width=%27400%27 height=%27300%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2720%27%3ENo Photo%3C/text%3E%3C/svg%3E'" />
                </div>
              </div>
            `).join('')}
            <div>
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i class="fas fa-file-alt"></i> Тех. паспорт
              </h3>
              <div style="aspect-ratio: 16/9; background: #1e293b; border-radius: 12px; overflow: hidden; border: 2px solid #334155;">
                <img src="${vehicle.techPassportPhoto || ''}" alt="Tech Passport" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%231e293b%27 width=%27400%27 height=%27300%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2716%27%3ETech Passport%3C/text%3E%3C/svg%3E'" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Vehicle Info -->
        <div class="card" style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-info-circle"></i>
            Информация о технике
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Гос. номер</div>
              <div style="font-size: 1.125rem; font-weight: 600; font-family: monospace;">${vehicle.plate}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">VIN номер</div>
              <div style="font-size: 1.125rem; font-weight: 600; font-family: monospace;">${vehicle.vin || 'Н/Д'}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Тип</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${vehicle.type}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Дата покупки</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${vehicle.purchaseDate || 'Н/Д'}</div>
            </div>
            <div style="cursor: pointer;" onclick="app.navigateTo('driver-detail', ${vehicle.driverId})">
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                <i class="fas fa-user"></i> Водитель
              </div>
              <div style="font-size: 1.125rem; font-weight: 600; color: #3b82f6;">
                ${vehicle.driver} <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
              </div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                <i class="fas fa-gas-pump"></i> Топливо
              </div>
              <div style="font-size: 1.125rem; font-weight: 600; color: ${vehicle.fuelLevel < 30 ? '#ef4444' : '#22c55e'};">
                ${vehicle.fuelLevel}%
              </div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Пробег</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${vehicle.mileage.toLocaleString()} км</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">До ТО</div>
              <div style="font-size: 1.125rem; font-weight: 600; color: ${(vehicle.nextService - vehicle.mileage) < 1000 ? '#fb923c' : '#22c55e'};">
                ${(vehicle.nextService - vehicle.mileage).toLocaleString()} км
              </div>
            </div>
          </div>
        </div>
          
          <!-- Map -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Местоположение</h3>
            <div id="vehicle-map-${id}" style="height: 300px; border-radius: 8px; overflow: hidden; background: #1e293b;"></div>
          </div>
          
          <!-- Info -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="card" style="padding: 1rem; cursor: pointer;" onclick="app.navigateTo('driver-detail', ${vehicle.driverId}); this.closest('.modal-overlay').remove();">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Водитель</div>
              <div style="font-weight: 600; color: #3b82f6;">${vehicle.driver} <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i></div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Тип</div>
              <div style="font-weight: 600;">${vehicle.type}</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Местоположение</div>
              <div style="font-weight: 600;">${vehicle.location}</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Топливо</div>
              <div style="font-weight: 600; color: ${vehicle.fuelLevel < 30 ? '#ef4444' : '#22c55e'};">${vehicle.fuelLevel}%</div>
            </div>
          </div>
          
          <!-- Recent Fuelings -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">История заправок</h3>
            ${vehicleFuelings.length > 0 ? vehicleFuelings.map(f => `
              <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${f.liters} л • ${f.location}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${f.date}</div>
                  </div>
                  <div class="badge badge-success">${f.amount.toLocaleString()} ₵</div>
                </div>
              </div>
            `).join('') : '<p style="color: #64748b; text-align: center; padding: 2rem;">Нет данных</p>'}
          </div>
          
          <!-- Recent Repairs -->
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">История ремонтов</h3>
            ${vehicleRepairs.length > 0 ? vehicleRepairs.map(r => `
              <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${r.description}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${r.date} • ${r.mechanic || 'Механик'}</div>
                  </div>
                  <div class="badge badge-danger">${r.totalCost.toLocaleString()} ₵</div>
                </div>
                ${r.parts && Array.isArray(r.parts) ? `
                  <div style="font-size: 0.875rem; color: #94a3b8; margin-top: 0.5rem;">
                    ${r.parts.map(p => p.name).join(', ')}
                  </div>
                ` : ''}
              </div>
            `).join('') : '<p style="color: #64748b; text-align: center; padding: 2rem;">Нет данных</p>'}
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
    
    // Initialize map after modal is added to DOM
    setTimeout(() => {
      if (vehicle.latitude && vehicle.longitude && typeof L !== 'undefined') {
        const map = L.map(`vehicle-map-${id}`).setView([vehicle.latitude, vehicle.longitude], 13)
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)
        
        L.marker([vehicle.latitude, vehicle.longitude])
          .addTo(map)
          .bindPopup(`<b>${vehicle.name}</b><br>${vehicle.plate}<br>${vehicle.location}`)
          .openPopup()
      }
    }, 100)
  }

  renderFuelings() {
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Заправки</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">История заправок техники</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;">
          ${this.fuelings.map(fueling => `
            <div class="card" style="cursor: pointer;" onclick="app.showFuelingDetails(${fueling.id})">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 56px; height: 56px; background: rgba(34, 197, 94, 0.1); color: #22c55e; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                  <i class="fas fa-gas-pump"></i>
                </div>
                <div style="flex: 1;">
                  <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${fueling.vehicleName}</h3>
                  <div style="color: #64748b; font-size: 0.875rem;">${fueling.driver}</div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Объем</div>
                  <div style="font-size: 1.25rem; font-weight: 600;">${fueling.liters} л</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Сумма</div>
                  <div style="font-size: 1.25rem; font-weight: 600; color: #22c55e;">${fueling.amount.toLocaleString()} ₵</div>
                </div>
              </div>
              
              <div style="padding-top: 1rem; border-top: 1px solid #1e293b; margin-top: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Дата и время</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${fueling.date}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Место</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${fueling.location}</div>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  showFuelingDetails(id) {
    const fueling = this.fuelings.find(f => f.id === id)
    if (!fueling) return
    
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
    
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Детали заправки</h2>
          <div class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- Photo -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Фото чека</h3>
            <div style="aspect-ratio: 16/9; background: #1e293b; border-radius: 8px; overflow: hidden;">
              <img src="${fueling.photo}" alt="Receipt" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect fill=%27%231e293b%27 width=%27400%27 height=%27300%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E'" />
            </div>
          </div>
          
          <!-- Info -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Техника</div>
              <div style="font-weight: 600;">${fueling.vehicleName}</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Водитель</div>
              <div style="font-weight: 600;">${fueling.driver}</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Литров</div>
              <div style="font-weight: 600; color: #3b82f6;">${fueling.liters} л</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Сумма</div>
              <div style="font-weight: 600; color: #22c55e;">${fueling.amount.toLocaleString()} ₵</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Дата и время</div>
              <div style="font-weight: 600;">${fueling.date}</div>
            </div>
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Место</div>
              <div style="font-weight: 600;">${fueling.location}</div>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  }

  renderRepairs() {
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Ремонты</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">История ремонтов и обслуживания</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;">
          ${this.repairs.map(repair => `
            <div class="card" style="cursor: pointer;" onclick="app.showRepairDetails(${repair.id})">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                <div style="width: 56px; height: 56px; background: ${repair.status === 'completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(251, 146, 60, 0.1)'}; color: ${repair.status === 'completed' ? '#22c55e' : '#fb923c'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                  <i class="fas fa-wrench"></i>
                </div>
                <div style="flex: 1;">
                  <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${repair.vehicleName}</h3>
                  <div class="badge ${repair.status === 'completed' ? 'badge-success' : 'badge-warning'}">
                    ${repair.status === 'completed' ? 'Завершено' : 'В процессе'}
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 1rem;">
                <div style="font-weight: 500; margin-bottom: 0.5rem;">${repair.description}</div>
                <div style="font-size: 0.875rem; color: #64748b;">${repair.parts}</div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Запчасти</div>
                  <div style="font-weight: 600;">${repair.partsCost.toLocaleString()} ₵</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Работа</div>
                  <div style="font-weight: 600;">${repair.laborCost.toLocaleString()} ₵</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Итого</div>
                  <div style="font-weight: 600; color: #ef4444;">${repair.totalCost.toLocaleString()} ₵</div>
                </div>
              </div>
              
              <div style="padding-top: 1rem; border-top: 1px solid #1e293b; margin-top: 1rem;">
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Дата</div>
                <div style="font-size: 0.875rem; font-weight: 500;">${repair.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  showRepairDetails(id) {
    const repair = this.repairs.find(r => r.id === id)
    if (!repair) return
    
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
    
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Детали ремонта</h2>
          <div class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- Photos -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Фото отчет</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              ${repair.photos.map(photo => `
                <div style="aspect-ratio: 16/9; background: #1e293b; border-radius: 8px; overflow: hidden;">
                  <img src="${photo}" alt="Repair" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27200%27%3E%3Crect fill=%27%231e293b%27 width=%27300%27 height=%27200%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E'" />
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Info -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
              <div>
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${repair.vehicleName}</h3>
                <div class="badge ${repair.status === 'completed' ? 'badge-success' : 'badge-warning'}">
                  ${repair.status === 'completed' ? 'Завершено' : 'В процессе'}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.875rem; color: #64748b;">Дата</div>
                <div style="font-weight: 600;">${repair.date}</div>
              </div>
            </div>
            
            <div style="padding-top: 1rem; border-top: 1px solid #1e293b;">
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Описание работ</div>
              <div style="font-weight: 500;">${repair.description}</div>
            </div>
          </div>
          
          <!-- Parts -->
          <div class="card" style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Использованные запчасти</div>
            <div style="font-weight: 500; margin-bottom: 1rem;">${repair.parts}</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
              <div>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Запчасти</div>
                <div style="font-size: 1.25rem; font-weight: 600;">${repair.partsCost.toLocaleString()} ₵</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Работа</div>
                <div style="font-size: 1.25rem; font-weight: 600;">${repair.laborCost.toLocaleString()} ₵</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Итого</div>
                <div style="font-size: 1.25rem; font-weight: 600; color: #ef4444;">${repair.totalCost.toLocaleString()} ₵</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
  }

  renderDrivers() {
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Водители</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Управление водителями и заявками на регистрацию</p>
        
        ${this.driverRequests.length > 0 ? `
          <div style="background: rgba(251, 146, 60, 0.1); border: 1px solid rgba(251, 146, 60, 0.2); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: #fb923c;"></i>
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Новые заявки на регистрацию</div>
                <div style="font-size: 0.875rem; color: #94a3b8;">${this.driverRequests.length} заявок ожидают одобрения</div>
              </div>
              <button class="btn btn-secondary" onclick="app.navigateTo('driver-requests')">
                Перейти к заявкам
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ` : ''}
        
        <!-- Active Drivers -->
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">
          <i class="fas fa-users"></i>
          Работающие водители (${this.drivers.length})
        </h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
          ${this.drivers.map(driver => `
            <div class="card" style="cursor: pointer; transition: all 0.2s;" onclick="app.navigateTo('driver-detail', ${driver.id})">
              <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <!-- Photo -->
                <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; background: #1e293b; flex-shrink: 0;">
                  <img src="${driver.photo}" alt="${driver.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%231e293b%27 width=%27100%27 height=%27100%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2714%27%3E${driver.name.charAt(0)}%3C/text%3E%3C/svg%3E'" />
                </div>
                
                <div style="flex: 1; min-width: 0;">
                  <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${driver.name}</h3>
                  <div class="badge badge-success" style="margin-bottom: 0.5rem;">
                    <i class="fas fa-check-circle"></i>
                    ${driver.status === 'active' ? 'Активен' : 'Неактивен'}
                  </div>
                  <div style="font-size: 0.875rem; color: #64748b;">
                    ${driver.currentVehicle}
                  </div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
                    <i class="fas fa-phone"></i> Телефон
                  </div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${driver.phone}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
                    <i class="fab fa-telegram"></i> Telegram
                  </div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${driver.telegram}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
                    <i class="fas fa-id-card"></i> Категория
                  </div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${driver.license}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
                    <i class="fas fa-briefcase"></i> Стаж
                  </div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${driver.experience}</div>
                </div>
              </div>
              
              <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b; text-align: center; color: #3b82f6; font-size: 0.875rem; font-weight: 500;">
                <i class="fas fa-arrow-right"></i> Нажмите для подробностей
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderNotifications() {
    const grouped = {
      high: this.notifications.filter(n => n.priority === 'high'),
      medium: this.notifications.filter(n => n.priority === 'medium'),
      low: this.notifications.filter(n => n.priority === 'low')
    }
    
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Уведомления</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Важные события и предупреждения</p>
        
        <!-- High Priority -->
        ${grouped.high.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #ef4444;">
              <i class="fas fa-exclamation-circle"></i>
              Требуют немедленного внимания (${grouped.high.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${grouped.high.map(notif => this.renderNotificationCard(notif)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Medium Priority -->
        ${grouped.medium.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #fb923c;">
              <i class="fas fa-exclamation-triangle"></i>
              Важные (${grouped.medium.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${grouped.medium.map(notif => this.renderNotificationCard(notif)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Low Priority -->
        ${grouped.low.length > 0 ? `
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #3b82f6;">
              <i class="fas fa-info-circle"></i>
              Информационные (${grouped.low.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${grouped.low.map(notif => this.renderNotificationCard(notif)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `
  }

  renderNotificationCard(notif) {
    const typeConfig = {
      fuel_low: { icon: 'gas-pump', color: '#ef4444' },
      service_due: { icon: 'wrench', color: '#fb923c' },
      driver_request: { icon: 'user-plus', color: '#3b82f6' },
      breakdown: { icon: 'exclamation-triangle', color: '#ef4444' }
    }
    
    const config = typeConfig[notif.type] || { icon: 'bell', color: '#64748b' }
    
    return `
      <div class="card" style="cursor: pointer;" onclick="${notif.vehicleId ? `app.showVehicleDetails(${notif.vehicleId})` : `app.navigateTo('drivers')`}">
        <div style="display: flex; align-items: start; gap: 1rem;">
          <div style="width: 48px; height: 48px; background: ${config.color}20; color: ${config.color}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
            <i class="fas fa-${config.icon}"></i>
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.125rem; font-weight: 600; flex: 1;">${notif.title}</h3>
              <div class="badge badge-${notif.priority === 'high' ? 'danger' : notif.priority === 'medium' ? 'warning' : 'info'}" style="margin-left: 1rem;">
                ${notif.priority === 'high' ? 'Срочно' : notif.priority === 'medium' ? 'Важно' : 'Инфо'}
              </div>
            </div>
            <p style="color: #94a3b8; margin-bottom: 0.75rem;">${notif.message}</p>
            <div style="font-size: 0.75rem; color: #64748b;">
              <i class="fas fa-clock"></i>
              ${notif.date}
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderReports() {
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Отчеты</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Экспорт данных в Excel</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
          <div class="card" style="cursor: pointer;" onclick="app.exportReport('vehicles')">
            <div style="text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem;">
                <i class="fas fa-truck"></i>
              </div>
              <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Отчет по технике</h3>
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">Полная информация о всей технике</p>
              <button class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-download"></i>
                Скачать Excel
              </button>
            </div>
          </div>
          
          <div class="card" style="cursor: pointer;" onclick="app.exportReport('fuelings')">
            <div style="text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(34, 197, 94, 0.1); color: #22c55e; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem;">
                <i class="fas fa-gas-pump"></i>
              </div>
              <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Отчет по заправкам</h3>
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">История всех заправок</p>
              <button class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-download"></i>
                Скачать Excel
              </button>
            </div>
          </div>
          
          <div class="card" style="cursor: pointer;" onclick="app.exportReport('repairs')">
            <div style="text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem;">
                <i class="fas fa-wrench"></i>
              </div>
              <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Отчет по ремонтам</h3>
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">Все ремонты и затраты</p>
              <button class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-download"></i>
                Скачать Excel
              </button>
            </div>
          </div>
          
          <div class="card" style="cursor: pointer;" onclick="app.exportReport('summary')">
            <div style="text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(251, 146, 60, 0.1); color: #fb923c; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto 1rem;">
                <i class="fas fa-chart-line"></i>
              </div>
              <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Сводный отчет</h3>
              <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem;">Общая статистика за период</p>
              <button class="btn btn-primary" style="width: 100%;">
                <i class="fas fa-download"></i>
                Скачать Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  exportReport(type) {
    this.showToast(`Экспорт отчета "${type}" начат. Файл будет скачан автоматически.`, 'info')
    
    // In real implementation, this would generate and download an Excel file
    // For demo, just show success message
    setTimeout(() => {
      this.showToast('Отчет успешно экспортирован!', 'success')
    }, 1500)
  }



  renderVehicleRequests() {
    const pending = this.vehiclePurchaseRequests.filter(r => r.status === 'pending')
    const approved = this.vehiclePurchaseRequests.filter(r => r.status === 'approved')
    const rejected = this.vehiclePurchaseRequests.filter(r => r.status === 'rejected')
    
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Заявки на закуп техники</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Управление заявками на приобретение транспортных средств</p>
        
        <!-- Pending Requests -->
        ${pending.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #fb923c;">
              <i class="fas fa-clock"></i>
              Ожидают одобрения (${pending.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${pending.map(req => this.renderVehicleRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Approved Requests -->
        ${approved.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #22c55e;">
              <i class="fas fa-check-circle"></i>
              Одобренные (${approved.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${approved.map(req => this.renderVehicleRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Rejected Requests -->
        ${rejected.length > 0 ? `
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #64748b;">
              <i class="fas fa-times-circle"></i>
              Отклоненные (${rejected.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${rejected.map(req => this.renderVehicleRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `
  }

  renderVehicleRequestCard(req) {
    const statusColors = {
      pending: { bg: 'rgba(251, 146, 60, 0.1)', text: '#fb923c', label: 'Ожидает' },
      approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Одобрено' },
      rejected: { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748b', label: 'Отклонено' }
    }
    const status = statusColors[req.status]
    
    return `
      <div class="card">
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
            <i class="fas fa-truck"></i>
          </div>
          <div style="flex: 1;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${req.brand} ${req.model}</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <div class="badge" style="background: ${status.bg}; color: ${status.text};">${status.label}</div>
              <div class="badge badge-${req.priority === 'high' ? 'danger' : req.priority === 'medium' ? 'warning' : 'info'}">${req.priority === 'high' ? 'Срочно' : req.priority === 'medium' ? 'Средний' : 'Низкий'}</div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Тип</div>
            <div style="font-weight: 600;">${req.vehicleType}</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Количество</div>
            <div style="font-weight: 600;">${req.quantity} шт</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Цена за ед.</div>
            <div style="font-weight: 600;">${req.estimatedPrice.toLocaleString()} ₵</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Общая стоимость</div>
            <div style="font-weight: 600; color: #ef4444;">${req.totalCost.toLocaleString()} ₵</div>
          </div>
        </div>
        
        <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 1rem;">
          <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem;">Причина</div>
          <div style="font-weight: 500;">${req.reason}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem; color: #94a3b8;">
          <div><i class="fas fa-user"></i> ${req.requestedBy}</div>
          <div><i class="fas fa-calendar"></i> ${req.requestDate}</div>
          <div><i class="fas fa-truck-loading"></i> ${req.expectedDelivery}</div>
        </div>
        
        ${req.notes ? `
          <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 1rem; font-size: 0.875rem;">
            <i class="fas fa-info-circle" style="color: #3b82f6;"></i> ${req.notes}
          </div>
        ` : ''}
        
        ${req.status === 'pending' ? `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <button class="btn btn-success" onclick="app.approveVehicleRequest(${req.id})" style="width: 100%;">
              <i class="fas fa-check"></i> Одобрить
            </button>
            <button class="btn btn-danger" onclick="app.rejectVehicleRequest(${req.id})" style="width: 100%;">
              <i class="fas fa-times"></i> Отклонить
            </button>
          </div>
        ` : ''}
      </div>
    `
  }

  async approveVehicleRequest(id) {
    try {
      await axios.post(`/api/vehicle-purchase-requests/${id}/approve`)
      this.showToast('Заявка одобрена', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при одобрении', 'error')
    }
  }

  async rejectVehicleRequest(id) {
    try {
      await axios.post(`/api/vehicle-purchase-requests/${id}/reject`)
      this.showToast('Заявка отклонена', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при отклонении', 'error')
    }
  }

  renderPartsRequests() {
    const pending = this.partsRequests.filter(r => r.status === 'pending')
    const approved = this.partsRequests.filter(r => r.status === 'approved' || r.status === 'ordered')
    const rejected = this.partsRequests.filter(r => r.status === 'rejected')
    
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Заявки на закуп запчастей</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Детализация заявок на приобретение запчастей для техники</p>
        
        <!-- Pending Requests -->
        ${pending.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #fb923c;">
              <i class="fas fa-clock"></i>
              Ожидают одобрения (${pending.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${pending.map(req => this.renderPartsRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Approved/Ordered Requests -->
        ${approved.length > 0 ? `
          <div style="margin-bottom: 2rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #22c55e;">
              <i class="fas fa-check-circle"></i>
              Одобренные / В заказе (${approved.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${approved.map(req => this.renderPartsRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Rejected Requests -->
        ${rejected.length > 0 ? `
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #64748b;">
              <i class="fas fa-times-circle"></i>
              Отклоненные (${rejected.length})
            </h2>
            <div style="display: grid; gap: 1rem;">
              ${rejected.map(req => this.renderPartsRequestCard(req)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `
  }

  renderPartsRequestCard(req) {
    const statusColors = {
      pending: { bg: 'rgba(251, 146, 60, 0.1)', text: '#fb923c', label: 'Ожидает' },
      approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Одобрено' },
      ordered: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'В заказе' },
      rejected: { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748b', label: 'Отклонено' }
    }
    const status = statusColors[req.status]
    
    return `
      <div class="card">
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
          <div style="width: 56px; height: 56px; background: rgba(239, 68, 68, 0.1); color: #ef4444; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
            <i class="fas fa-cog"></i>
          </div>
          <div style="flex: 1;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${req.partName}</h3>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <div style="color: #64748b; font-size: 0.875rem;">${req.vehicleName} (${req.vehiclePlate})</div>
              <div class="badge" style="background: ${status.bg}; color: ${status.text};">${status.label}</div>
              <div class="badge badge-${req.priority === 'high' ? 'danger' : req.priority === 'medium' ? 'warning' : 'info'}">${req.priority === 'high' ? 'Срочно' : req.priority === 'medium' ? 'Средний' : 'Низкий'}</div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Артикул</div>
            <div style="font-weight: 600; font-family: monospace; font-size: 0.875rem;">${req.partNumber}</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Количество</div>
            <div style="font-weight: 600;">${req.quantity} ${req.unit}</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Цена за ед.</div>
            <div style="font-weight: 600;">${req.estimatedPrice.toLocaleString()} ₵</div>
          </div>
          <div>
            <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Общая стоимость</div>
            <div style="font-weight: 600; color: #ef4444;">${req.totalCost.toLocaleString()} ₵</div>
          </div>
        </div>
        
        <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 1rem;">
          <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.5rem;">Причина</div>
          <div style="font-weight: 500; margin-bottom: 0.75rem;">${req.reason}</div>
          <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Поставщик</div>
          <div style="font-weight: 500;">${req.supplier}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem; font-size: 0.875rem; color: #94a3b8;">
          <div><i class="fas fa-user-cog"></i> ${req.requestedBy}</div>
          <div><i class="fas fa-user"></i> Водитель: ${req.driver}</div>
          <div><i class="fas fa-calendar"></i> ${req.requestDate}</div>
          <div><i class="fas fa-truck-loading"></i> ${req.expectedDelivery}</div>
        </div>
        
        ${req.notes ? `
          <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 1rem; font-size: 0.875rem;">
            <i class="fas fa-info-circle" style="color: #3b82f6;"></i> ${req.notes}
          </div>
        ` : ''}
        
        ${req.status === 'pending' ? `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <button class="btn btn-success" onclick="app.approvePartsRequest(${req.id})" style="width: 100%;">
              <i class="fas fa-check"></i> Одобрить
            </button>
            <button class="btn btn-danger" onclick="app.rejectPartsRequest(${req.id})" style="width: 100%;">
              <i class="fas fa-times"></i> Отклонить
            </button>
          </div>
        ` : ''}
      </div>
    `
  }

  async approvePartsRequest(id) {
    try {
      await axios.post(`/api/parts-requests/${id}/approve`)
      this.showToast('Заявка одобрена', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при одобрении', 'error')
    }
  }

  async rejectPartsRequest(id) {
    try {
      await axios.post(`/api/parts-requests/${id}/reject`)
      this.showToast('Заявка отклонена', 'success')
      await this.loadData()
    } catch (error) {
      this.showToast('Ошибка при отклонении', 'error')
    }
  }

  renderDriverRequests() {
    return `
      <div>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary" onclick="app.navigateTo('drivers')">
            <i class="fas fa-arrow-left"></i>
            Назад к водителям
          </button>
          <div style="flex: 1;">
            <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">Заявки на регистрацию</h1>
            <p style="color: #64748b;">Новые водители ожидают одобрения</p>
          </div>
        </div>
        
        ${this.driverRequests.length === 0 ? `
          <div style="text-align: center; padding: 4rem 2rem; color: #64748b;">
            <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <p style="font-size: 1.125rem;">Нет новых заявок</p>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;">
            ${this.driverRequests.map(request => `
              <div class="card">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                  <div style="width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                    <i class="fas fa-user"></i>
                  </div>
                  <div style="flex: 1;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${request.name}</h3>
                    <div class="badge badge-warning">Ожидает одобрения</div>
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Телефон</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${request.phone}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Telegram</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${request.telegram}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Опыт</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${request.experience}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Категория</div>
                    <div style="font-size: 0.875rem; font-weight: 500;">${request.license}</div>
                  </div>
                </div>
                
                <div style="padding-top: 1rem; border-top: 1px solid #1e293b; margin-bottom: 1rem;">
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Дата подачи заявки</div>
                  <div style="font-size: 0.875rem; font-weight: 500;">${request.date}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <button class="btn btn-success" onclick="app.approveDriver(${request.id})" style="width: 100%;">
                    <i class="fas fa-check"></i>
                    Одобрить
                  </button>
                  <button class="btn btn-danger" onclick="app.rejectDriver(${request.id})" style="width: 100%;">
                    <i class="fas fa-times"></i>
                    Отклонить
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `
  }

  renderDriverDetail(driverId) {
    const driver = this.drivers.find(d => d.id === driverId)
    if (!driver) {
      return `
        <div style="text-align: center; padding: 4rem 2rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #fb923c; margin-bottom: 1rem;"></i>
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Водитель не найден</h2>
          <button class="btn btn-primary" onclick="app.navigateTo('drivers')">
            Вернуться к списку водителей
          </button>
        </div>
      `
    }
    
    return `
      <div>
        <!-- Header with back button -->
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn btn-secondary" onclick="app.navigateTo('drivers')">
            <i class="fas fa-arrow-left"></i>
            Назад
          </button>
          <div style="flex: 1;">
            <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${driver.name}</h1>
            <p style="color: #64748b;">Детальная информация о водителе</p>
          </div>
          <div class="badge badge-success" style="font-size: 1rem; padding: 0.5rem 1rem;">
            <i class="fas fa-check-circle"></i>
            ${driver.status === 'active' ? 'Активен' : 'Неактивен'}
          </div>
        </div>
        
        <!-- Photos Section -->
        <div class="card" style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-images"></i>
            Фотографии документов
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <!-- Driver Photo -->
            <div>
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i class="fas fa-user"></i> Фото водителя
              </h3>
              <div style="aspect-ratio: 3/4; background: #1e293b; border-radius: 12px; overflow: hidden; border: 2px solid #334155;">
                <img src="${driver.photo}" alt="Driver Photo" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27400%27%3E%3Crect fill=%27%231e293b%27 width=%27300%27 height=%27400%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2720%27%3ENo Photo%3C/text%3E%3C/svg%3E'" />
              </div>
            </div>
            
            <!-- Passport Photo -->
            <div>
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i class="fas fa-passport"></i> Паспорт
              </h3>
              <div style="aspect-ratio: 3/4; background: #1e293b; border-radius: 12px; overflow: hidden; border: 2px solid #334155;">
                <img src="${driver.passportPhoto}" alt="Passport" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27400%27%3E%3Crect fill=%27%231e293b%27 width=%27300%27 height=%27400%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2716%27%3ENo Passport%3C/text%3E%3C/svg%3E'" />
              </div>
            </div>
            
            <!-- License Photo -->
            <div>
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i class="fas fa-id-card"></i> Водительское удостоверение
              </h3>
              <div style="aspect-ratio: 3/4; background: #1e293b; border-radius: 12px; overflow: hidden; border: 2px solid #334155;">
                <img src="${driver.licensePhoto}" alt="License" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27400%27%3E%3Crect fill=%27%231e293b%27 width=%27300%27 height=%27400%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 font-size=%2716%27%3ENo License%3C/text%3E%3C/svg%3E'" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Personal Information -->
        <div class="card" style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-user-circle"></i>
            Личная информация
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">ФИО</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.name}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Дата рождения</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.birthDate}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                <i class="fas fa-phone"></i> Телефон
              </div>
              <div style="font-size: 1.125rem; font-weight: 600; color: #3b82f6;">${driver.phone}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                <i class="fab fa-telegram"></i> Telegram
              </div>
              <div style="font-size: 1.125rem; font-weight: 600; color: #3b82f6;">${driver.telegram}</div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                <i class="fas fa-map-marker-alt"></i> Адрес
              </div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.address}</div>
            </div>
          </div>
        </div>
        
        <!-- Passport Data -->
        <div class="card" style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-passport"></i>
            Паспортные данные
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Серия и номер паспорта</div>
              <div style="font-size: 1.125rem; font-weight: 600; font-family: monospace;">${driver.passportSeries} ${driver.passportNumber}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Дата выдачи</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.passportIssueDate}</div>
            </div>
            <div style="grid-column: 1 / -1;">
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Кем выдан</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.passportIssuer}</div>
            </div>
          </div>
        </div>
        
        <!-- Work Information -->
        <div class="card">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">
            <i class="fas fa-briefcase"></i>
            Рабочая информация
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Категория прав</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.license}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Стаж работы</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.experience}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Дата приема на работу</div>
              <div style="font-size: 1.125rem; font-weight: 600;">${driver.hireDate}</div>
            </div>
            <div>
              <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">Текущая техника</div>
              <div style="font-size: 1.125rem; font-weight: 600; color: #3b82f6;">${driver.currentVehicle}</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderForecast() {
    if (!this.maintenanceForecast) return '<p>Загрузка...</p>'
    
    const forecast = this.maintenanceForecast
    
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Прогноз расходов</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Приблизительный расчет расходов на запчасти, масло и топливо на месяц вперед</p>
        
        <!-- Summary -->
        ${forecast.summary ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <i class="fas fa-gas-pump"></i>
              </div>
              <div class="stat-value">${forecast.summary.totalFuelCost.toLocaleString()} ₵</div>
              <div class="stat-label">Топливо за месяц</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                <i class="fas fa-wrench"></i>
              </div>
              <div class="stat-value">${forecast.summary.totalMaintenanceCost.toLocaleString()} ₵</div>
              <div class="stat-label">Обслуживание за месяц</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(251, 146, 60, 0.1); color: #fb923c;">
                <i class="fas fa-calculator"></i>
              </div>
              <div class="stat-value">${forecast.summary.grandTotal.toLocaleString()} ₵</div>
              <div class="stat-label">Общий прогноз</div>
            </div>
          </div>
        ` : ''}
        
        <!-- Per Vehicle Forecast -->
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Прогноз по технике</h2>
        <div style="display: grid; gap: 1rem;">
          ${forecast.vehicles.map(v => `
            <div class="card">
              <div style="display: flex; gap: 1rem; align-items: start; margin-bottom: 1rem;">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6, #1e40af); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
                  <i class="fas fa-truck"></i>
                </div>
                <div style="flex: 1;">
                  <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${v.vehicleName}</h3>
                  <div style="color: #64748b; font-size: 0.875rem;">${v.vehiclePlate}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 1.5rem; font-weight: 700; color: #fb923c;">${v.estimatedTotalCost.toLocaleString()} ₵</div>
                  <div style="font-size: 0.75rem; color: #64748b;">в месяц</div>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; padding-top: 1rem; border-top: 1px solid #1e293b;">
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Пробег в месяц</div>
                  <div style="font-weight: 600;">${v.monthlyKm.toLocaleString()} км</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Расход топлива</div>
                  <div style="font-weight: 600;">${v.fuelConsumption} л/км</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Топливо</div>
                  <div style="font-weight: 600; color: #3b82f6;">${v.estimatedFuelCost.toLocaleString()} ₵</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Обслуживание</div>
                  <div style="font-weight: 600; color: #ef4444;">${v.estimatedMaintenanceCost.toLocaleString()} ₵</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(59, 130, 246, 0.1); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2);">
          <div style="display: flex; gap: 1rem; align-items: start;">
            <i class="fas fa-info-circle" style="font-size: 1.5rem; color: #3b82f6; flex-shrink: 0; margin-top: 0.25rem;"></i>
            <div>
              <div style="font-weight: 600; margin-bottom: 0.5rem;">О прогнозе</div>
              <div style="color: #94a3b8; font-size: 0.875rem;">
                Расчет основан на среднем пробеге техники за месяц, среднем расходе топлива и плановых расходах на обслуживание. 
                Фактические расходы могут отличаться в зависимости от условий эксплуатации, внеплановых ремонтов и изменения цен на топливо и запчасти.
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderVehicleDetail(vehicleId) {
    const vehicle = this.vehicles.find(v => v.id === parseInt(vehicleId))
    if (!vehicle) {
      return '<div class="card"><p>Техника не найдена</p></div>'
    }

    // Получаем историю заправок и ремонтов
    const vehicleFuelings = this.fuelings.filter(f => f.vehicleId === vehicle.id)
    const vehicleRepairs = this.repairs.filter(r => r.vehicleId === vehicle.id)
    
    // Получаем информацию о водителе
    const driver = this.drivers.find(d => d.id === vehicle.driverId)
    
    return `
      <div>
        <!-- Навигация назад -->
        <div style="margin-bottom: 2rem;">
          <button class="btn btn-secondary" onclick="app.navigateTo('vehicles')" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-arrow-left"></i>
            Назад к технике
          </button>
        </div>

        <!-- Заголовок -->
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${vehicle.name}</h1>
          <p style="color: #64748b;">Гос. номер: ${vehicle.plate} • VIN: ${vehicle.vin}</p>
        </div>

        <!-- Основная информация -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Левая колонка: фото и информация -->
          <div>
            <!-- Фото транспорта -->
            <div class="card" style="margin-bottom: 1.5rem;">
              <h3 class="card-title" style="margin-bottom: 1rem;">
                <i class="fas fa-images"></i>
                Фото транспорта
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${vehicle.photos.map(photo => `
                  <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; overflow: hidden; position: relative;">
                    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #64748b;">
                      <div style="text-align: center;">
                        <i class="fas fa-image" style="font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                        <div style="font-size: 0.875rem;">Фото техники</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Фото техпаспорта -->
            <div class="card" style="margin-bottom: 1.5rem;">
              <h3 class="card-title" style="margin-bottom: 1rem;">
                <i class="fas fa-id-card"></i>
                Техпаспорт
              </h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                ${vehicle.techPassportPhotos.map((photo, index) => `
                  <div>
                    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem; font-weight: 600;">
                      ${index === 0 ? 'Лицевая сторона' : 'Обратная сторона'}
                    </div>
                    <div style="aspect-ratio: 3/2; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; overflow: hidden; position: relative;">
                      <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #64748b;">
                        <div style="text-align: center;">
                          <i class="fas fa-file-alt" style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                          <div style="font-size: 0.875rem;">Техпаспорт</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Основная информация о технике -->
            <div class="card">
              <h3 class="card-title" style="margin-bottom: 1rem;">
                <i class="fas fa-info-circle"></i>
                Информация о технике
              </h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Тип техники</div>
                  <div style="font-weight: 600;">${vehicle.type}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Статус</div>
                  <div class="badge ${vehicle.status === 'active' ? 'badge-success' : 'badge-warning'}">
                    ${vehicle.status === 'active' ? 'Активна' : 'Требуется внимание'}
                  </div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Дата покупки</div>
                  <div style="font-weight: 600;">${vehicle.purchaseDate}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">VIN</div>
                  <div style="font-weight: 600; font-family: monospace; font-size: 0.875rem;">${vehicle.vin}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Пробег</div>
                  <div style="font-weight: 600;">${vehicle.mileage.toLocaleString()} км</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">До ТО</div>
                  <div style="font-weight: 600;">${(vehicle.nextService - vehicle.mileage).toLocaleString()} км</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Водитель</div>
                  <div style="font-weight: 600; color: #3b82f6; cursor: pointer;" onclick="app.navigateTo('driver-detail', ${vehicle.driverId})">
                    ${vehicle.driver}
                    <i class="fas fa-external-link-alt" style="font-size: 0.75rem; margin-left: 0.25rem;"></i>
                  </div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Топливо</div>
                  <div class="badge ${vehicle.fuelLevel < 30 ? 'badge-danger' : vehicle.fuelLevel < 50 ? 'badge-warning' : 'badge-success'}">
                    <i class="fas fa-gas-pump"></i>
                    ${vehicle.fuelLevel}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Правая колонка: карта -->
          <div>
            <div class="card" style="position: sticky; top: 1.5rem;">
              <h3 class="card-title" style="margin-bottom: 1rem;">
                <i class="fas fa-map-marker-alt"></i>
                Местоположение
              </h3>
              <div style="margin-bottom: 1rem;">
                <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Текущая локация</div>
                <div style="font-weight: 600;">${vehicle.location}</div>
              </div>
              <div id="vehicle-map-${vehicle.id}" style="height: 400px; border-radius: 8px; overflow: hidden; background: #1e293b;">
                <!-- Карта будет инициализирована через Leaflet -->
              </div>
              <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 8px; font-size: 0.875rem;">
                <i class="fas fa-info-circle" style="color: #3b82f6; margin-right: 0.5rem;"></i>
                <span style="color: #94a3b8;">Координаты: ${vehicle.latitude}, ${vehicle.longitude}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- История ремонтов -->
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 class="card-title">
              <i class="fas fa-wrench"></i>
              История ремонтов (${vehicleRepairs.length})
            </h3>
            <button class="btn btn-primary" onclick="app.exportVehicleRepairHistory(${vehicle.id})">
              <i class="fas fa-file-excel"></i>
              Экспорт в Excel
            </button>
          </div>
          
          <!-- Сортируемая таблица -->
          <div class="table-container">
            <table id="repairs-table" style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #1e293b;">
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #64748b; cursor: pointer;" onclick="app.sortRepairsTable('date')">
                    Дата
                    <i class="fas fa-sort" style="margin-left: 0.25rem; font-size: 0.75rem;"></i>
                  </th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #64748b;">Описание работ</th>
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #64748b;">Запчасти</th>
                  <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #64748b; cursor: pointer;" onclick="app.sortRepairsTable('partsCost')">
                    Стоимость запчастей
                    <i class="fas fa-sort" style="margin-left: 0.25rem; font-size: 0.75rem;"></i>
                  </th>
                  <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #64748b; cursor: pointer;" onclick="app.sortRepairsTable('laborCost')">
                    Работа
                    <i class="fas fa-sort" style="margin-left: 0.25rem; font-size: 0.75rem;"></i>
                  </th>
                  <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #64748b; cursor: pointer;" onclick="app.sortRepairsTable('totalCost')">
                    Итого
                    <i class="fas fa-sort" style="margin-left: 0.25rem; font-size: 0.75rem;"></i>
                  </th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #64748b;">Статус</th>
                </tr>
              </thead>
              <tbody id="repairs-tbody">
                ${vehicleRepairs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(repair => `
                  <tr style="border-bottom: 1px solid #1e293b;">
                    <td style="padding: 0.75rem; white-space: nowrap;">${repair.date}</td>
                    <td style="padding: 0.75rem;">
                      <div style="font-weight: 600; margin-bottom: 0.25rem;">${repair.description}</div>
                      <div style="font-size: 0.875rem; color: #64748b;">Механик: ${repair.mechanic}</div>
                    </td>
                    <td style="padding: 0.75rem;">
                      <div style="font-size: 0.875rem;">
                        ${repair.parts.map(part => `
                          <div style="margin-bottom: 0.25rem;">
                            • ${part.name}: ${part.quantity} ${part.unit}
                          </div>
                        `).join('')}
                      </div>
                    </td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: #3b82f6;">
                      ${repair.partsCost.toLocaleString()} ₵
                    </td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: #fb923c;">
                      ${repair.laborCost.toLocaleString()} ₵
                    </td>
                    <td style="padding: 0.75rem; text-align: right; font-weight: 700; color: #ef4444;">
                      ${repair.totalCost.toLocaleString()} ₵
                    </td>
                    <td style="padding: 0.75rem; text-align: center;">
                      <span class="badge ${repair.status === 'completed' ? 'badge-success' : 'badge-warning'}">
                        ${repair.status === 'completed' ? 'Завершен' : 'В работе'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Итоговая статистика -->
          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #1e293b;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div>
                <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Всего ремонтов</div>
                <div style="font-size: 1.5rem; font-weight: 700;">${vehicleRepairs.length}</div>
              </div>
              <div>
                <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Общие затраты на запчасти</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">
                  ${vehicleRepairs.reduce((sum, r) => sum + r.partsCost, 0).toLocaleString()} ₵
                </div>
              </div>
              <div>
                <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Общие затраты на работу</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #fb923c;">
                  ${vehicleRepairs.reduce((sum, r) => sum + r.laborCost, 0).toLocaleString()} ₵
                </div>
              </div>
              <div>
                <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Общая стоимость всех ремонтов</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">
                  ${vehicleRepairs.reduce((sum, r) => sum + r.totalCost, 0).toLocaleString()} ₵
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  sortRepairsTable(column) {
    // Эта функция будет реализована для сортировки таблицы
    this.showToast('Функция сортировки будет добавлена', 'info')
  }

  exportVehicleRepairHistory(vehicleId) {
    const vehicle = this.vehicles.find(v => v.id === vehicleId)
    const vehicleRepairs = this.repairs.filter(r => r.vehicleId === vehicleId)
    
    // Создаем CSV данные
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "Дата,Описание,Запчасти,Стоимость запчастей,Работа,Итого,Статус,Механик\\n"
    
    vehicleRepairs.forEach(repair => {
      const parts = repair.parts.map(p => \`\${p.name} (\${p.quantity} \${p.unit})\`).join('; ')
      csvContent += \`\${repair.date},"\${repair.description}","\${parts}",\${repair.partsCost},\${repair.laborCost},\${repair.totalCost},\${repair.status},\${repair.mechanic}\\n\`
    })
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", \`\${vehicle.name}_\${vehicle.plate}_repairs.csv\`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    this.showToast(\`История ремонтов экспортирована: \${vehicle.name}\`, 'success')
  }

  render() {
    const app = document.getElementById('app')
    
    if (!this.isAuthenticated) {
      app.innerHTML = this.renderLoginPage()
      
      // Attach login form handler
      setTimeout(() => {
        const form = document.getElementById('loginForm')
        if (form) {
          form.onsubmit = (e) => {
            e.preventDefault()
            const username = document.getElementById('username').value
            const password = document.getElementById('password').value
            this.login(username, password)
          }
        }
      }, 0)
      
      return
    }
    
    // Main app layout
    let pageContent
    if (this.currentPage === 'driver-detail' && this.currentPageParam) {
      pageContent = this.renderDriverDetail(this.currentPageParam)
    } else if (this.currentPage === 'vehicle-detail' && this.currentPageParam) {
      pageContent = this.renderVehicleDetail(this.currentPageParam)
    } else {
      const pages = {
        dashboard: this.renderDashboard(),
        vehicles: this.renderVehicles(),
        fuelings: this.renderFuelings(),
        repairs: this.renderRepairs(),
        drivers: this.renderDrivers(),
        'driver-requests': this.renderDriverRequests(),
        'vehicle-requests': this.renderVehicleRequests(),
        'parts-requests': this.renderPartsRequests(),
        forecast: this.renderForecast(),
        reports: this.renderReports()
      }
      pageContent = pages[this.currentPage] || pages.dashboard
    }
    
    app.innerHTML = `
      ${this.renderSidebar()}
      ${this.renderTopbar()}
      <div class="main-content">
        ${pageContent}
      </div>
    `
    
    // Инициализируем карту после рендеринга (если на странице vehicle-detail)
    if (this.currentPage === 'vehicle-detail' && this.currentPageParam) {
      setTimeout(() => this.initVehicleMap(this.currentPageParam), 100)
    }
  }
  
  initVehicleMap(vehicleId) {
    const vehicle = this.vehicles.find(v => v.id === parseInt(vehicleId))
    if (!vehicle) return
    
    const mapElement = document.getElementById(`vehicle-map-${vehicle.id}`)
    if (!mapElement || !window.L) return
    
    // Создаем карту
    const map = L.map(`vehicle-map-${vehicle.id}`).setView([vehicle.latitude, vehicle.longitude], 13)
    
    // Добавляем слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)
    
    // Создаем кастомную иконку машины
    const truckIcon = L.divIcon({
      html: '<div style="background: #3b82f6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 3px solid white;"><i class="fas fa-truck"></i></div>',
      className: 'custom-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
    
    // Добавляем маркер с кастомной иконкой
    L.marker([vehicle.latitude, vehicle.longitude], { icon: truckIcon })
      .addTo(map)
      .bindPopup(`
        <div style="padding: 0.5rem; min-width: 200px;">
          <div style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem; color: #0f172a;">
            ${vehicle.name}
          </div>
          <div style="color: #64748b; margin-bottom: 0.25rem;">
            <strong>Гос. номер:</strong> ${vehicle.plate}
          </div>
          <div style="color: #64748b; margin-bottom: 0.25rem;">
            <strong>Водитель:</strong> ${vehicle.driver}
          </div>
          <div style="color: #64748b; margin-bottom: 0.25rem;">
            <strong>Локация:</strong> ${vehicle.location}
          </div>
          <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(59, 130, 246, 0.1); border-radius: 4px; font-size: 0.875rem; color: #3b82f6;">
            <i class="fas fa-map-marker-alt"></i>
            ${vehicle.latitude}, ${vehicle.longitude}
          </div>
        </div>
      `)
      .openPopup()
  }
}

// Initialize app
const app = new App()

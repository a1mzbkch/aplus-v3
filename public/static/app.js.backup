// Transport Control System - GenSpark Dark Theme
// Main Application Logic

class App {
  constructor() {
    this.currentPage = 'login'
    this.isAuthenticated = false
    this.user = null
    this.notifications = []
    this.vehicles = []
    this.fuelings = []
    this.repairs = []
    this.driverRequests = []
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
      const [vehicles, fuelings, repairs, driverRequests, notifications, currency] = await Promise.all([
        axios.get('/api/vehicles'),
        axios.get('/api/fuelings'),
        axios.get('/api/repairs'),
        axios.get('/api/driver-requests'),
        axios.get('/api/notifications'),
        axios.get('/api/currency')
      ])
      
      this.vehicles = vehicles.data
      this.fuelings = fuelings.data
      this.repairs = repairs.data
      this.driverRequests = driverRequests.data
      this.notifications = notifications.data
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

  navigateTo(page) {
    this.currentPage = page
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
      { id: 'notifications', icon: 'fa-bell', label: 'Уведомления' },
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
              ${item.id === 'notifications' && this.notifications.length > 0 ? 
                `<span class="badge badge-danger" style="margin-left: auto;">${this.notifications.length}</span>` : ''}
              ${item.id === 'drivers' && this.driverRequests.length > 0 ? 
                `<span class="badge badge-warning" style="margin-left: auto;">${this.driverRequests.length}</span>` : ''}
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
          ${this.currency ? `
            <div style="display: flex; gap: 1rem; padding: 0.5rem 1rem; background: #1e293b; border-radius: 8px; font-size: 0.875rem;">
              <span><i class="fas fa-dollar-sign text-primary"></i> ${this.currency.som_to_usd} сом</span>
              <span><i class="fas fa-euro-sign text-primary"></i> ${this.currency.som_to_eur} сом</span>
            </div>
          ` : ''}
          
          <div class="topbar-notification" onclick="app.navigateTo('notifications')">
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
                <div class="table-row" onclick="app.showVehicleDetails(${vehicle.id})" style="padding: 1rem; border-bottom: 1px solid #1e293b;">
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
    return `
      <div>
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">Техника</h1>
        <p style="color: #64748b; margin-bottom: 2rem;">Управление транспортными средствами</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
          ${this.vehicles.map(vehicle => `
            <div class="card" style="cursor: pointer;" onclick="app.showVehicleDetails(${vehicle.id})">
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
    `
  }

  showVehicleDetails(id) {
    const vehicle = this.vehicles.find(v => v.id === id)
    if (!vehicle) return
    
    const vehicleFuelings = this.fuelings.filter(f => f.vehicleId === id)
    const vehicleRepairs = this.repairs.filter(r => r.vehicleId === id)
    
    const modal = document.createElement('div')
    modal.className = 'modal-overlay'
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove()
    }
    
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${vehicle.name} (${vehicle.plate})</h2>
          <div class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <div class="modal-body">
          <!-- Photos -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Фотографии</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
              ${vehicle.photos.map(photo => `
                <div style="aspect-ratio: 16/9; background: #1e293b; border-radius: 8px; overflow: hidden;">
                  <img src="${photo}" alt="Vehicle" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27150%27%3E%3Crect fill=%27%231e293b%27 width=%27200%27 height=%27150%27/%3E%3Ctext fill=%27%2364748b%27 x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27%3ENo Image%3C/text%3E%3C/svg%3E'" />
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Info -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="card" style="padding: 1rem;">
              <div style="color: #64748b; font-size: 0.875rem; margin-bottom: 0.25rem;">Водитель</div>
              <div style="font-weight: 600;">${vehicle.driver}</div>
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
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Последние заправки</h3>
            ${vehicleFuelings.length > 0 ? vehicleFuelings.map(f => `
              <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${f.liters} л</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${f.date}</div>
                  </div>
                  <div class="badge badge-success">${f.amount.toLocaleString()} ₵</div>
                </div>
              </div>
            `).join('') : '<p style="color: #64748b; text-align: center; padding: 2rem;">Нет данных</p>'}
          </div>
          
          <!-- Recent Repairs -->
          <div>
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Последние ремонты</h3>
            ${vehicleRepairs.length > 0 ? vehicleRepairs.map(r => `
              <div style="padding: 1rem; background: #1e293b; border-radius: 8px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${r.description}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${r.date}</div>
                  </div>
                  <div class="badge badge-danger">${r.totalCost.toLocaleString()} ₵</div>
                </div>
                <div style="font-size: 0.875rem; color: #94a3b8;">${r.parts}</div>
              </div>
            `).join('') : '<p style="color: #64748b; text-align: center; padding: 2rem;">Нет данных</p>'}
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(modal)
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
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <i class="fas fa-exclamation-circle" style="font-size: 1.5rem; color: #fb923c;"></i>
              <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Новые заявки</div>
                <div style="font-size: 0.875rem; color: #94a3b8;">${this.driverRequests.length} заявок ожидают одобрения</div>
              </div>
            </div>
          </div>
        ` : ''}
        
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
    const pages = {
      dashboard: this.renderDashboard(),
      vehicles: this.renderVehicles(),
      fuelings: this.renderFuelings(),
      repairs: this.renderRepairs(),
      drivers: this.renderDrivers(),
      notifications: this.renderNotifications(),
      reports: this.renderReports()
    }
    
    app.innerHTML = `
      ${this.renderSidebar()}
      ${this.renderTopbar()}
      <div class="main-content">
        ${pages[this.currentPage] || pages.dashboard}
      </div>
    `
  }
}

// Initialize app
const app = new App()

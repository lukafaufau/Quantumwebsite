// Fonction Netlify pour gérer toutes les routes API
exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };
  
  // Gérer les requêtes OPTIONS (preflight)
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }
  
  // Données mockées pour le déploiement
  const mockData = {
    users: [
      {
        id: 1,
        username: "Wayzze",
        email: "wayzze@Nemesis.gg",
        role: "admin",
        discord_id: "Wayzze#0001",
        status: "active",
        created_at: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        username: "16k",
        email: "16k@Nemesis.gg",
        role: "developer",
        discord_id: "16k#0002",
        status: "active",
        created_at: "2024-01-01T00:00:00.000Z"
      }
    ],
    teams: [],
    announcements: [
      {
        id: 1,
        title: "Bienvenue sur Nemesis",
        description: "La plateforme esport française est maintenant en ligne !",
        type: "news",
        date: new Date().toISOString(),
        author: "Admin"
      }
    ],
    applications: []
  };
  
  try {
    // Router simple pour les différentes routes
    if (path === '/auth' && method === 'POST') {
      const { username, password } = JSON.parse(event.body || '{}');
      const user = mockData.users.find(u => u.username === username || u.email === username);
      
      if (user && password === 'password') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, user }),
        };
      }
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
      };
    }
    
    if (path === '/admin/stats') {
      const stats = {
        users: {
          total: mockData.users.length,
          active: mockData.users.filter(u => u.status === 'active').length,
          banned: 0,
          todaySignups: 0,
          byRole: {
            admin: mockData.users.filter(u => u.role === 'admin').length,
            developer: mockData.users.filter(u => u.role === 'developer').length,
            player: mockData.users.filter(u => u.role === 'player').length,
            staff: mockData.users.filter(u => u.role === 'staff').length,
          }
        },
        teams: { total: 0, active: 0, recruiting: 0, byGame: {} },
        applications: { total: 0, pending: 0, approved: 0, rejected: 0, todayApplications: 0 },
        announcements: { total: mockData.announcements.length, visible: mockData.announcements.length, byType: {} },
        system: {
          uptime: 1,
          version: "2.1.0",
          lastBackup: new Date().toISOString(),
          diskUsage: 25,
          memoryUsage: 45,
          cpuUsage: 15,
        }
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stats),
      };
    }
    
    if (path === '/admin/users') {
      if (method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(mockData.users),
        };
      }
      
      if (method === 'POST') {
        const userData = JSON.parse(event.body || '{}');
        const newUser = {
          id: mockData.users.length + 1,
          ...userData,
          status: 'active',
          created_at: new Date().toISOString()
        };
        mockData.users.push(newUser);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(newUser),
        };
      }
    }
    
    // Gestion des routes avec paramètres
    const userIdMatch = path.match(/^\/admin\/users\/(\d+)$/);
    if (userIdMatch && method === 'PUT') {
      const userId = parseInt(userIdMatch[1]);
      const updates = JSON.parse(event.body || '{}');
      const userIndex = mockData.users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        mockData.users[userIndex] = { ...mockData.users[userIndex], ...updates };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, user: mockData.users[userIndex] }),
        };
      }
      
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
    
    const banMatch = path.match(/^\/admin\/users\/(\d+)\/ban$/);
    if (banMatch && method === 'POST') {
      const userId = parseInt(banMatch[1]);
      const { reason } = JSON.parse(event.body || '{}');
      const userIndex = mockData.users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        mockData.users[userIndex] = {
          ...mockData.users[userIndex],
          status: 'banned',
          ban_reason: reason,
          banned_at: new Date().toISOString()
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, user: mockData.users[userIndex] }),
        };
      }
      
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
    
    // Route par défaut
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found', path, method }),
    };
    
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};
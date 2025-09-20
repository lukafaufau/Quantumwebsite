// Fonction Netlify pour gérer toutes les routes API
const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async (event, context) => {
  // Pour les déploiements Netlify, nous utilisons une approche simplifiée
  // Les routes API seront gérées côté client avec des données mockées
  
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
        email: "wayzze@quantum.gg",
        role: "admin",
        discord_id: "Wayzze#0001",
        status: "active"
      },
      {
        id: 2,
        username: "16k",
        email: "16k@quantum.gg",
        role: "developer",
        discord_id: "16k#0002",
        status: "active"
      }
    ],
    teams: [],
    announcements: [
      {
        id: 1,
        title: "Bienvenue sur Quantum",
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(mockData.users),
      };
    }
    
    // Route par défaut
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' }),
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
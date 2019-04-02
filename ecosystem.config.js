module.exports = {
  apps: [
    {
      name: 'Video-CMS',
      script: 'server.js',
      env: {
        NODE_ENV: 'development',
        NODE_PORT: 7789
      },
      env_production: {
        NODE_ENV: 'production',
        NODE_PORT: 7789
      }
    }
  ],
  deploy: {
    production: {
      user: 'videocms',
      host: 'videocms.pepex.kg',
      ref: 'origin/master',
      repo: 'git@github.com:PavelKg/Video-CMS-frontend.git',
      path: '~/services/videocms-frontend',
      'post-deploy':
        'npm i && npm run build &&  pm2 startOrRestart ecosystem.config.js --env production'
    },
    development: {
      user: 'videocms',
      host: 'videocms.pepex.kg',
      ref: 'origin/development',
      repo: 'git@github.com:PavelKg/Video-CMS-frontend.git',
      path: '~/services/videocms-frontend',
      'post-deploy':
        'npm i && npm run build &&  pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}

/**
 * PM2 process config for the Lidya backend.
 *
 * On the server:
 *   cd /var/www/lidya
 *   pm2 start deploy/ecosystem.config.js
 *   pm2 save && pm2 startup      # survives server reboots
 *
 * Useful:
 *   pm2 logs lidya-api           # live logs
 *   pm2 restart lidya-api        # after a deploy
 *   pm2 status
 */
module.exports = {
  apps: [
    {
      name: 'lidya-api',
      cwd: '/var/www/lidya/backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      // Environment values live in /var/www/lidya/backend/.env (loaded by the
      // app itself) — never commit secrets into this file.
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/lidya/api-error.log',
      out_file: '/var/log/lidya/api-out.log',
      time: true,
    },
  ],
};

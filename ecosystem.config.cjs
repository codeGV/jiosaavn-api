module.exports = {
  apps: [
    {
      name: 'jiosaavn-api',
      // Run bun directly and let it execute the package.json "start" script.
      // Absolute path to bun — get it with `command -v bun` and update if different.
      script: process.env.HOME + '/.bun/bin/bun',
      args: 'run start',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
}

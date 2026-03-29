module.exports = {
  apps: [{
    name: "unicore",
    script: "node_modules/next/dist/bin/next",
    // args: "start",
    args: "dev",
    cwd: "./",
    env: {
      // NODE_ENV: "production",
      NODE_ENV: "development",
      DATABASE_URL: "postgresql://neondb_owner:npg_yIGDt1Uou5xe@ep-curly-band-aducueep-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }]
}
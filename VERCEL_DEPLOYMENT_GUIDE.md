# MCPMarket Vercel Deployment Guide

## Prerequisites

- Vercel account
- GitHub repository with MCPMarket code
- Supabase project with configured database
- Environment variables ready

## Step 1: Prepare Environment Variables

Before deploying, ensure you have the following environment variables:

### Required Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Tempo Development Tools (set to empty for production)
NEXT_PUBLIC_TEMPO=
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - Project URL (for SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL)
   - Anon/Public key (for SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role key (for SUPABASE_SERVICE_KEY)

## Step 2: Database Setup

Ensure all database migrations are applied:

1. Run migrations in your Supabase project:
   ```sql
   -- All migration files in supabase/migrations/ should be applied
   ```

2. Verify tables exist:
   - `servers`
   - `deployments`
   - `notifications`
   - `saved_servers`
   - `cloud_providers`
   - `seo_pages`
   - `seo_keywords`
   - Blog-related tables

## Step 3: Vercel Project Setup

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (if code is in root)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   vercel
   ```

## Step 4: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each environment variable:
   - Name: `SUPABASE_URL`
   - Value: Your Supabase project URL
   - Environments: Production, Preview, Development

4. Repeat for all required variables

## Step 5: Build Configuration

### Verify next.config.js

Ensure your `next.config.js` is production-ready:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'api.dicebear.com',
      'upload.wikimedia.org'
    ],
  },
  // Only add experimental features in development
  ...(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_TEMPO && {
    experimental: {
      swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]
    }
  })
};

module.exports = nextConfig;
```

## Step 6: Deploy and Test

1. **Initial Deployment**:
   - Push your code to GitHub
   - Vercel will automatically deploy
   - Check deployment logs for any errors

2. **Test Core Functionality**:
   - [ ] Homepage loads correctly
   - [ ] User authentication works
   - [ ] Server browsing functions
   - [ ] Dashboard is accessible
   - [ ] Database connections work

3. **Test API Endpoints**:
   ```bash
   # Test servers API
   curl https://your-app.vercel.app/api/servers
   
   # Test cloud providers API
   curl https://your-app.vercel.app/api/cloud-providers
   ```

## Step 7: Domain Configuration (Optional)

1. Go to Vercel project settings
2. Navigate to Domains
3. Add your custom domain
4. Configure DNS records as instructed

## Step 8: Performance Optimization

### Enable Analytics
1. Go to Vercel project settings
2. Navigate to Analytics
3. Enable Web Analytics

### Configure Caching
Vercel automatically handles caching, but you can optimize:

```javascript
// In your API routes, add cache headers
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

## Step 9: Monitoring and Maintenance

### Set up Error Tracking
1. Consider integrating Sentry or similar
2. Monitor Vercel function logs
3. Set up uptime monitoring

### Database Monitoring
1. Monitor Supabase usage
2. Set up database backups
3. Monitor API rate limits

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript types are correct

2. **Environment Variable Issues**:
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding variables

3. **Database Connection Issues**:
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure migrations are applied

4. **API Route Errors**:
   - Check Vercel function logs
   - Verify API route file structure
   - Test endpoints locally first

### Debug Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test local build
npm run build
npm start
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Service keys are not exposed to client
- [ ] RLS policies are enabled on all tables
- [ ] API routes have proper authentication
- [ ] CORS is configured correctly
- [ ] Input validation is implemented

## Performance Checklist

- [ ] Images are optimized
- [ ] API responses are cached appropriately
- [ ] Database queries are optimized
- [ ] Bundle size is reasonable
- [ ] Core Web Vitals are good

## Post-Deployment

1. **Test all functionality thoroughly**
2. **Monitor performance and errors**
3. **Set up regular database backups**
4. **Plan for scaling if needed**
5. **Document any production-specific configurations**

Your MCPMarket application should now be successfully deployed on Vercel!

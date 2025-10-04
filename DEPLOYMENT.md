# Deployment Guide - EA Forex LeopardSmart Landing Page

## 🚀 GitHub Repository Setup

### 1. Create GitHub Repository

1. **Create Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name: `ea-forex-leopardsmart` or `leopardsmart-landing`
   - Set as Public (for free Vercel deployment)
   - Don't initialize with README (we already have one)

2. **Connect Local Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EA Forex LeopardSmart landing page"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Important Files Check

Before deploying, ensure these files are properly configured:

- ✅ `.gitignore` - Excludes sensitive files
- ✅ `package.json` - All dependencies listed
- ✅ `next.config.ts` - Proper Next.js configuration
- ✅ `tailwind.config.ts` - Tailwind configuration
- ✅ All images moved to `public/` directory
- ⚠️ `.env.local` - Add your actual Resend API key

## 🌐 Vercel Deployment

### 1. Connect to Vercel

1. **Sign up/Login**: Go to [vercel.com](https://vercel.com)
2. **Import Project**: Click "New Project"
3. **Connect GitHub**: Select your repository
4. **Configure Project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### 2. Environment Variables

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   RESEND_API_KEY = your_actual_resend_api_key_here
   ```

### 3. Custom Domain (Required for Resend)

1. **Add Domain**: In Vercel dashboard, go to Domains
2. **DNS Configuration**: Point your domain to Vercel
3. **Update Email Configuration**:
   - In `app/api/contact/route.ts`
   - Change `from: "support@leopardsmart.com"`
   - To `from: "support@yourdomain.com"`

## 📧 Resend Configuration

### 1. Domain Verification

1. **Add Domain** in Resend dashboard
2. **DNS Records**: Add required TXT/CNAME records
3. **Verify Domain**: Wait for verification (can take up to 24 hours)

### 2. Update Email Addresses

In `app/api/contact/route.ts`, update:
```typescript
const { data, error } = await resend.emails.send({
  from: "support@yourdomain.com", // Your verified domain
  to: ["support@leopardsmart.com"], // Your business email
  // ... rest of configuration
});
```

## 🔧 Post-Deployment Steps

### 1. Test Website Functionality

- ✅ All pages load correctly
- ✅ Navigation works smoothly
- ✅ Images display properly
- ✅ Mobile responsiveness
- ✅ Contact form submission
- ✅ Pricing page functionality
- ✅ Blog pages loading
- ✅ Email delivery

### 2. SEO and Analytics

1. **Google Search Console**:
   - Submit sitemap
   - Verify domain ownership

2. **Google Analytics** (Optional):
   - Add tracking code to `app/layout.tsx`

3. **Meta Tags Verification**:
   - Check Open Graph tags
   - Verify Twitter Cards
   - Test with [Meta Tags Debugger](https://developers.facebook.com/tools/debug/)

### 3. Performance Optimization

1. **Core Web Vitals**: Check in Google PageSpeed Insights
2. **Image Optimization**: Ensure all images use Next.js Image component
3. **Caching**: Verify static generation is working

## 🚨 Pre-Launch Checklist

### Content Review
- [ ] All business information is accurate
- [ ] Phone numbers and contact details are correct
- [ ] EA pricing is up-to-date
- [ ] Trading strategy information is accurate
- [ ] Testimonials are real and approved
- [ ] Blog content is complete and accurate

### Technical Check
- [ ] Form submissions work and send emails
- [ ] All images load correctly
- [ ] Mobile responsiveness tested
- [ ] All navigation links work
- [ ] Pricing buttons work correctly
- [ ] Blog pages load properly
- [ ] Phone number clicks open dialer
- [ ] Social media links are correct

### Legal and Compliance
- [ ] Privacy policy created/updated
- [ ] Terms of service created/updated
- [ ] Cookie policy (if applicable)
- [ ] Business registration compliance

## 🛠️ Maintenance

### Regular Updates
- **Monthly**: Review and update EA pricing
- **Quarterly**: Add new testimonials and trading results
- **Annually**: Update strategy information and performance stats

### Monitoring
- **Email Delivery**: Monitor Resend dashboard for delivery rates
- **Website Performance**: Check Core Web Vitals monthly
- **Form Submissions**: Test contact form functionality

### Backup and Security
- **Repository**: Keep GitHub repository private or secure
- **Environment Variables**: Rotate API keys annually
- **Domain Security**: Enable HTTPS and security headers

## 🆘 Troubleshooting

### Common Issues

1. **Images Not Loading**:
   - Check images are in `public/` directory
   - Verify image paths in components
   - Check file permissions

2. **Form Not Sending Emails**:
   - Verify Resend API key in environment variables
   - Check domain verification status
   - Review email addresses in API route

3. **Build Failures**:
   - Check TypeScript errors
   - Verify all imports are correct
   - Review package.json dependencies

4. **Styling Issues**:
   - Clear browser cache
   - Check Tailwind CSS configuration
   - Verify responsive classes

### Support Resources
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Resend**: [resend.com/docs](https://resend.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 🎯 Success Metrics

After deployment, monitor:
- **Page Load Speed**: < 3 seconds
- **Form Submission Rate**: Track demo requests and purchases
- **Mobile Traffic**: Ensure mobile optimization
- **Email Delivery Rate**: Monitor through Resend dashboard
- **Conversion Rate**: Track pricing page to contact form conversions

**Ready for Launch! 🚀** 
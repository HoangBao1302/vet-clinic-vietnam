# PawCare Veterinary Clinic Landing Page

A modern, professional landing page for a family veterinary clinic built with Next.js 15, Tailwind CSS, and TypeScript. Features appointment booking, service showcase, testimonials, and interactive contact section.

## 🌟 Features

- **Modern Design**: Professional blue and white color scheme with elegant typography
- **Responsive Layout**: Optimized for mobile, tablet, and desktop devices
- **Appointment Booking**: Integrated form with Resend email service
- **Service Showcase**: Detailed service listings with transparent pricing
- **Testimonials**: Customer reviews with carousel functionality
- **Interactive Map**: Embedded Google Maps for location
- **Sticky Call-to-Action**: Fixed bottom bar for easy contact
- **Smooth Navigation**: Scroll-to-section navigation with mobile menu
- **SEO Optimized**: Meta tags and structured data

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Email Service**: Resend
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component

## 📱 Sections

1. **Header**: Navigation, contact info, and social media links
2. **Hero**: Main headline with appointment booking form
3. **Services**: Service listings with pricing in Vietnamese Dong (₫)
4. **About**: Clinic information and team profiles
5. **Testimonials**: Customer reviews with star ratings
6. **Contact**: Interactive map and contact information
7. **Footer**: Additional links and information
8. **Sticky CTA**: Always-visible call button

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Resend account for email functionality

### Installation

1. **Clone the repository** (when deploying):
   \`\`\`bash
   git clone <repository-url>
   cd vet-clinic
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**:
   - Copy \`.env.local\` and add your Resend API key
   - Get your API key from [Resend Dashboard](https://resend.com/api-keys)
   - Update the email addresses in \`app/api/appointment/route.ts\`

4. **Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 Email Configuration

### Resend Setup

1. **Create Account**: Sign up at [resend.com](https://resend.com)
2. **Verify Domain**: Add and verify your domain (required for production)
3. **Get API Key**: Generate API key from dashboard
4. **Update Variables**:
   - Add \`RESEND_API_KEY\` to \`.env.local\`
   - Update \`from\` email in API route to your verified domain
   - Update \`to\` email to your clinic's email address

### Email Template

The appointment form sends professional HTML emails with:
- Client contact information
- Appointment request details
- Professional clinic branding
- Action reminders for staff

## 🎨 Customization

### Colors

Primary colors are defined in \`tailwind.config.ts\`:
- Primary: \`#1e40af\` (blue-600) and \`#3b82f6\` (blue-500)
- Accent: \`#dbeafe\` (blue-100)

### Content

Update business information in:
- \`components/Header.tsx\` - Contact details and social links
- \`components/Contact.tsx\` - Address and business hours
- \`components/Services.tsx\` - Service descriptions and pricing
- \`components/About.tsx\` - Clinic story and team information

### Images

Replace images in \`public/\` directories:
- \`public/vet-images/\` - Clinic and veterinary photos
- \`public/reviews/\` - Customer profile photos

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub**:
   - Push code to GitHub repository
   - Connect repository to Vercel

2. **Environment Variables**:
   - Add \`RESEND_API_KEY\` in Vercel dashboard
   - Configure custom domain (required for Resend)

3. **Deploy**:
   - Automatic deployment on git push
   - Production URL will be generated

### Environment Variables

Required for production:
\`\`\`
RESEND_API_KEY=your_actual_api_key_here
\`\`\`

## 📁 Project Structure

\`\`\`
vet-clinic/
├── app/
│   ├── api/appointment/     # API route for form submissions
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/              # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── Testimonials.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   └── StickyCallToAction.tsx
├── public/
│   ├── vet-images/          # Clinic photos
│   └── reviews/             # Customer photos
├── PRD.md                   # Product Requirements Document
└── README.md                # This file
\`\`\`

## 🌐 Business Information

- **Address**: 74 Lê Trọng Tấn, Tây Thạnh Ward, Ho Chi Minh City Việt Nam
- **Phone**: +84765452515
- **Email**: info@pawcareclinic.com (update to your actual email)

## 📊 Features Implementation Status

✅ **Completed Features:**
- [x] Professional design with blue/white theme
- [x] Responsive mobile-first layout
- [x] Appointment booking form with validation
- [x] Service showcase with pricing
- [x] About section with team profiles
- [x] Testimonials with carousel
- [x] Contact section with Google Maps
- [x] Sticky call-to-action bar
- [x] Smooth scroll navigation
- [x] Email integration with Resend
- [x] SEO optimization
- [x] Image optimization

## 🔧 Maintenance

### Regular Updates

- Update service pricing as needed
- Add new testimonials periodically
- Update team information and photos
- Monitor form submissions and email delivery

### Performance

- Images are automatically optimized by Next.js
- Tailwind CSS provides efficient styling
- Static generation for fast loading

## 📞 Support

For technical support or customization requests, please refer to:
- Next.js documentation: [nextjs.org](https://nextjs.org)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com)
- Resend API: [resend.com/docs](https://resend.com/docs)

---

**Built with ❤️ for PawCare Clinic** 
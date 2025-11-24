# Technical Architecture - BrandStory AI
## Complete Implementation Guide

---

## TABLE OF CONTENTS
1. System Overview
2. Technology Stack
3. Architecture Diagram
4. Database Schema
5. API Design
6. Frontend Components
7. AI Integration
8. Payment Flow
9. File Generation & Delivery
10. Deployment
11. Security & Compliance
12. Phase-by-Phase Implementation
13. Cost Breakdown
14. Testing Strategy

---

## 1. SYSTEM OVERVIEW

### High-Level Flow

```
User Journey:
1. Landing page → Sign up/Start
2. Brand questionnaire (10-15 questions)
3. AI processing (30-60 seconds)
4. View 10 logo options with explanations
5. Select & customize favorite
6. Payment ($149)
7. Download complete brand kit
8. Email delivery of all assets
```

### Core Components

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React/Next.js)            │
│  - Landing page                                  │
│  - Questionnaire UI                              │
│  - Logo gallery                                  │
│  - Editor                                        │
│  - Payment checkout                              │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│           BACKEND API (Node.js/Python)           │
│  - User management                               │
│  - Questionnaire processing                      │
│  - AI prompt engineering                         │
│  - Payment processing                            │
│  - File generation                               │
│  - Email delivery                                │
└──────────────┬──────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│  DATABASE   │  │  AI SERVICES │
│ (Postgres)  │  │  - OpenAI    │
│             │  │  - DALL-E    │
│  - Users    │  │  - GPT-4     │
│  - Projects │  │              │
│  - Logos    │  └──────────────┘
│  - Files    │
└─────────────┘

               ┌──────────────────┐
               │ EXTERNAL SERVICES│
               │  - Stripe        │
               │  - AWS S3        │
               │  - SendGrid      │
               │  - Cloudflare    │
               └──────────────────┘
```

---

## 2. TECHNOLOGY STACK

### Frontend

**Framework:** Next.js 14+ (App Router)
- ✅ SEO-friendly (crucial for marketing)
- ✅ Server-side rendering
- ✅ Built-in API routes
- ✅ Great performance
- ✅ Image optimization

**UI Libraries:**
```json
{
  "react": "^18.2.0",
  "next": "^14.0.0",
  "tailwindcss": "^3.4.0",
  "shadcn/ui": "latest",
  "framer-motion": "^11.0.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0"
}
```

**Logo Editor:**
- **Fabric.js** or **Konva.js** (canvas-based editing)
- **react-color** (color picker)
- **react-colorful** (alternative, lighter)

**State Management:**
- Zustand (simple, lightweight) or
- React Context + hooks (even simpler for MVP)

---

### Backend

**Option A: Node.js (Recommended for JavaScript developers)**

```json
{
  "express": "^4.18.0",
  "typescript": "^5.3.0",
  "prisma": "^5.8.0",
  "openai": "^4.24.0",
  "stripe": "^14.10.0",
  "nodemailer": "^6.9.0",
  "sharp": "^0.33.0",
  "pdf-lib": "^1.17.0"
}
```

**Option B: Python (Recommended if heavy AI/ML)**

```python
fastapi
uvicorn
sqlalchemy
openai
stripe
pillow
reportlab
boto3
pydantic
```

---

### Database

**PostgreSQL** (Recommended)
- Structured data
- Relationships (users → projects → logos)
- JSON support for questionnaire data
- Free tier: Supabase or Neon

**Alternative: MongoDB** (if you prefer NoSQL)

---

### AI Services

**Logo Generation:**
- **DALL-E 3** (OpenAI) - $0.040-0.080 per image
  - Best quality
  - Best for text in images (business names)
  - Easiest API

- **Midjourney** (via API) - $10-60/month
  - Most artistic
  - Better aesthetics
  - Unofficial API (bit hacky)

- **Stable Diffusion** (Replicate) - $0.001 per image
  - Cheapest
  - Can fine-tune
  - More technical setup

**Text Generation:**
- **GPT-4** (OpenAI) - $0.01-0.03 per 1K tokens
  - Brand story writing
  - Logo explanations
  - Guidelines generation

---

### Storage

**AWS S3** or **Cloudflare R2**
- Logo files (PNG, SVG, PDF)
- User uploads
- Generated assets

**Cost:** ~$0.023 per GB/month

---

### Payments

**Stripe**
- One-time payments
- Subscriptions (if needed later)
- 2.9% + $0.30 per transaction

---

### Email

**SendGrid** or **Resend**
- Transactional emails
- Asset delivery
- Free tier: 100 emails/day (SendGrid)

---

### Hosting

**Frontend:** Vercel (Free tier generous)
**Backend:** Railway, Render, or AWS (Free/low-cost tier)
**Database:** Supabase or Neon (Free tier)

---

## 3. ARCHITECTURE DIAGRAM

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                     │
│                                                            │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │ Landing Page │→│Questionnaire│→│  Logo Gallery   │  │
│  └──────────────┘  └─────────────┘  └────────────────┘  │
│                           │                  │            │
│                           ▼                  ▼            │
│                    ┌─────────────┐    ┌────────────┐    │
│                    │   Editor    │    │  Checkout  │    │
│                    └─────────────┘    └────────────┘    │
└──────────────────────────┬──────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌──────────────────────────┴──────────────────────────────┐
│                    API GATEWAY (Next.js)                 │
│  /api/auth, /api/questionnaire, /api/generate           │
│  /api/customize, /api/payment, /api/download            │
└──────────────────────────┬──────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐  ┌─────────────────┐  ┌──────────────┐
│   AUTH       │  │  CORE BUSINESS  │  │   EXTERNAL   │
│   SERVICE    │  │     LOGIC       │  │   SERVICES   │
│              │  │                 │  │              │
│ - Register   │  │ - Generate      │  │ - Stripe     │
│ - Login      │  │   prompts       │  │ - OpenAI     │
│ - Sessions   │  │ - Call AI       │  │ - S3         │
│              │  │ - Process       │  │ - SendGrid   │
│              │  │   results       │  │              │
└──────┬───────┘  └────────┬────────┘  └──────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────────────────────────┐
│         DATABASE                 │
│  ┌──────────┐  ┌─────────────┐ │
│  │  Users   │  │  Projects   │ │
│  │  - id    │  │  - id       │ │
│  │  - email │  │  - user_id  │ │
│  │  - name  │  │  - answers  │ │
│  └────┬─────┘  └──────┬──────┘ │
│       │                │         │
│       └────────┬───────┘         │
│                ▼                 │
│       ┌─────────────────┐       │
│       │     Logos       │       │
│       │  - id           │       │
│       │  - project_id   │       │
│       │  - image_url    │       │
│       │  - prompt       │       │
│       │  - selected     │       │
│       └─────────────────┘       │
└─────────────────────────────────┘
```

---

## 4. DATABASE SCHEMA

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255), -- NULL if social auth
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  business_name VARCHAR(255) NOT NULL,
  questionnaire_data JSONB NOT NULL, -- Full questionnaire answers
  status VARCHAR(50) DEFAULT 'draft', -- draft, generated, paid, delivered
  payment_status VARCHAR(50), -- pending, succeeded, failed
  payment_id VARCHAR(255), -- Stripe payment intent ID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### Logos Table
```sql
CREATE TABLE logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL, -- S3 URL
  prompt TEXT NOT NULL, -- The prompt used to generate
  explanation TEXT, -- AI-generated "why this works"
  ai_model VARCHAR(50), -- 'dalle-3', 'midjourney', etc.
  generation_params JSONB, -- Size, style, etc.
  is_selected BOOLEAN DEFAULT FALSE,
  customizations JSONB, -- User edits (colors, fonts, etc.)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logos_project_id ON logos(project_id);
CREATE INDEX idx_logos_selected ON logos(project_id, is_selected);
```

### Downloads Table (Track deliveries)
```sql
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  file_type VARCHAR(50), -- 'png', 'svg', 'pdf', 'zip'
  file_url VARCHAR(500),
  downloaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_downloads_project_id ON downloads(project_id);
```

### Email_Log Table (Track email delivery)
```sql
CREATE TABLE email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  email_type VARCHAR(50), -- 'welcome', 'assets_ready', 'receipt'
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) -- 'sent', 'failed', 'bounced'
);
```

---

## 5. API DESIGN

### Authentication Endpoints

```
POST /api/auth/register
Body: { email, password, name }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user }
```

---

### Questionnaire Endpoints

```
POST /api/questionnaire/start
Body: { email, businessName }
Response: { projectId, questions }

POST /api/questionnaire/submit
Body: {
  projectId,
  answers: {
    businessName: string,
    industry: string,
    originStory: string,
    ...
  }
}
Response: { projectId, status: 'submitted' }
```

---

### Generation Endpoints

```
POST /api/generate/logos
Body: { projectId }
Process:
  1. Fetch questionnaire data
  2. Build 10 AI prompts
  3. Call DALL-E for each
  4. Save to S3
  5. Store in database
Response: {
  logos: [
    {
      id,
      imageUrl,
      explanation: "This design represents..."
    },
    ...
  ]
}

GET /api/generate/status/:projectId
Response: {
  status: 'generating' | 'complete' | 'error',
  progress: 7/10,
  logos: [...]
}
```

---

### Customization Endpoints

```
POST /api/customize
Body: {
  logoId,
  customizations: {
    colors: { primary: '#hex', secondary: '#hex' },
    font: 'font-name',
    layout: 'horizontal' | 'vertical' | 'stacked'
  }
}
Response: { customizedImageUrl }

POST /api/customize/regenerate
Body: { logoId, newPrompt }
Response: { newLogoId, imageUrl }
```

---

### Payment Endpoints

```
POST /api/payment/create-intent
Body: { projectId, amount: 14900 } // cents
Response: { clientSecret, paymentIntentId }

POST /api/payment/confirm
Body: { projectId, paymentIntentId }
Process:
  1. Verify payment with Stripe
  2. Update project status to 'paid'
  3. Generate all file formats
  4. Upload to S3
  5. Send email with download links
Response: { success: true, downloadUrl }

GET /api/payment/receipt/:projectId
Response: { PDF receipt }
```

---

### Download Endpoints

```
GET /api/download/:projectId
Query: ?format=png|svg|pdf|zip
Response: File download or redirect to S3 signed URL

POST /api/download/email
Body: { projectId }
Process: Resend download email
Response: { success: true }
```

---

## 6. FRONTEND COMPONENTS

### Component Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── start/page.tsx           # Questionnaire start
│   ├── questionnaire/page.tsx   # Multi-step form
│   ├── generating/page.tsx      # Loading state
│   ├── results/page.tsx         # Logo gallery
│   ├── editor/page.tsx          # Customization
│   ├── checkout/page.tsx        # Payment
│   ├── success/page.tsx         # Post-payment
│   └── dashboard/page.tsx       # User projects
│
├── components/
│   ├── questionnaire/
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StoryInput.tsx
│   │   └── StyleSelector.tsx
│   │
│   ├── logos/
│   │   ├── LogoGallery.tsx
│   │   ├── LogoCard.tsx
│   │   ├── LogoPreview.tsx
│   │   └── ExplanationModal.tsx
│   │
│   ├── editor/
│   │   ├── Canvas.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── FontSelector.tsx
│   │   ├── LayoutControls.tsx
│   │   └── ExportOptions.tsx
│   │
│   ├── payment/
│   │   ├── CheckoutForm.tsx
│   │   ├── PricingCard.tsx
│   │   └── PaymentSuccess.tsx
│   │
│   └── shared/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── LoadingSpinner.tsx
│       └── Toast.tsx
│
├── lib/
│   ├── api.ts               # API client
│   ├── auth.ts              # Auth helpers
│   ├── stripe.ts            # Stripe integration
│   └── utils.ts             # Utilities
│
└── hooks/
    ├── useQuestionnaire.ts
    ├── useLogoGeneration.ts
    └── usePayment.ts
```

---

### Key Component Examples

**Questionnaire Component:**

```typescript
// components/questionnaire/QuestionCard.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const questionSchema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  industry: z.string().min(1, 'Please select an industry'),
  originStory: z.string().min(50, 'Tell us more (at least 50 characters)'),
  // ... more fields
});

export function QuestionnaireForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const form = useForm({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/questionnaire/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      // Redirect to generation page
      router.push(`/generating?projectId=${result.projectId}`);
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={step} total={totalSteps} />
      
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 && (
          <div>
            <h2>The Basics</h2>
            <Input {...form.register('businessName')} />
            <Select {...form.register('industry')} />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h2>Your Story</h2>
            <Textarea {...form.register('originStory')} />
          </div>
        )}
        
        {/* More steps... */}
        
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)}>
              ← Back
            </Button>
          )}
          
          {step < totalSteps ? (
            <Button onClick={() => setStep(step + 1)}>
              Next →
            </Button>
          ) : (
            <Button type="submit">
              Generate My Brand →
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
```

**Logo Gallery Component:**

```typescript
// components/logos/LogoGallery.tsx
import { useState } from 'react';
import Image from 'next/image';

export function LogoGallery({ logos, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {logos.map((logo) => (
        <div
          key={logo.id}
          className={`
            relative cursor-pointer transition-all
            border-4 rounded-lg overflow-hidden
            ${selectedId === logo.id ? 'border-blue-500 scale-105' : 'border-transparent'}
          `}
          onClick={() => setSelectedId(logo.id)}
        >
          <Image
            src={logo.imageUrl}
            alt={`Logo option ${logo.id}`}
            width={400}
            height={400}
            className="w-full h-auto"
          />
          
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-600">
              {logo.explanation}
            </p>
          </div>
          
          {selectedId === logo.id && (
            <div className="absolute top-2 right-2">
              <CheckCircle className="text-blue-500" />
            </div>
          )}
        </div>
      ))}
      
      <Button
        onClick={() => onSelect(selectedId)}
        disabled={!selectedId}
        className="col-span-full"
      >
        Customize This Logo →
      </Button>
    </div>
  );
}
```

---

## 7. AI INTEGRATION

### Prompt Engineering

**System Prompt for Logo Generation:**

```typescript
function buildLogoPrompt(questionnaireData) {
  const {
    businessName,
    industry,
    originStory,
    transformation,
    brandPersonality,
    visualStyle,
    targetFeeling,
    colorPreference,
    symbolSuggestions
  } = questionnaireData;

  const basePrompt = `
Create a professional logo design for "${businessName}", 
a ${industry} organization.

BRAND STORY:
${originStory}

TRANSFORMATION THEME:
From ${transformation.from} to ${transformation.to}

BRAND PERSONALITY:
${brandPersonality.join(', ')}

VISUAL DIRECTION:
- Style: ${visualStyle}
- Feeling: ${targetFeeling.join(', ')}
- Colors: ${colorPreference}
${symbolSuggestions ? `- Symbols: ${symbolSuggestions}` : ''}

REQUIREMENTS:
- Clean, professional vector-style logo
- Scalable and readable at all sizes
- Simple enough to be memorable
- Incorporates the business name: "${businessName}"
- No photorealistic textures
- Flat design, suitable for print and digital

Style: minimalist vector art, professional branding, clean lines, memorable
  `.trim();

  return basePrompt;
}
```

**Generate Multiple Variations:**

```typescript
async function generateLogoVariations(questionnaireData, count = 10) {
  const variations = [];
  
  // Variation 1-3: Emphasize transformation
  for (let i = 0; i < 3; i++) {
    const prompt = buildLogoPrompt(questionnaireData) + 
      `\nFocus: Visual metaphor for ${questionnaireData.transformation.from} transforming into ${questionnaireData.transformation.to}`;
    variations.push(prompt);
  }
  
  // Variation 4-6: Emphasize personality
  for (let i = 0; i < 3; i++) {
    const personality = questionnaireData.brandPersonality[i % 3];
    const prompt = buildLogoPrompt(questionnaireData) + 
      `\nFocus: Embody the "${personality}" personality trait`;
    variations.push(prompt);
  }
  
  // Variation 7-8: Emphasize symbols
  for (let i = 0; i < 2; i++) {
    const prompt = buildLogoPrompt(questionnaireData) + 
      `\nFocus: Incorporate ${questionnaireData.symbolSuggestions || 'meaningful abstract symbols'}`;
    variations.push(prompt);
  }
  
  // Variation 9-10: Abstract interpretations
  for (let i = 0; i < 2; i++) {
    const prompt = buildLogoPrompt(questionnaireData) + 
      `\nFocus: Abstract geometric interpretation of the brand story`;
    variations.push(prompt);
  }
  
  // Call DALL-E for each prompt
  const logos = await Promise.all(
    variations.map(async (prompt, index) => {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: questionnaireData.visualStyle === 'Bold & Impactful' ? 'vivid' : 'natural'
      });
      
      const imageUrl = response.data[0].url;
      
      // Generate explanation for this logo
      const explanation = await generateExplanation(questionnaireData, prompt);
      
      return {
        index: index + 1,
        imageUrl,
        prompt,
        explanation
      };
    })
  );
  
  return logos;
}
```

**Generate Explanation:**

```typescript
async function generateExplanation(questionnaireData, logoPrompt) {
  const systemPrompt = `
You are a brand strategist explaining logo design choices.
Write a 2-3 sentence explanation of why this logo works for the client's brand story.
Be specific, insightful, and connect design elements to their mission.
  `;
  
  const userPrompt = `
Business: ${questionnaireData.businessName}
Story: ${questionnaireData.originStory}
Transformation: ${questionnaireData.transformation.from} → ${questionnaireData.transformation.to}
Logo prompt used: ${logoPrompt}

Explain why this logo effectively represents their brand:
  `;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 150
  });
  
  return completion.choices[0].message.content;
}
```

---

## 8. PAYMENT FLOW

### Stripe Integration

```typescript
// lib/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(projectId: string, amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // in cents
    currency: 'usd',
    metadata: {
      projectId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });
  
  return paymentIntent;
}

export async function verifyPayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent.status === 'succeeded';
}
```

**Checkout Component:**

```typescript
// components/payment/CheckoutForm.tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ projectId, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      console.error(error);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Confirm payment on backend
      await fetch('/api/payment/confirm', {
        method: 'POST',
        body: JSON.stringify({ 
          projectId, 
          paymentIntentId: paymentIntent.id 
        }),
      });
      
      // Redirect to success page
      router.push(`/success?projectId=${projectId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay $149'}
      </button>
    </form>
  );
}

export function CheckoutPage({ projectId }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent
    fetch('/api/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify({ projectId, amount: 14900 }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [projectId]);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm projectId={projectId} clientSecret={clientSecret} />
    </Elements>
  );
}
```

---

## 9. FILE GENERATION & DELIVERY

### Generate Multiple Formats

```typescript
// lib/file-generation.ts
import sharp from 'sharp';
import { jsPDF } from 'jspdf';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function generateAllFormats(logoUrl: string, projectId: string) {
  // Download original image
  const response = await fetch(logoUrl);
  const buffer = await response.arrayBuffer();
  
  // Generate PNG (high-res, transparent background)
  const pngBuffer = await sharp(Buffer.from(buffer))
    .resize(2000, 2000, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  
  // Upload PNG to S3
  const pngKey = `logos/${projectId}/logo-highres.png`;
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: pngKey,
    Body: pngBuffer,
    ContentType: 'image/png',
  }));
  
  // Generate SVG (if possible - may need vectorization service)
  // For MVP, you might skip this or use a third-party API
  
  // Generate PDF
  const pdfBuffer = await generateBrandGuidelinesPDF(projectId);
  const pdfKey = `logos/${projectId}/brand-guidelines.pdf`;
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: pdfKey,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  }));
  
  return {
    png: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${pngKey}`,
    pdf: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${pdfKey}`,
  };
}

async function generateBrandGuidelinesPDF(projectId: string) {
  // Fetch project data
  const project = await db.projects.findById(projectId);
  const logo = await db.logos.findSelected(projectId);
  
  // Create PDF
  const doc = new jsPDF();
  
  // Page 1: Cover
  doc.setFontSize(32);
  doc.text('Brand Guidelines', 20, 40);
  doc.setFontSize(18);
  doc.text(project.businessName, 20, 60);
  
  // Page 2: Logo Usage
  doc.addPage();
  doc.setFontSize(24);
  doc.text('Logo Usage', 20, 20);
  // Add logo image
  doc.addImage(logo.imageUrl, 'PNG', 20, 40, 100, 100);
  
  // Page 3: Colors
  doc.addPage();
  doc.text('Color Palette', 20, 20);
  // Add color swatches
  
  // Page 4: Typography
  doc.addPage();
  doc.text('Typography', 20, 20);
  
  // Page 5: Brand Story
  doc.addPage();
  doc.text('Your Brand Story', 20, 20);
  doc.setFontSize(12);
  doc.text(project.questionnaire_data.originStory, 20, 40, { maxWidth: 170 });
  
  return doc.output('arraybuffer');
}
```

---

## 10. DEPLOYMENT

### Environment Variables

```bash
# .env.local (development)
# .env.production (production)

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/brandstory

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=brandstory-logos

# SendGrid
SENDGRID_API_KEY=SG....

# App
NEXT_PUBLIC_APP_URL=https://brandstory.ai
JWT_SECRET=your-secret-key
```

---

### Deployment Steps

**1. Vercel (Frontend + API Routes)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

**2. Database (Supabase)**

```bash
# Create project at supabase.com
# Run migrations
npx prisma migrate deploy

# Or use Supabase SQL editor to run schema
```

**3. AWS S3 Setup**

```bash
# Create bucket
aws s3 mb s3://brandstory-logos

# Set CORS policy
aws s3api put-bucket-cors --bucket brandstory-logos --cors-configuration file://cors.json
```

cors.json:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://brandstory.ai"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

---

## 11. SECURITY & COMPLIANCE

### Security Checklist

- [ ] HTTPS only (enforced)
- [ ] Environment variables properly secured
- [ ] SQL injection prevention (use Prisma/parameterized queries)
- [ ] Rate limiting on API endpoints
- [ ] CORS properly configured
- [ ] Input validation (Zod schemas)
- [ ] Password hashing (bcrypt)
- [ ] JWT tokens with expiration
- [ ] S3 bucket not public (use signed URLs)
- [ ] Stripe webhooks verified

### GDPR Compliance

```typescript
// Add to user settings
POST /api/user/delete-account
Process:
  1. Delete all user data
  2. Delete associated projects
  3. Delete logos from S3
  4. Cancel subscriptions
  5. Log deletion
```

---

## 12. PHASE-BY-PHASE IMPLEMENTATION

### Phase 1: MVP (Weeks 1-4)

**Week 1: Foundation**
- [ ] Set up Next.js project
- [ ] Create database schema
- [ ] Set up authentication (simple email/password)
- [ ] Deploy basic landing page

**Week 2: Questionnaire**
- [ ] Build multi-step form
- [ ] Form validation
- [ ] Save responses to database
- [ ] Test questionnaire flow

**Week 3: AI Integration**
- [ ] OpenAI API integration
- [ ] Prompt engineering
- [ ] Generate 5 logo variations (start small)
- [ ] Store results

**Week 4: Payment & Delivery**
- [ ] Stripe integration
- [ ] Download functionality
- [ ] Email delivery
- [ ] Test end-to-end

### Phase 2: Enhancement (Weeks 5-8)

- [ ] Increase to 10 logo variations
- [ ] Add basic editor (color changes)
- [ ] Improve AI prompts based on results
- [ ] Add brand guidelines PDF
- [ ] User dashboard (view past projects)

### Phase 3: Scale (Weeks 9-12)

- [ ] Advanced editor features
- [ ] Multiple file formats (SVG, AI)
- [ ] Collaboration features
- [ ] Analytics tracking
- [ ] Marketing website content

---

## 13. COST BREAKDOWN

### Per Customer Costs

```
AI Generation:
- 10 logo images (DALL-E 3): 10 × $0.04 = $0.40
- GPT-4 for explanations: ~$0.05
- Total AI: ~$0.45

Storage (S3):
- 50MB per customer: ~$0.001

Email:
- 3 emails per customer: ~$0.01

Payment processing (Stripe):
- $149 × 2.9% + $0.30 = $4.62

Total per customer: ~$5.10
Profit margin: $149 - $5.10 = $143.90 (96.5%)
```

### Monthly Fixed Costs (Estimate)

```
Hosting (Vercel): $20-50
Database (Supabase): $25
Domain: $2
Email (SendGrid): $15-20
Total: ~$65/month

Break-even: 1 customer per month
```

---

## 14. TESTING STRATEGY

### Unit Tests

```typescript
// __tests__/prompt-builder.test.ts
import { buildLogoPrompt } from '../lib/prompt-builder';

describe('buildLogoPrompt', () => {
  it('should include business name', () => {
    const data = { businessName: 'GreenPath', /* ... */ };
    const prompt = buildLogoPrompt(data);
    expect(prompt).toContain('GreenPath');
  });
  
  it('should include transformation theme', () => {
    const data = {
      transformation: { from: 'waste', to: 'resources' },
      /* ... */
    };
    const prompt = buildLogoPrompt(data);
    expect(prompt).toContain('waste');
    expect(prompt).toContain('resources');
  });
});
```

### Integration Tests

```typescript
// __tests__/api/generate.test.ts
import { POST } from '../app/api/generate/logos/route';

describe('POST /api/generate/logos', () => {
  it('should generate 10 logos', async () => {
    const request = new Request('http://localhost/api/generate/logos', {
      method: 'POST',
      body: JSON.stringify({ projectId: 'test-id' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.logos).toHaveLength(10);
    expect(data.logos[0]).toHaveProperty('imageUrl');
    expect(data.logos[0]).toHaveProperty('explanation');
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test';

test('complete user journey', async ({ page }) => {
  // Landing page
  await page.goto('/');
  await page.click('text=Start Your Brand Story');
  
  // Questionnaire
  await page.fill('[name=businessName]', 'Test Company');
  await page.selectOption('[name=industry]', 'Technology');
  await page.fill('[name=originStory]', 'A long story about why...');
  await page.click('text=Generate My Brand');
  
  // Wait for generation
  await page.waitForSelector('text=Your logos are ready');
  
  // Select logo
  await page.click('[data-logo-id="1"]');
  await page.click('text=Customize This Logo');
  
  // Checkout (use Stripe test mode)
  await page.fill('[name=cardNumber]', '4242424242424242');
  await page.fill('[name=expiry]', '12/34');
  await page.fill('[name=cvc]', '123');
  await page.click('text=Pay $149');
  
  // Success
  await expect(page).toHaveURL(/\/success/);
  await expect(page.locator('text=Download Your Brand Kit')).toBeVisible();
});
```

---

## QUICK START COMMANDS

```bash
# 1. Create Next.js project
npx create-next-app@latest brandstory --typescript --tailwind --app

# 2. Install dependencies
cd brandstory
npm install prisma @prisma/client openai stripe @stripe/stripe-js sharp pdf-lib zod react-hook-form @hookform/resolvers

# 3. Initialize database
npx prisma init
# Edit prisma/schema.prisma with tables above
npx prisma generate
npx prisma db push

# 4. Create .env.local with your keys

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

---

END OF TECHNICAL ARCHITECTURE

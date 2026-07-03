# Model Catalog

A modern Next.js application for managing and browsing models and their video content. Built with TypeScript, Tailwind CSS, shadcn/ui, Prisma, and React Hook Form.

## Features

- **Model Management**: Create, edit, and delete models with avatar images, video embed URLs, and descriptions
- **Image Upload**: Cloudinary integration for avatar uploads with automatic optimization
- **Video Gallery**: Each model can have multiple videos with embed URLs and thumbnails
- **Admin Dashboard**: Clean SaaS-style admin interface for managing models
- **Public Catalog**: Browse all models with a professional grid layout
- **Model Detail Pages**: View individual models with their video galleries
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Form Validation**: Client-side validation with Zod and React Hook Form
- **Type Safety**: Full TypeScript support throughout the application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: SQLite with Prisma ORM
- **Image Upload**: Cloudinary for avatar storage and optimization
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Project Structure

```
├── app/
│   ├── admin/
│   │   └── models/
│   │       ├── page.tsx          # Admin models list
│   │       ├── new/
│   │       │   └── page.tsx      # Create model form
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx  # Edit model form
│   ├── models/
│   │   ├── page.tsx              # Public models list
│   │   └── [id]/
│   │       └── page.tsx          # Model detail page
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── image-upload.tsx     # Image upload component
│   ├── models/
│   │   └── model-form.tsx       # Reusable model form
│   └── navigation.tsx           # Navigation component
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── cloudinary.ts            # Cloudinary configuration
│   ├── utils.ts                 # Utility functions
│   └── validations/
│       ├── model.ts             # Model validation schema
│       └── video.ts             # Video validation schema
├── prisma/
│   └── schema.prisma            # Database schema
└── public/                      # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Set up Cloudinary:
   - Create a free account at [cloudinary.com](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - Add the following to your `.env` file:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

### Model
- `id`: Unique identifier
- `name`: Model name
- `avatarUrl`: URL to avatar image
- `videoEmbedUrl`: Optional video embed URL
- `description`: Model description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `videos`: Related videos (one-to-many)

### Video
- `id`: Unique identifier
- `title`: Video title
- `embedUrl`: Video embed URL
- `thumbnailUrl`: Optional thumbnail URL
- `order`: Display order
- `createdAt`: Creation timestamp
- `modelId`: Parent model ID (foreign key)

## Pages

### Public Pages
- `/` - Home page with statistics and recent models
- `/models` - Grid view of all models
- `/models/[id]` - Model detail page with video gallery

### Admin Pages
- `/admin/models` - Admin dashboard for managing models
- `/admin/models/new` - Create new model
- `/admin/models/[id]/edit` - Edit existing model

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

### Database Management

To open Prisma Studio (visual database editor):
```bash
npm run db:studio
```

To reset the database:
```bash
npx prisma db push --force-reset
```

## Deployment

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

For production, you may want to use a different database provider. Update the `DATABASE_URL` in your production environment variables.

### Build for Production

```bash
npm run build
npm start
```

## Features Implementation

### Server Components
All pages use Next.js Server Components for optimal performance and SEO. Data fetching happens server-side before rendering.

### Form Validation
Forms use React Hook Form with Zod validation for type-safe form handling and error messages.

### Image Optimization
Images are optimized using Next.js Image component with proper sizing and lazy loading.

### Responsive Design
The application uses Tailwind CSS responsive utilities to ensure a great experience on all device sizes.

## Future Enhancements

- Authentication and authorization
- Video management (add/edit/delete videos per model)
- Search and filtering
- Pagination
- Image upload integration (Supabase/Cloudinary)
- Dark mode toggle
- Model categories/tags
- Video analytics
- Export functionality

## License

MIT

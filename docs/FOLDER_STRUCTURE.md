# Folder Structure Proposal

Our Next.js project strictly adheres to a feature-based architecture combined with the App Router paradigm.

```text
tannhax-app/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (admin)/        # Grouped admin routes
│   │   ├── (user)/         # Grouped user routes
│   │   ├── api/            # Serverless API endpoints
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Root page
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Core design system (Buttons, Inputs)
│   │   └── features/       # Feature-specific components (ResourceCard, SearchBar)
│   ├── lib/                # Utility functions, configs, DB connections
│   │   ├── db.ts           # MongoDB connection utility
│   │   └── drive.ts        # Google Drive service adapter
│   ├── models/             # Mongoose schemas
│   ├── types/              # Global TypeScript interfaces
│   └── styles/             # Global CSS (Tailwind entry)
├── docs/                   # Project documentation
├── .env.example            # Environment variable template
├── .eslintrc.json          # Linter configuration
├── .prettierrc             # Code formatter configuration
└── package.json            # Dependencies
```

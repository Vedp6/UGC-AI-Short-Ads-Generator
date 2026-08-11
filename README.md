# 🎬 UGC-AI Short Ads Generator

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,20&height=220&section=header&text=UGC-AI%20Short%20Ads%20Generator&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35" width="100%"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=A970FF&center=true&vCenter=true&width=750&lines=Create+AI-Powered+UGC+Ads+%F0%9F%8E%A5;Turn+Product+Ideas+Into+Short+Video+Ads;AI+%2B+React+%2B+Node.js+%2B+PostgreSQL" />
</p>

<p align="center">
  <b>Create engaging short-form UGC-style advertisements using AI.</b>
</p>

---

## 🚀 About

**UGC-AI Short Ads Generator** is an AI-powered platform designed to help users create short-form advertising content for products.

Users can provide product information, images, and a prompt, and the application uses AI-powered generation to create engaging visual assets and short advertisement videos.

The platform is designed for creators, developers, marketers, and businesses who want to quickly create social-media-ready product advertisements.

---

## ✨ Features

* 🤖 **AI-Powered Ad Generation**
* 📝 **Prompt-Based Content Creation**
* 🛍️ **Product-Based Ads**
* 🖼️ **AI Image Generation**
* 🎬 **Short Video Ad Generation**
* 📱 **UGC-Style Advertisement Creation**
* 📐 **Multiple Aspect Ratios**
* ⏱️ **Short-Form Video Generation**
* 📁 **Project Management**
* 💳 **Credit-Based Generation System**
* 🔐 **User Authentication**
* ☁️ **Cloud Image Storage**
* 📊 **Generation Status Tracking**
* 🚨 **Error Handling & Credit Refunds**

---

# 🧠 How It Works

```text
        Product Information
                │
                ▼
        ┌─────────────────┐
        │   User Prompt   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │   AI Processing │
        └────────┬────────┘
                 │
          ┌──────┴──────┐
          ▼             ▼
   AI Image Generation  Ad Content
          │             │
          └──────┬──────┘
                 ▼
        ┌─────────────────┐
        │ Video Generation│
        └────────┬────────┘
                 ▼
        ┌─────────────────┐
        │   Final UGC Ad  │
        └─────────────────┘
```

---

# 🛠️ Tech Stack

### Frontend

<p>
<img src="https://skillicons.dev/icons?i=react,typescript,tailwind,vite" />
</p>

* React
* TypeScript
* Tailwind CSS
* Vite
* React Router
* Axios

### Backend

<p>
<img src="https://skillicons.dev/icons?i=nodejs,express,typescript,prisma" />
</p>

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* REST APIs

### Database

<p>
<img src="https://skillicons.dev/icons?i=postgres" />
</p>

* PostgreSQL
* Neon

### AI & Cloud

* 🤖 AI Generation APIs
* 🖼️ Image Generation
* 🎬 Video Generation
* ☁️ Cloudinary
* 🚨 Sentry

---

# 🎯 Core Features

## 🛍️ Product-Based Generation

Users can provide information such as:

```text
Product Name
Product Description
Product Images
Target Audience
Advertisement Prompt
```

The system uses this information to generate customized advertising content.

---

## 🖼️ AI Image Generation

The platform can generate product-focused visuals based on the provided product information and prompt.

Generated images can then be used as part of the advertisement creation workflow.

---

## 🎬 Short Video Ads

The generated visual assets can be transformed into short-form video advertisements.

The system supports configurable:

* Video duration
* Aspect ratio
* Product presentation
* Advertisement style
* User prompts

---

## 📱 Social Media Ready

The application is designed around short-form content suitable for platforms such as:

```text
Instagram Reels
YouTube Shorts
TikTok
Social Media Ads
```

---

# 💳 Credit System

The application includes a credit-based generation system.

Example:

```text
Create Project
      ↓
Check Credits
      ↓
Enough Credits?
   ↙          ↘
 YES           NO
  ↓             ↓
Deduct       Return Error
Credits
  ↓
Generate
  ↓
Success
```

If generation fails, the application can refund the deducted credits.

---

# 🗄️ Database Architecture

```text
React Frontend
      │
      ▼
Express API
      │
      ▼
Prisma ORM
      │
      ▼
Neon PostgreSQL
```

The database stores information such as:

* Users
* Credits
* Projects
* Product information
* Generated images
* Generated videos
* Generation status
* Publishing status
* Error information

---

# 📂 Project Structure

```text
UGC-AI-Ads-Generator/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

### Backend

Create a `.env` file:

```env
DATABASE_URL="your_neon_database_url"

PORT=5000
NODE_ENV=development

FRONTEND_URL="http://localhost:5173"

AI_API_KEY="your_ai_api_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Add any additional authentication or AI/video provider credentials required by your implementation.

> ⚠️ Never commit `.env` files or expose secret API keys in the frontend.

---

# 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ugc-ai-ads-generator.git

cd ugc-ai-ads-generator
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create:

```text
.env
```

and add your credentials.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run migrations

```bash
npx prisma migrate dev
```

### 6. Start backend

```bash
npm run dev
```

### 7. Install frontend dependencies

```bash
cd ../client
npm install
```

### 8. Start frontend

```bash
npm run dev
```

---

# 🚀 Deployment

### Frontend

Deploy the React/Vite frontend as a **Render Static Site**.

```text
Build Command:
npm install && npm run build

Publish Directory:
dist
```

### Backend

Deploy the Express backend as a **Render Web Service**.

```text
Build Command:
npm install && npx prisma generate && npx prisma migrate deploy && npm run build

Start Command:
npm start
```

### Database

The project uses **Neon PostgreSQL**.

The production backend should use the Neon `DATABASE_URL` through Render environment variables.

---

# 🔐 Security

* 🔑 API keys stored in environment variables
* 🔒 Authentication-protected routes
* 🛡️ Server-side validation
* 🌐 CORS configuration
* 🗄️ Prisma database access
* ☁️ Secure cloud asset storage
* 🚨 Error monitoring

---

# 🔮 Future Improvements

* [ ] AI-generated voiceovers
* [ ] AI avatars
* [ ] Automatic captions
* [ ] Background music
* [ ] Multiple UGC personalities
* [ ] More video styles
* [ ] Brand kit support
* [ ] Direct social media publishing
* [ ] Video editing controls
* [ ] Custom AI ad templates
* [ ] Advanced analytics

---

# 👨‍💻 Author

**Vedant**

Built with ❤️ using React, Node.js, Express, PostgreSQL, Prisma and AI.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,20&height=120&section=footer" width="100%"/>
</p>

<p align="center">
  ⭐ If you like this project, consider giving it a star!
</p>

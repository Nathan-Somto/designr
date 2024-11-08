


# 🎨 Designr

Designr is a fullstack AI-Powered SaaS Graphic design tool, developed to speed up prototyping of custom designs. Leverage our vast collection of community templates to speed your next design idea. 

## 📚 Reason for Project

I did a course in my final year called Graphics and Animation, the information taught there did not really scratch the surface, so I wanted to do a deep dive into the topic by building this application which also takes some inspiration from Figma and Canva in terms of design.

## 🛠️ Project Structure

It's a monorepo powered by TurboRepo with the following project structure:

- **apps/web:** 🌐 The main web application 
- **packages/editor:** 🎨 The core canvas editor that powers the SaaS, built with Fabric.js and React
- **packages/ui:** 💅 The shared Shadcn UI components and Tailwind CSS config used by both the web app and editor
- **packages/eslint-config:** 📏 The ESLint config used throughout the app
- **packages/typescript-config:** 📘 Shared TypeScript configuration throughout the app
- **packages/types:** 📜 Shared type definition files used across the app and editor

## 🚀 Tech Stack

Designr leverages a robust tech stack to support its features:

- **Frontend**: React, Tailwind CSS, Zustand
- **Backend**: Drizzle ORM, Neon (PostgreSQL)
- **Authentication**: Clerk
- **Payments**: Paystack (for handling subscriptions)
- **Media**: Cloudinary (for image storage) and Unsplash API (for stock images)

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **TurboRepo** for managing the monorepo
-  **npm** for package management

### 🚀 Running the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/designr.git
   cd designr
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Running the Web Application**:
   Navigate to `apps/web` and start the Next.js server:
   ```bash
   cd apps/web
   npm dev
   ```

4. **Running the Editor**:
   The editor runs inside the web app, so it’s ready as soon as the web app is live. To run the editor in isolation, navigate to `packages/editor`:
   ```bash
   cd packages/editor
   npm dev
   ```

### 🧪 Testing

1. **Running Unit Tests**:
   ```bash
   npm test
   ```

2. **Linting and Formatting**:
   ```bash
   npm lint
   npm format
   ```

### 📜 Monorepo Commands


- **Build all packages**:
  ```bash
  npm turbo run build
  ```

- **Clean all packages**:
  ```bash
  npm turbo run clean
  ```

- **Run dev for all packages**:
  ```bash
  npm turbo run dev
  ```

---

## 🌐 Deployment

The app is deployed on **Vercel**, which has awesome support for monorepos.

## 👥 Contributing


If you want to contribute, please follow these steps:

1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch-name`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature-branch-name`).
5. **Open a pull request**.

If you’d like to discuss what you want to contribute, please feel free to file an issue!

---

## 🧰 Additional Resources

- [TurboRepo Documentation](https://turborepo.com/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Drizzle ORM Documentation](https://drizzle-orm.dev/)
- [Neon for PostgreSQL](https://neon.tech/)

---

Happy coding! 😊 Let’s create something amazing together with **Designr**!

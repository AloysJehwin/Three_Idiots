# 🎉 Memory Lane – Surprise Gallery

A beautiful, animated web experience to showcase a surprise gallery for Jeslin. Built with **Next.js**, **Framer Motion**, and AWS S3 for image hosting. Includes a dynamic hero section, a smooth transitioning front image carousel, and an interactive image gallery.

---

## ✨ Features

- 🌠 **Hero Carousel**: Displays a sequence of front images with blur transition effects.
- 📸 **Gallery Section**: A Pinterest-style responsive image grid.
- 💡 **Lightbox View**: Clickable images that open in a fullscreen modal.
- 🔒 **Secure Admin Panel**: Protected with a password stored in environment variables.
- ☁️ **S3 Image Hosting**: Images are dynamically fetched from AWS S3 buckets.
- ⚡ **Smooth Animations**: Leveraging `framer-motion` for delightful transitions.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AloysJehwin/Three_Idiots.git
cd Three_Idiots
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=three-idiots-bucket

# Admin Panel
ADMIN_PASSWORD=your_secure_admin_password
```

> ⚠️ **Never commit your `.env.local` file**. It contains sensitive credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

---

## 🗂 Folder Structure

```
/components
  └── Lightbox.tsx      # Lightbox component for fullscreen images
/pages
  ├── index.tsx         # Main homepage
  └── api/
      ├── fetch-image.ts    # API route to fetch S3 gallery images
      └── front.ts          # API route to fetch front hero images
/public
  └── jeslin_front_image/   # Folder for front images
```

---

## 🛠 Technologies Used

- [Next.js](https://nextjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🔒 Security

- AWS credentials and the admin panel password are stored securely in `.env.local`.
- Ensure `.env.local` is **excluded from version control** (`.gitignore`).

---

## 📸 Image Hosting & Uploading

- Front images are served from `/public/jeslin_front_image/`.
- Gallery images are fetched from an S3 bucket via a secure API route.
- Ensure your S3 bucket has the appropriate CORS and permissions policy.

---

## 🧪 Deployment

You can deploy the site using:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**

Make sure to include all environment variables in the platform’s environment settings.

---

## 🙌 Acknowledgements

Special thanks to the magical moment and the person this surprise is meant for 💖.

---

## 📄 License

This project is for personal use only. Please do not copy or reuse without permission.

---


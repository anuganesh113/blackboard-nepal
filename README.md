# Black Board Learn+ Dashboard

A modern, responsive School Management System Dashboard built with React, Vite, and Tailwind CSS. Features a complete dark mode, interactive charts, and a clean, professional UI.

## ✨ Features

- 🎨 **Modern UI** - Clean, gradient-rich design with smooth transitions
- 🌓 **Dark Mode** - Full dark mode support with localStorage persistence
- 📊 **Interactive Charts** - Beautiful charts powered by Recharts
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development
- 🎯 **Easy Navigation** - Intuitive sidebar with collapsible menu

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icons
- **Recharts** - Composable charting library
- **React Router DOM** - Client-side routing

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📂 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── Topbar.jsx           # Top navigation bar
│   ├── StatCard.jsx         # Reusable stat card component
│   └── Charts/
│       ├── PieChartBox.jsx   # Pie chart for student distribution
│       └── BarChart.jsx     # Bar charts for statistics
├── pages/
│   └── Dashboard.jsx        # Main dashboard page
├── context/
│   └── ThemeContext.jsx     # Theme management context
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles with Tailwind
```

## 🎯 Features Overview

### Dashboard
- **8 Stat Cards** - Quick overview of key metrics
  - Total Students, Teachers, Courses, Subjects
  - Batches, Classrooms, Certificates, Attendance Rate
- **Donut Chart** - Visual representation of student distribution by class
- **Bar Charts** - Student counts by class and gender breakdown
- **Info Cards** - Additional insights with trends

### Navigation
- Dashboard
- Batches
- Subjects
- Sections
- Courses
- Teachers
- Classrooms
- Students (with submenu)
  - Promote Student
  - Certificates
  - Scholarship
  - Attendance

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference saved to localStorage
- Smooth transitions throughout the UI

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: {
    light: '#4F46E5',
    dark: '#312E81',
  },
}
```

### Fonts
The project uses Inter font. You can change this in `tailwind.config.js`:

```js
fontFamily: {
  sans: ['Inter', 'sans-serif'],
}
```

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using React + Vite + Tailwind CSS


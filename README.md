# 🛡️ Risk Management System

A modern, scalable **Risk Management** web application built with **Angular** and **Nx monorepo** architecture. This system helps organizations identify, assess, monitor, and mitigate risks effectively through a clean and responsive UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Available Scripts](#available-scripts)
- [Code Quality](#code-quality)
- [Contributing](#contributing)
- [License](#license)

---

## 📌 Overview

The **Risk Management System** is designed to streamline the process of risk identification, evaluation, and tracking within an organization. It provides a structured workflow to:

- Register and categorize risks
- Assess likelihood and impact
- Assign ownership and mitigation plans
- Monitor risk status over time

---

## 🧰 Tech Stack

| Technology      | Description                              |
|-----------------|------------------------------------------|
| **Angular**     | Frontend framework                       |
| **Nx**          | Monorepo build system & tooling          |
| **TypeScript**  | Strongly-typed JavaScript (66.9%)        |
| **HTML**        | Markup (29.6%)                           |
| **SCSS**        | Styling with CSS preprocessor (2.8%)     |
| **Tailwind CSS**| Utility-first CSS framework              |
| **ESLint**      | Linting and code quality enforcement     |
| **Prettier**    | Code formatting                          |

---

## 📁 Project Structure

```
Risk_Managment/
├── apps/                   # Application projects (Angular apps)
├── libs/                   # Shared libraries and reusable modules
├── .vscode/                # VS Code workspace settings
├── .editorconfig           # Editor configuration
├── .eslintconfig.mjs       # ESLint configuration
├── .prettierrc             # Prettier formatting rules
├── global.tailwind.config.js  # Global Tailwind CSS configuration
├── nx.json                 # Nx workspace configuration
├── tsconfig.base.json      # Base TypeScript configuration
└── package.json            # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Nx CLI](https://nx.dev/) (optional, but recommended)

```bash
npm install -g nx
```

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/doaaelomda/Risk_Managment.git
cd Risk_Managment
```

2. **Install dependencies:**

```bash
npm install
```

### Running the App

To serve the application locally:

```bash
nx serve <app-name>
```

Or using npm:

```bash
npm start
```

Then open your browser and navigate to `http://localhost:4200`.

---

## 📜 Available Scripts

| Command                  | Description                          |
|--------------------------|--------------------------------------|
| `nx serve <app>`         | Start the development server         |
| `nx build <app>`         | Build the app for production         |
| `nx test <app>`          | Run unit tests                       |
| `nx lint <app>`          | Run linting checks                   |
| `nx graph`               | Visualize the project dependency graph |

---

## ✅ Code Quality

This project enforces consistent code quality using:

- **ESLint** — for detecting and fixing JavaScript/TypeScript issues
- **Prettier** — for automatic code formatting
- **EditorConfig** — for consistent coding styles across different editors

To lint the project:

```bash
nx lint <app-name>
```

To format the code:

```bash
npx prettier --write .
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your message"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open-source. Feel free to use and modify it as needed.

---

> Built with ❤️ by [Doaa El-Omda](https://github.com/doaaelomda)

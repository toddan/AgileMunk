# AgileMunk 🐵

Simple agile tool for my personal projects

## Features

- 📋 Create and manage multiple project boards
- ✅ Track tasks with different statuses (To Do, In Progress, Done)
- 🎯 Set task priorities (High, Medium, Low)
- 💾 Local storage persistence
- 🎨 Clean and intuitive interface
- ⚡ Built with Nuxt 3 and vanilla JavaScript

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: JavaScript (vanilla, no TypeScript)
- **Styling**: Vanilla CSS
- **Storage**: LocalStorage
- **Runtime**: Node.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/toddan/AgileMunk.git
cd AgileMunk
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## Project Structure

```
AgileMunk/
├── assets/
│   └── css/
│       └── main.css          # Global styles
├── components/
│   ├── BoardCard.vue         # Board card component
│   ├── TaskCard.vue          # Task card component
│   └── Modal.vue             # Reusable modal component
├── pages/
│   ├── index.vue             # Home page
│   └── boards.vue            # Boards management page
├── public/                    # Static assets
├── app.vue                   # Root component
├── nuxt.config.js            # Nuxt configuration
└── package.json              # Dependencies
```

## Usage

### Creating a Board

1. Navigate to the "Boards" page
2. Click the "+ New Board" button
3. Enter a name and description
4. Click "Create"

### Managing Tasks

1. Open a board by clicking "Open Board"
2. Click "+ New Task" to create a task
3. Fill in the task details (title, description, priority, status)
4. Move tasks between columns by changing their status
5. Delete tasks when completed

## Features in Detail

### Board Management
- Create multiple boards for different projects
- View all boards in a grid layout
- Delete boards when no longer needed

### Task Management
- Create tasks with title, description, and priority
- Organize tasks by status (To Do, In Progress, Done)
- Visual priority indicators (High: Red, Medium: Orange, Low: Gray)
- Easy status updates via dropdown
- Delete tasks individually

### Data Persistence
- All data is stored locally in your browser
- No backend required
- Data persists between sessions

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

## Author

toddan

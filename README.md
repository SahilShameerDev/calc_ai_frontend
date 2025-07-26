# AI Calculator Frontend

An interactive AI-powered calculator that allows users to draw mathematical expressions on a canvas and get real-time solutions. This is the frontend application built with React and TypeScript.

## 🔗 Related Repository

**Backend**: [calc_ai_backend](https://github.com/SahilShameerDev/calc_ai_backend) - The AI-powered backend that processes handwritten mathematical expressions.

## 🚀 Features

- **Canvas Drawing Interface**: Draw mathematical expressions directly on an HTML5 canvas
- **AI-Powered Recognition**: Handwritten math expressions are processed by an AI backend
- **Real-time LaTeX Rendering**: Mathematical results are displayed as properly formatted LaTeX equations
- **Draggable Results**: Move calculation results around the screen for better organization
- **Color Palette**: Choose from multiple colors for drawing expressions
- **Variable Assignment**: Support for mathematical variable assignments and reuse
- **Responsive Design**: Works across different screen sizes

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.0**: Modern React with latest features and hooks
- **TypeScript 5.8.3**: Type-safe JavaScript for better development experience
- **Vite 7.0.4**: Fast build tool and development server

### UI Libraries & Components
- **@mantine/core 8.2.1**: React components library for UI elements like ColorSwatch and Group
- **@mantine/hooks 8.2.1**: Utility hooks for React
- **@radix-ui/react-slot 1.2.3**: Composable component primitives
- **Tailwind CSS 4.1.11**: Utility-first CSS framework for styling
- **class-variance-authority 0.7.1**: Utility for constructing CSS class strings
- **clsx 2.1.1**: Utility for conditional CSS classes
- **tailwind-merge 3.3.1**: Utility to merge Tailwind CSS classes

### Mathematical Rendering
- **MathJax 3.2.2**: JavaScript library for displaying mathematical notation
- **@types/mathjax 0.0.40**: TypeScript definitions for MathJax

### Interaction & UX
- **react-draggable 4.5.0**: Enables draggable UI components for moving results
- **lucide-react 0.525.0**: Icon library for UI elements

### HTTP Client
- **axios 1.11.0**: Promise-based HTTP client for API communication

### Routing
- **react-router-dom 7.7.0**: Declarative routing for React applications

## 🏗️ Architecture & How It Works

### 1. Canvas Drawing System
- Users draw mathematical expressions on an HTML5 canvas element
- Mouse/touch events are captured to create smooth drawing lines
- Canvas state is managed through React refs and event handlers
- Drawing colors can be selected from a predefined color palette

### 2. Expression Processing Pipeline
```
User Drawing → Canvas → Base64 Image → API Request → AI Processing → LaTeX Result
```

1. **Canvas Capture**: The drawn expression is converted to a Base64 PNG image
2. **API Communication**: Image data is sent to the backend via HTTP POST request
3. **AI Recognition**: Backend processes the image using AI/ML models to recognize mathematical expressions
4. **Result Processing**: Backend returns structured data with expression and result
5. **LaTeX Rendering**: Results are formatted and displayed using MathJax

### 3. State Management
- **Drawing State**: Canvas drawing state, colors, and user interactions
- **Results State**: LaTeX expressions, calculation results, and their positions
- **Variables State**: Dictionary of assigned variables for reuse in calculations
- **UI State**: Loading states, reset functionality, and component visibility

### 4. Real-time LaTeX Rendering
- MathJax library is dynamically loaded and configured
- Mathematical expressions are rendered with custom styling (white text on dark background)
- Results are displayed in draggable containers for user organization

### 5. Interactive Results
- Each calculation result is wrapped in a draggable component
- Users can move results around the screen for better organization
- Multiple expressions can be displayed simultaneously with proper z-indexing

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SahilShameerDev/calc_ai_frontend.git
cd calc_ai_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```env
VITE_API_URL=your_backend_api_url
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   └── ui/
│       └── button.tsx          # Reusable button component
├── screens/
│   └── home/
│       └── index.tsx           # Main calculator interface
├── lib/
│   └── utils.ts               # Utility functions
├── assets/                    # Static assets
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── constants.ts               # Color swatches and constants
```

## 🔧 Configuration

### MathJax Configuration
The application automatically loads and configures MathJax for LaTeX rendering:
- Inline math: `$...$` and `\(...\)`
- Display math: `$$...$$` and `\[...\]`
- Custom white text styling for dark theme compatibility

### Tailwind CSS
Configured with custom utilities and responsive design classes for optimal user experience across devices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Projects

- **Backend Repository**: [calc_ai_backend](https://github.com/SahilShameerDev/calc_ai_backend) - AI-powered mathematical expression recognition and calculation engine.

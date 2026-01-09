# Newton-AI

Newton-AI is a scientific physics sandbox built with React, TypeScript, and Matter.js. This project allows users to simulate and visualize various physics phenomena in an interactive environment. The application is styled using Tailwind CSS for a modern and responsive design.

## Features

- **Physics Simulation**: Utilize Matter.js to create realistic physics simulations, including gravity, collisions, and object interactions.
- **Object Inspector**: Inspect properties of physics bodies, including velocity, speed, angular velocity, mass, friction, and restitution. The inspector features a floating glass panel styled with Tailwind CSS.
- **Controls**: Adjust simulation parameters such as gravity, time scale, air density, and wind through an intuitive control panel.
- **Input Bar**: Quickly generate preset simulations (e.g., Car Crash, Wave Sim, Zero-G) using preset chips for easy access to common scenarios.
- **Interactive Canvas**: Click on objects in the canvas to select and inspect them, enhancing user interaction with the simulation.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd newton-ai
npm install
```

## Usage

After installing the dependencies, you can start the development server:

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Development

The project is structured as follows:

- **src/components**: Contains all React components, including the canvas, sidebar, toolbar, and UI elements.
- **src/engine**: Contains the physics engine logic and object factory for creating physics bodies.
- **src/hooks**: Custom hooks for managing physics-related state and effects.
- **src/types**: Type definitions for the physics bodies and other entities.
- **src/utils**: Utility functions and constants used throughout the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
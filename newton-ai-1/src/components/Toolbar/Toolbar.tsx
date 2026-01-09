import React from 'react';

const Toolbar: React.FC = () => {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-lg font-bold">Newton-AI</h1>
            <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reset
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Start Simulation
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Stop Simulation
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
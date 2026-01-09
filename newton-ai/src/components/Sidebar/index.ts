import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-4">
            <h2 className="text-lg font-bold mb-4">Newton-AI Sidebar</h2>
            <ul>
                <li className="mb-2">
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Object Inspector</button>
                </li>
                <li className="mb-2">
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Controls</button>
                </li>
                <li className="mb-2">
                    <button className="w-full text-left p-2 hover:bg-gray-700 rounded">Input Bar</button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
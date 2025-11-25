"use client";

import React, { useState } from 'react';
import AIAnalyst from './AIAnalyst';
import Home from './Home';

const Dashboard: React.FC = () => {
    const [activeView, setActiveView] = useState<'Home' | 'AI Analyst'>('Home');

    const renderView = () => {
        switch (activeView) {
            case 'Home':
                return <Home />;
            case 'AI Analyst':
                return <AIAnalyst />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="flex h-screen font-sans">
            <div className="w-64 bg-indigo-900 text-white p-5 flex flex-col">
                <div className="mb-10 text-center">
                    <h1 className="text-2xl m-0">Aqua-Pure Inc.</h1>
                    <p className="text-sm text-indigo-200">Inteligência em Tratamento de Água</p>
                </div>
                <ul className="list-none p-0 m-0">
                    <li onClick={() => setActiveView('Home')} className={`py-3 px-5 cursor-pointer rounded mb-2 ${activeView === 'Home' ? 'bg-indigo-700' : 'bg-transparent'}`}>
                        Painel
                    </li>
                    <li onClick={() => setActiveView('AI Analyst')} className={`py-3 px-5 cursor-pointer rounded mb-2 ${activeView === 'AI Analyst' ? 'bg-indigo-700' : 'bg-transparent'}`}>
                        Analista IA
                    </li>
                    <li className="py-3 px-5 cursor-pointer rounded">
                        Configurações
                    </li>
                </ul>
            </div>
            <main className="flex-1 p-10 overflow-y-auto bg-gray-100">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;

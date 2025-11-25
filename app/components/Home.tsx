"use client";

import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const waterSourceData = [
    { name: 'Água de Rio', value: 4500 },
    { name: 'Água Subterrânea', value: 2500 },
    { name: 'Reservatório', value: 1800 },
    { name: 'Água Reciclada', value: 1200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const qualityData = [
    { name: 'pH', value: 7.2, ideal: 7.0 },
    { name: 'Turbidez', value: 0.8, ideal: 1.0 },
    { name: 'Cloro', value: 1.2, ideal: 1.5 },
    { name: 'Flúor', value: 0.7, ideal: 0.7 },
    { name: 'Dureza', value: 150, ideal: 120 },
];

const systemStatus = [
    { name: 'Coagulação', status: 'Operacional' },
    { name: 'Floculação', status: 'Operacional' },
    { name: 'Sedimentação', status: 'Operacional' },
    { name: 'Filtração', status: 'Atenção' },
    { name: 'Desinfecção', status: 'Operacional' },
    { name: 'Bombeamento', status: 'Inativo' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Operacional':
            return '#2e7d32';
        case 'Atenção':
            return '#ed6c02';
        case 'Inativo':
            return '#d32f2f';
        default:
            return '#000000';
    }
};

const Home: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl mb-8 text-gray-800">Status do Tratamento de Água</h2>
            <div className='flex gap-10 mb-10'>
                <div className="p-5 bg-white rounded-lg shadow-md min-w-2/6">
                    <h3 className="mb-5">Status do Sistema</h3>
                    {systemStatus.map(system => (
                        <div key={system.name} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span>{system.name}</span>
                            <span className={`${getStatusColor(system.status)} font-bold`}>{system.status}</span>
                        </div>
                    ))}
                </div>
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <h3 className="mb-5">Fontes de Água (m³)</h3>
                    <PieChart width={300} height={250}>
                        <Pie data={waterSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                            {waterSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
            <div className="p-5 bg-white rounded-lg shadow-md col-span-full">
                <h3 className="mb-5">Parâmetros de Qualidade da Água</h3>
                <BarChart width={700} height={300} data={qualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3f51b5" name="Valor Atual" />
                    <Bar dataKey="ideal" fill="#c5cae9" name="Valor Ideal" />
                </BarChart>
            </div>
        </div>
    );
};

export default Home;

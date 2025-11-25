"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

// --- Interfaces and Utility Functions ---
interface MeasurementData {
    timestamp: string;
    flow: number;
    level: number;
}

interface AIClassification {
    state: string;
    code: string;
    explanation: string;
}

interface HistoryEntry extends MeasurementData, AIClassification {
    // Additional fields for history if needed
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Operacional':
            return 'text-green-600'; // Tailwind equivalent for #2e7d32
        case 'Atenção':
            return 'text-orange-500'; // Tailwind equivalent for #ed6c02
        case 'Inativo':
            return 'text-red-600'; // Tailwind equivalent for #d32f2f
        default:
            return 'text-gray-800'; // Default text color
    }
};

// --- Mock Data for Charts (existing) ---
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

// --- Home Component ---
const Home: React.FC = () => {
    const [lastMeasurement, setLastMeasurement] = useState<{ data: MeasurementData; ai: AIClassification } | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [sentJson, setSentJson] = useState<any | null>(null);
    const [simulatedApiResponse, setSimulatedApiResponse] = useState<any | null>(null);

    // --- classificar_leitura (AI Classification - Mock) ---
    const classificarLeitura = (data: MeasurementData): AIClassification => {
        let state = "Normal";
        let code = "000";
        let explanation = "Dados dentro dos parâmetros esperados.";

        if (data.flow > 800 || data.level > 90) {
            state = "Crítico";
            code = "101";
            explanation = "Vazão ou nível em níveis críticos. Requer atenção imediata.";
        } else if (data.flow > 600 || data.level > 70) {
            state = "Atenção";
            code = "202";
            explanation = "Vazão ou nível elevados. Monitoramento recomendado.";
        }
        return { state, code, explanation };
    };

    // --- MeasurementAPIClient (Mock API Submission) ---
    const simulateSendToANA = (data: MeasurementData, ai: AIClassification) => {
        const jsonToSend = {
            measurement: data,
            ai_classification: ai,
            api_submission_time: new Date().toISOString()
        };

        const success = Math.random() > 0.5; // 50% chance of success
        const response = success
            ? { status: "success", message: "Dados recebidos e processados pela ANA." }
            : { status: "error", message: "Falha na validação de dados.", details: "Campo 'flow' fora do range." };
        
        setSentJson(jsonToSend);
        setSimulatedApiResponse(response);
    };

    const handleGenerateReading = () => {
        const currentTimestamp = new Date().toISOString();
        const flow = Math.floor(Math.random() * (1000 - 300 + 1)) + 300; // 300-1000 m³/s
        const level = Math.floor(Math.random() * (100 - 50 + 1)) + 50;   // 50-100 %

        const newMeasurementData: MeasurementData = { timestamp: currentTimestamp, flow, level };
        const aiClassification = classificarLeitura(newMeasurementData);

        setLastMeasurement({ data: newMeasurementData, ai: aiClassification });
        setHistory(prev => [{ ...newMeasurementData, ...aiClassification }, ...prev]);
        setSentJson(null); // Clear previous API submission display
        setSimulatedApiResponse(null); // Clear previous API response display
    };

    return (
        <div className="p-5">
            <h2 className="text-3xl mb-8 text-gray-800">Monitoramento do Tratamento de Água</h2>

            {/* Existing Charts and Status */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mb-10'>
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-5">Status do Sistema</h3>
                    {systemStatus.map(system => (
                        <div key={system.name} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <span>{system.name}</span>
                            <span className={`${getStatusColor(system.status)} font-bold`}>{system.status}</span>
                        </div>
                    ))}
                </div>
                <div className="p-5 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-5">Fontes de Água (m³)</h3>
                    <PieChart width={300} height={250}>
                        <Pie data={waterSourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} animationDuration={500}>
                            {waterSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            <div className="p-5 bg-white rounded-lg shadow-md mb-10">
                <h3 className="text-xl font-semibold mb-5">Parâmetros de Qualidade da Água</h3>
                <BarChart width={700} height={300} data={qualityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3f51b5" name="Valor Atual" />
                    <Bar dataKey="ideal" fill="#c5cae9" name="Valor Ideal" />
                </BarChart>
            </div>

            {/* New Functionalities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* 1. Gerar Leitura */}
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-5">1. Gerar Nova Leitura</h3>
                    <button
                        onClick={handleGenerateReading}
                        className="mb-5 px-6 py-2 rounded-lg border-none bg-indigo-700 text-white cursor-pointer hover:bg-indigo-800 transition-colors"
                    >
                        Gerar Leitura
                    </button>

                    {lastMeasurement && (
                        <div>
                            <h4 className="text-lg font-medium mt-4 mb-2">Dados da Leitura Gerada:</h4>
                            <p><strong>Horário:</strong> {new Date(lastMeasurement.data.timestamp).toLocaleString()}</p>
                            <p><strong>Vazão:</strong> {lastMeasurement.data.flow} m³/s</p>
                            <p><strong>Nível:</strong> {lastMeasurement.data.level} %</p>

                            <h4 className="text-lg font-medium mt-4 mb-2">Classificação da IA:</h4>
                            <p><strong>Estado:</strong> <span className={`${getStatusColor(lastMeasurement.ai.state)} font-bold`}>{lastMeasurement.ai.state}</span></p>
                            <p><strong>Código de Transmissão:</strong> {lastMeasurement.ai.code}</p>
                            <p><strong>Explicação:</strong> {lastMeasurement.ai.explanation}</p>
                        </div>
                    )}
                </div>

                {/* 3. Envio para a API (simulado) */}
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-5">3. Envio para a ANA (simulado)</h3>
                    {lastMeasurement ? (
                        <button
                            onClick={() => simulateSendToANA(lastMeasurement.data, lastMeasurement.ai)}
                            className="mb-5 px-6 py-2 rounded-lg border-none bg-green-700 text-white cursor-pointer hover:bg-green-800 transition-colors"
                        >
                            Enviar para ANA (simulado)
                        </button>
                    ) : (
                        <p className="text-gray-600">Gere uma leitura primeiro para enviar.</p>
                    )}

                    {sentJson && (
                        <div className="mt-4">
                            <h4 className="text-lg font-medium mb-2">JSON Enviado:</h4>
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(sentJson, null, 2)}</pre>
                        </div>
                    )}

                    {simulatedApiResponse && (
                        <div className="mt-4">
                            <h4 className="text-lg font-medium mb-2">Resposta Simulada da API:</h4>
                            <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">{JSON.stringify(simulatedApiResponse, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Histórico das Leituras */}
            <div className="p-5 bg-white rounded-lg shadow-md mt-10">
                <h3 className="text-xl font-semibold mb-5">2. Histórico das Leituras</h3>
                {history.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vazão (m³/s)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível (%)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado IA</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código IA</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Explicação IA</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {history.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(entry.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.flow}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.level}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(entry.state)} font-bold`}>{entry.state}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.explanation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Nenhuma leitura no histórico ainda.</p>
                )}
            </div>
        </div>
    );
};

export default Home;

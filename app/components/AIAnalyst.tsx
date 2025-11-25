"use client";

import React, { useState, useEffect } from 'react';

// --- Interfaces (duplicated from Dashboard.tsx for type safety in this file) ---
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

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

interface AIAnalystProps {
    lastMeasurement: { data: MeasurementData; ai: AIClassification } | null;
}

const BACKEND_URL = "http://0.0.0.0:8000";

const AIAnalyst: React.FC<AIAnalystProps> = ({ lastMeasurement }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMessages([
            { text: "Olá! Eu sou o Analista IA da Aqua-Pure. Posso ajudá-lo a analisar os dados de tratamento de água e gerar relatórios. Use os dados de medição mais recentes se relevantes.", sender: 'bot' }
        ]);
    }, []);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = input.trim();
        const newMessages: Message[] = [...messages, { text: userMessage, sender: 'user' }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const requestBody = {
            data: lastMeasurement ? lastMeasurement.data : {}, 
            user_message: userMessage,
        };

        try {
            const response = await fetch(`${BACKEND_URL}/chat_with_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const botResponseText = result.agent_response || "Não consegui obter uma resposta do Analista IA.";

            setMessages((prevMessages) => [
                ...prevMessages,
                { text: botResponseText, sender: 'bot' }
            ]);

        } catch (error) {
            console.error("Erro ao comunicar com o backend:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Desculpe, houve um erro ao processar sua solicitação. Tente novamente mais tarde.", sender: 'bot' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-2xl mb-5 text-gray-800">Analista IA</h2>
            <div className="h-[calc(100vh-300px)] overflow-y-auto mb-5 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} my-2`}>
                        <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-900'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start my-2">
                        <div className="max-w-[70%] p-3 rounded-xl bg-gray-200 text-gray-800 animate-pulse">
                            Digitando...
                        </div>
                    </div>
                )}
            </div>
            <div className="flex">
                <input
                    autoFocus
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Faça uma pergunta ao Analista IA..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 text-base"
                    disabled={isLoading}
                />                <button
                    onClick={handleSend}
                    className="py-3 px-6 ml-3 rounded-lg border-none bg-indigo-900 text-white cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
        </div>
    );
};

export default AIAnalyst;

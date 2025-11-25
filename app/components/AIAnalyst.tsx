"use client";

import React, { useState, useEffect } from 'react';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const AIAnalyst: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        setMessages([
            { text: "Olá! Eu sou o Analista IA da Aqua-Pure. Posso ajudá-lo a analisar os dados de tratamento de água. Sinta-se à vontade para me fazer perguntas como 'Qual é o status do sistema de filtração?' ou 'Resuma o relatório de qualidade da água de hoje.'", sender: 'bot' }
        ]);
    }, []);

    const handleSend = () => {
        if (input.trim()) {
            const newMessages: Message[] = [...messages, { text: input, sender: 'user' }];
            setMessages(newMessages);

            // Mock LLM response
            setTimeout(() => {
                let response = "Desculpe, não consigo responder a essa pergunta no momento. Ainda estou em desenvolvimento.";
                if (input.toLowerCase().includes("filtração")) {
                    response = "O sistema de filtração está atualmente em estado de 'Atenção'. Recomenda-se verificar a pressão do filtro e retrolavar o sistema, se necessário.";
                } else if (input.toLowerCase().includes("qualidade")) {
                    response = "A qualidade geral da água é boa. Todos os parâmetros estão dentro da faixa ideal, exceto a Dureza, que está um pouco alta. Não é um problema crítico, mas pode ser monitorado.";
                }

                setMessages([
                    ...newMessages,
                    { text: response, sender: 'bot' }
                ]);
            }, 500);

            setInput('');
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
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Faça uma pergunta ao Analista IA..."
                    className="flex-1 p-3 rounded-lg border border-gray-300 text-base"
                />                <button
                    onClick={handleSend}
                    className="py-3 px-6 ml-3 rounded-lg border-none bg-indigo-900 text-white cursor-pointer text-base"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default AIAnalyst;

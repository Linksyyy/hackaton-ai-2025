from mangaba_ai import MangabaAgent
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

agent = MangabaAgent()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    data: dict
    user_message: str

SYSTEM_PROMPT = """Você é o Analista IA da Aqua-Pure. Sua principal responsabilidade é analisar dados de tratamento de água e gerar relatórios concisos e informativos. 
Você deve usar os dados fornecidos para contextualizar suas respostas.
Quando dados forem fornecidos, considere-os relevantes para a pergunta do usuário e inclua-os em sua análise ou relatório, se aplicável.
Seja objetivo e direto.
"""

@app.get("/{pergunta}")
def read_root(pergunta: str):
    full_prompt = f"{SYSTEM_PROMPT}\nUsuário: {pergunta}"
    response = agent.chat(full_prompt)
    return {"message": response}

@app.post("/chat_with_data")
def chat_with_data_endpoint(request: ChatRequest):
    data_str = ""
    if request.data:
        data_str = "Dados de medição atuais: \n"
        for key, value in request.data.items():
            data_str += f"- {key}: {value}\n"
        data_str += "\n"

    full_prompt = f"{SYSTEM_PROMPT}\n{data_str}Usuário: {request.user_message}"
    
    agent_response = agent.chat(full_prompt)
    return {
        "received_message": request.user_message,
        "received_data": request.data,
        "agent_response": agent_response
    }
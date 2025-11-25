from mangaba_ai import MangabaAgent
from fastapi import FastAPI

agent = MangabaAgent()
app = FastAPI()

@app.get("/{pergunta}")
def read_root(pergunta: str):
    response = agent.chat(pergunta)
    return {"message": response}

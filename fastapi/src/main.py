from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = FastAPI()

# 모델과 토크나이저 로드 (로컬 경로 지정)
model_name_or_path = "models"
tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, local_files_only=True)
model = AutoModelForSequenceClassification.from_pretrained(model_name_or_path, local_files_only=True)

@app.post("/chatbot/")
async def chatbot(request: Request):
    data = await request.json()
    user_input = data['input']
    
    # 입력 토큰화
    inputs = tokenizer(user_input, return_tensors="pt")
    outputs = model(**inputs)
    
    # 출력 후처리 (예시로 가장 높은 확률의 라벨을 반환)
    result = outputs.logits.argmax(dim=-1).item()
    
    # 여기서는 간단히 라벨을 반환하지만, 실제로는 라벨에 해당하는 텍스트 응답을 구성
    return {"response": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, Request
from transformers import AutoTokenizer, GPT2LMHeadModel
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용
    allow_credentials=True,  # 자격 증명 포함 요청 허용
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 모델과 토크나이저 로드 (models 폴더에서 로드)
model_path = "models/"  # 모델 경로
tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
model = GPT2LMHeadModel.from_pretrained(model_path, local_files_only=True)

# GPU 설정 (사용 가능 시)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 모델을 평가 모드로 전환
model.eval()

@app.post("/api/v1/chat")  # 경로를 '/api/v1/chat'으로 설정
async def chatbot(request: Request):
    data = await request.json()
    user_input = data['query']

    # 입력 텍스트 토큰화
    input_ids = tokenizer.encode(user_input, return_tensors='pt', add_special_tokens=True).to(device)

    # Attention mask 생성
    attention_mask = torch.ones(input_ids.shape, device=device)

    # 모델을 사용해 예측 생성
    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            attention_mask=attention_mask,
            max_length=100,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
            pad_token_id=tokenizer.eos_token_id
        )

    # 생성된 텍스트 디코딩
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return {"response": generated_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8083)
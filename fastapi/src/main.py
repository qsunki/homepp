from fastapi import FastAPI, Request
from transformers import AutoTokenizer, GPT2LMHeadModel
import torch

app = FastAPI()

# 모델과 토크나이저 로드 (models 폴더에서 로드)
model_path = "models/kogpt2_finetuned_epoch5"  # 모델 경로
tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
model = GPT2LMHeadModel.from_pretrained(model_path, local_files_only=True)

# GPU 설정 (사용 가능 시)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 모델을 평가 모드로 전환
model.eval()

@app.post("/chatbot/")
async def chatbot(request: Request):
    data = await request.json()
    user_input = data['query']  # 'input' 대신 'query' 키를 사용

    # 입력 텍스트 토큰화
    input_ids = tokenizer.encode(user_input, return_tensors='pt', add_special_tokens=True).to(device)

    # Attention mask 생성
    attention_mask = torch.ones(input_ids.shape, device=device)

    # 모델을 사용해 예측 생성
    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            attention_mask=attention_mask,
            max_length=100,  # 최대 길이 설정
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
            pad_token_id=tokenizer.eos_token_id  # pad_token_id를 eos_token_id로 설정
        )

    # 생성된 텍스트 디코딩
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # 결과 반환
    return {"response": generated_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

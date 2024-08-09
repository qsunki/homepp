from transformers import AutoTokenizer, AutoModelForSequenceClassification

# 모델과 토크나이저 로드 (로컬 경로 지정)
model_name_or_path = "../models/koelectra2_quantized"

try:
    # 모델과 토크나이저 로드
    tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(model_name_or_path, local_files_only=True)

    # 테스트 입력 텍스트
    test_input = "이 모델이 잘 작동하는지 확인하고 있습니다."
    
    # 입력 토큰화
    inputs = tokenizer(test_input, return_tensors="pt")
    
    # 모델 출력
    outputs = model(**inputs)
    
    # 가장 높은 확률의 라벨 선택
    predicted_class = outputs.logits.argmax(dim=-1).item()
    
    # 테스트 결과 출력
    print("모델이 성공적으로 로드되었습니다.")
    print(f"테스트 입력: {test_input}")
    print(f"예측된 클래스: {predicted_class}")
    print("모델 테스트가 성공적으로 완료되었습니다.")

except Exception as e:
    print("모델 로드 또는 테스트 중 오류 발생:", str(e))

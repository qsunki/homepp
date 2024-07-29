import React, { useState, useRef, useEffect } from 'react';

const FAQ: React.FC = () => {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const faqs = [
    {
      id: 1,
      question: '📷 웹캠 작동 확인 방법',
      answer: (
        <>
          웹캠이 정상적으로 작동하는지 확인하려면, 라즈베리파이에 연결된 웹캠이
          올바르게 설치되었는지 확인하세요. <br />
          웹캠 테스트 프로그램을 실행하여 실시간 영상 스트림을 확인할 수
          있습니다. <br />
          이상이 있을 경우, 라즈베리파이의 USB 포트 연결 상태를 점검해 보세요.
        </>
      ),
    },
    {
      id: 2,
      question: '🌡️ 온도 센서 작동 확인 방법',
      answer: (
        <>
          온도 센서가 제대로 작동하는지 확인하려면, 제공된 소프트웨어를 실행하여
          온도 데이터를 실시간으로 모니터링하세요. <br />
          온도 변화에 따라 값이 업데이트되는지 확인합니다. <br />
          예상 온도 범위와 실제 측정 값이 일치하는지 비교해 보세요.
        </>
      ),
    },
    {
      id: 3,
      question: '💧 습도 센서 작동 확인 방법',
      answer: (
        <>
          습도 센서의 작동 상태를 확인하려면, 소프트웨어를 통해 실시간 습도
          데이터를 모니터링합니다. <br />
          습도 변화에 따라 값이 올바르게 업데이트되는지 확인하세요. <br />
          실내 습도와 센서가 측정한 습도 값을 비교하여 정확성을 점검합니다.
        </>
      ),
    },
    {
      id: 4,
      question: '🔥 가스 센서 작동 확인 방법',
      answer: (
        <>
          가스 센서가 제대로 작동하는지 확인하려면, 소프트웨어를 통해 실시간
          가스 농도 데이터를 확인하세요. <br />
          가스가 감지되었을 때 경고 알림이 작동하는지 테스트합니다. <br />
          가스 농도가 일정 수준을 초과할 때 경보가 울리는지 확인하세요.
        </>
      ),
    },
    {
      id: 5,
      question: '🛠️ 라즈베리파이 초기 설정 방법',
      answer: (
        <>
          라즈베리파이의 전원을 켜고 모니터, 키보드, 마우스를 연결합니다. <br />
          초기 설정 마법사를 따라 라즈베리파이 OS를 설치하고 업데이트합니다.{' '}
          <br />
          네트워크 설정을 완료하여 인터넷에 연결합니다. <br />
          보안 소프트웨어를 설치하고 모든 센서가 올바르게 연결되었는지
          확인하세요.
        </>
      ),
    },
  ];

  useEffect(() => {
    if (selectedFAQ !== null && contentRefs.current[selectedFAQ]) {
      const content = contentRefs.current[selectedFAQ];
      if (content) {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    }
  }, [selectedFAQ]);

  const handleToggle = (id: number) => {
    if (selectedFAQ === id) {
      setSelectedFAQ(null);
    } else {
      setSelectedFAQ(id);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      {faqs.map((faq) => (
        <div key={faq.id} className="mb-4 border-b pb-2">
          <div className="flex justify-between items-center">
            <h3
              className="text-xl font-semibold cursor-pointer"
              onClick={() => handleToggle(faq.id)}
            >
              {faq.question}
            </h3>
            <span
              className="cursor-pointer text-sm"
              onClick={() => handleToggle(faq.id)}
            >
              {selectedFAQ === faq.id ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-plus"></i>
              )}
            </span>
          </div>
          <div
            ref={(el) => (contentRefs.current[faq.id] = el)}
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              selectedFAQ === faq.id ? 'max-h-[2000px]' : 'max-h-0'
            }`}
            style={{
              maxHeight:
                selectedFAQ === faq.id
                  ? `${contentRefs.current[faq.id]?.scrollHeight}px`
                  : '0',
            }}
          >
            <div className="mt-2 p-2 bg-gray-100 shadow-inner rounded">
              <p className="whitespace-pre-wrap">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;

import React, { useState, useRef, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Announcement: React.FC = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<
    number | null
  >(null);
  const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const announcements = [
    {
      id: 1,
      title: '🚨 서비스 소개 🚨',
      content: `안녕하세요! 저희 홈 보안 서비스는 여러분의 집을 안전하게 지켜드립니다. 최첨단 기술을 통해 실시간 모니터링, 알림 기능 등을 제공하며, 사용자의 편의와 안전을 최우선으로 생각합니다.`,
    },
    {
      id: 2,
      title: '🔄 버전 2.1.0 업데이트',
      content: `최신 업데이트가 적용되었습니다! 이번 버전에서는 사용자 인터페이스가 개선되고, 보다 빠른 응답 속도를 자랑합니다. 또한, 몇 가지 버그가 수정되었습니다.\n- 새로운 대시보드 디자인\n- 알림 기능 최적화\n- 보안 강화 패치`,
    },
    {
      id: 3,
      title: '🛠️ 점검 안내',
      content: `저희 서비스는 8월 5일 오전 2시부터 4시까지 정기 점검을 진행할 예정입니다. 점검 시간 동안 서비스 이용이 일시적으로 제한될 수 있으니 양해 부탁드립니다.`,
    },
    {
      id: 4,
      title: '📢 고객센터 운영 시간 변경',
      content: `고객 여러분의 편의를 위해 고객센터 운영 시간이 변경되었습니다. 새로운 운영 시간은 월요일부터 금요일까지 오전 9시부터 오후 6시까지입니다. 변경된 시간 동안 더욱 나은 서비스를 제공할 수 있도록 최선을 다하겠습니다.`,
    },
  ];

  useEffect(() => {
    if (
      selectedAnnouncement !== null &&
      contentRefs.current[selectedAnnouncement]
    ) {
      const content = contentRefs.current[selectedAnnouncement];
      if (content) {
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    }
  }, [selectedAnnouncement]);

  const handleToggle = (id: number) => {
    if (selectedAnnouncement === id) {
      setSelectedAnnouncement(null);
    } else {
      setSelectedAnnouncement(id);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Announcement</h2>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="mb-4 border-b pb-2">
          <div className="flex justify-between items-center">
            <h3
              className="text-xl font-semibold cursor-pointer"
              onClick={() => handleToggle(announcement.id)}
            >
              {announcement.title}
            </h3>
            <span
              className="cursor-pointer text-sm"
              onClick={() => handleToggle(announcement.id)}
            >
              {selectedAnnouncement === announcement.id ? (
                <i className="fas fa-times"></i>
              ) : (
                <i className="fas fa-plus"></i>
              )}
            </span>
          </div>
          <div
            ref={(el) => (contentRefs.current[announcement.id] = el)}
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              selectedAnnouncement === announcement.id
                ? 'max-h-[2000px]'
                : 'max-h-0'
            }`}
            style={{
              maxHeight:
                selectedAnnouncement === announcement.id
                  ? `${contentRefs.current[announcement.id]?.scrollHeight}px`
                  : '0',
            }}
          >
            <div className="mt-2 p-2 bg-gray-100 shadow-inner rounded">
              <p className="whitespace-pre-wrap">{announcement.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Announcement;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/mypage/Modal';
import Announcement from '../components/mypage/Announcement';
import Support from '../components/mypage/Support';

const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex space-x-4">
              <button
                onClick={() => openModal(<Announcement />)}
                className="text-sm hover:text-gray-400"
              >
                Info
              </button>
              <button
                onClick={() => openModal(<Support />)}
                className="text-sm hover:text-gray-400"
              >
                Support
              </button>
              <button
                onClick={() =>
                  openModal(
                    <div className="text-gray-700">
                      <h2 className="text-black text-2xl font-bold mb-4">
                        Terms of Use
                      </h2>
                      <p className="text-base">
                        저희 웹사이트에 접속하거나 이용함으로써 귀하는 본 약관에
                        동의하고 이를 준수할 것에 동의합니다. 당사는 사전 통지
                        없이 언제든지 이 약관을 업데이트할 권리를 보유합니다. 이
                        약관을 정기적으로 검토하는 것은 귀하의 책임입니다. 변경
                        사항 이후 웹사이트를 계속 사용하면 새로운 약관에
                        동의하는 것으로 간주됩니다.
                      </p>
                      <p className="text-base">
                        귀하는 본 웹사이트를 합법적인 목적으로만 사용하며, 다른
                        사람의 권리를 침해하거나, 다른 사람의 웹사이트 이용을
                        제한하거나 방해하는 방식으로 사용하지 않을 것에
                        동의합니다. 금지된 행동에는 다른 사용자에게 괴롭힘을
                        주거나 불편을 초래하는 행위, 음란하거나 불쾌한 내용을
                        전송하는 행위, 웹사이트 내 대화의 정상적인 흐름을
                        방해하는 행위가 포함됩니다.
                      </p>
                      <p className="text-base">
                        이 웹사이트의 모든 콘텐츠는 텍스트, 그래픽, 로고 및
                        이미지를 포함하며, [귀하의 회사]의 자산이며 저작권법의
                        보호를 받습니다. 이 사이트의 어떤 자료도 무단으로
                        사용하면 저작권, 상표권 및 기타 법률을 위반할 수
                        있습니다.
                      </p>
                      <p className="text-base">
                        당사는 웹사이트가 중단되지 않거나 오류가 없음을 보증하지
                        않으며, 결함이 수정되거나 사이트 또는 이를 제공하는
                        서버에 바이러스나 버그가 없음을 보증하지 않습니다.
                        당사는 귀하의 사이트 사용으로 인해 발생할 수 있는 서비스
                        거부 공격, 바이러스 또는 기타 기술적으로 해로운 자료로
                        인해 귀하의 컴퓨터 장비, 컴퓨터 프로그램, 데이터 또는
                        기타 독점 자료에 발생한 손실이나 손해에 대해 책임을 지지
                        않습니다.
                      </p>
                      <p className="text-base">
                        이 약관은 [귀하의 국가/주] 법률의 지배를 받으며, 모든
                        분쟁은 해당 관할권의 법원에서 해결됩니다.
                      </p>
                    </div>
                  )
                }
                className="text-sm hover:text-gray-400"
              >
                Terms of Use
              </button>
              <button
                onClick={() =>
                  openModal(
                    <div className="text-gray-700">
                      <h2 className="text-black text-2xl font-bold mb-4">
                        Privacy Policy
                      </h2>
                      <p className="text-base">
                        저희는 귀하의 개인정보를 소중히 여기며 이를 보호하기
                        위해 최선을 다하고 있습니다. 이 개인정보 처리방침은
                        저희가 수집하는 정보, 이를 사용하는 방법 및 귀하의
                        정보에 대한 권리에 대해 설명합니다.
                      </p>
                      <p className="text-base">
                        저희는 귀하가 직접 제공하는 정보를 수집하며, 여기에는
                        계정 생성, 프로필 업데이트, 저희와의 소통 시 제공하는
                        정보가 포함됩니다. 수집하는 정보의 유형에는 이름, 이메일
                        주소, 전화번호 및 기타 귀하가 제공하는 정보가 포함될 수
                        있습니다.
                      </p>
                      <p className="text-base">
                        저희는 수집한 정보를 서비스 제공, 유지 및 개선을 위해
                        사용하며, 귀하와의 소통 및 귀하의 경험을 개인화하는 데
                        사용합니다. 또한 마케팅 목적으로 귀하의 정보를 사용할 수
                        있으며, 언제든지 이러한 통신을 수신 거부할 수 있습니다.
                      </p>
                      <p className="text-base">
                        저희는 법적으로 요구되는 경우를 제외하고, 귀하의
                        개인정보를 제3자와 공유하지 않습니다. 서비스를 제공하기
                        위해 기능을 수행하는 서비스 제공자와 정보를 공유할 수
                        있으며, 이들은 귀하의 정보를 보호할 계약적 의무를
                        가집니다.
                      </p>
                      <p className="text-base">
                        저희는 귀하의 개인정보를 무단 접근, 사용 또는 공개로부터
                        보호하기 위해 합리적인 조치를 취하고 있습니다. 그러나
                        인터넷 전송은 완전히 안전하거나 오류가 없음을 보장할 수
                        없으므로, 온라인으로 개인정보를 제공할 때 이를
                        유념하시기 바랍니다.
                      </p>
                      <p className="text-base">
                        개인정보 처리방침에 대한 질문이나 우려 사항이 있으시면
                        [귀하의 연락처 정보]로 연락해 주시기 바랍니다.
                      </p>
                    </div>
                  )
                }
                className="text-sm hover:text-gray-400"
              >
                Privacy Policy
              </button>
              <Link to="/about-us" className="text-sm hover:text-gray-400">
                About Us
              </Link>
            </div>
          </div>
          <ul className="flex space-x-2">
            <li className="relative group">
              <a
                href="https://linkedin.com/"
                aria-label="LinkedIn"
                className="relative flex items-center justify-center w-8 h-8 bg-white text-gray-800 rounded-full shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
              >
                <div className="absolute inset-0 w-full h-full bg-[#0274b3] transition-transform duration-500 ease-in-out transform origin-bottom scale-y-0 group-hover:scale-y-100"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-linkedin relative z-10 transition-colors duration-500 ease-in-out group-hover:fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                </svg>
              </a>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                LinkedIn
              </div>
            </li>
            <li className="relative group">
              <a
                href="https://github.com/"
                aria-label="GitHub"
                className="relative flex items-center justify-center w-8 h-8 bg-white text-gray-800 rounded-full shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
              >
                <div className="absolute inset-0 w-full h-full bg-[#24262a] transition-transform duration-500 ease-in-out transform origin-bottom scale-y-0 group-hover:scale-y-100"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-github relative z-10 transition-colors duration-500 ease-in-out group-hover:fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
              </a>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                GitHub
              </div>
            </li>
            <li className="relative group">
              <a
                href="https://instagram.com/"
                aria-label="Instagram"
                className="relative flex items-center justify-center w-8 h-8 bg-white text-gray-800 rounded-full shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#405de6] via-[#c135b4] to-[#fd1d1d] transition-transform duration-500 ease-in-out transform origin-bottom scale-y-0 group-hover:scale-y-100"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-instagram relative z-10 transition-colors duration-500 ease-in-out group-hover:fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                </svg>
              </a>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                Instagram
              </div>
            </li>
            <li className="relative group">
              <a
                href="https://youtube.com/"
                aria-label="YouTube"
                className="relative flex items-center justify-center w-8 h-8 bg-white text-gray-800 rounded-full shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
              >
                <div className="absolute inset-0 w-full h-full bg-[#ff0000] transition-transform duration-500 ease-in-out transform origin-bottom scale-y-0 group-hover:scale-y-100"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-youtube relative z-10 transition-colors duration-500 ease-in-out group-hover:fill-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                </svg>
              </a>
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100">
                YouTube
              </div>
            </li>
          </ul>
        </div>
        <div className="mt-2 text-center text-sm">
          &copy; {new Date().getFullYear()} Home++. All rights reserved.
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </footer>
  );
};

export default Footer;

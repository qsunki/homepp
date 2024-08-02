declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.css' {
  const value: { [className: string]: string };
  export default value;
}

declare module 'sockjs-client' {
  type SockJSReadyState = 0 | 1 | 2 | 3;

  interface SockJSOptions {
    server?: string;
    sessionId?: number | (() => string);
    transport?: string | string[];
    transports?: string[];
    timeout?: number;
    // 추가 가능한 옵션들 정의
  }

  class SockJS {
    constructor(
      url: string,
      protocols?: string | string[],
      options?: SockJSOptions
    );
    close(code?: number, reason?: string): void;
    send(data: string): void;

    onopen: (e: Event) => void;
    onmessage: (e: MessageEvent) => void;
    onclose: (e: CloseEvent) => void;
    readyState: SockJSReadyState;

    static CONNECTING: SockJSReadyState;
    static OPEN: SockJSReadyState;
    static CLOSING: SockJSReadyState;
    static CLOSED: SockJSReadyState;
  }

  export default SockJS;
}

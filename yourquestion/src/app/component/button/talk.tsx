"use client";
// src/components/Talk.tsx
import React, { useState, useEffect } from "react";

type MessageType = "user" | "admin";

interface Message {
  type: MessageType;
  text: string;
  timestamp: Date;
}

export const Talk: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 서버에서 메시지 목록을 가져오는 함수
  const fetchMessages = async () => {
    try {
      const response = await fetch("/talk/user?message=user");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };
  // 서버에서 메시지 목록을 가져오는 함수
  const fetchAdminMessages = async () => {
    try {
      const response = await fetch("/talk/admin?message=admin");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const fetchedMessages = await response.json();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      // 팝업이 열릴 때 최신 메시지를 가져옵니다.
      fetchMessages();
      fetchAdminMessages();

      // user 메시지를 가져오는 인터벌 설정
      const intervalUser = setInterval(fetchMessages, 5000);
      // admin 메시지를 가져오는 인터벌 설정
      const intervalAdmin = setInterval(fetchAdminMessages, 5000);

      // 컴포넌트가 언마운트될 때 인터벌을 제거합니다.
      return () => {
        clearInterval(intervalUser);
        clearInterval(intervalAdmin);
      };
    }
    // isPopupOpen이 변경될 때마다 useEffect 훅을 실행합니다.
  }, [isPopupOpen]);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <>
      <button className="p-2 bg-red-200 rounded-full" onClick={togglePopup}>
        💬
      </button>{" "}
      {/* 팝업 토글 버튼 */}
      {isPopupOpen && ( // 팝업 상태에 따라 조건부 렌더링
        <div className="fixed inset-0 bg-black bg-opacity-15 flex justify-end items-start">
          <div className="bg-white p-4 w-1/2 mt-14 mr-10  h-4/5 rounded-lg shadow-lg max-w-md">
            <div className="flex justify-end">
              {/* 팝업 닫기 버튼 */}
              <button onClick={togglePopup} className="text-xl">
                📌
              </button>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col space-y-4 p-4 bg-white overflow-y-auto">
                {messages.map((message, index) =>
                  message.type === "admin" ? (
                    // Admin 메시지: 왼쪽 정렬
                    <div key={index} className="flex justify-start">
                      <div className="bg-gray-200 rounded px-4 py-2 shadow">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    // User 메시지: 오른쪽 정렬
                    <div key={index} className="flex justify-end">
                      <div className="bg-pink-500 rounded px-4 py-2 shadow text-white">
                        {message.text}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex flex-col space-y-4 p-4 bg-white overflow-y-auto">
                {messages.map((message, index) =>
                  message.type === "user" ? (
                    // Admin 메시지: 왼쪽 정렬
                    <div key={index} className="flex justify-start">
                      <div className="bg-gray-200 rounded px-4 py-2 shadow">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    // User 메시지: 오른쪽 정렬
                    <div key={index} className="flex justify-end">
                      <div className="bg-blue-500 rounded px-4 py-2 shadow text-white">
                        {message.text}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Talk;

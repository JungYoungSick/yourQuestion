import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchTalkData } from "../../api/fetch/talkListPageFetch/fetchTalkData";
import { decodeToken } from "../../api/token/userJWT";
import { Talk } from "../../interface/talk";

export const TalkList: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [talkData, setTalkData] = useState<Talk[]>([]);

  useEffect(() => {
    if (isPopupOpen) {
      const initializeTalkData = async () => {
        const token = localStorage.getItem("token");
        const decoded = token ? decodeToken(token) : null;
        if (decoded && decoded.userID) {
          const title = await fetchTalkData(decoded.userID);
          setTalkData(title);
        }
      };

      initializeTalkData();
    }
  }, [isPopupOpen]);

  const handleListOpenClick = () => setIsPopupOpen(true);
  const handleListCloseClick = () => setIsPopupOpen(false);

  return (
    <>
      <button
        onClick={handleListOpenClick}
        className="p-2 bg-blue-200 rounded-full"
      >
        🗓️
      </button>
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-15 flex justify-end items-start"
          onClick={handleListCloseClick}
        >
          <div
            className="bg-white p-4 w-1/2 mt-14 mr-10 h-4/5 rounded-lg shadow-lg max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button onClick={handleListCloseClick} className="text-xl">
                📌
              </button>
            </div>
            <ul className="mt-4">
              {talkData.map((data, index) => (
                <li key={index} className="py-2 bg-gray-100 mb-2 rounded-lg">
                  <Link
                    href={`/talk/${data.title}`}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    {data.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* <ul>
              {Array.isArray(talkData) &&
                talkData.map((data) => (
                  <li key={data.id}>
                    <Link href={`/talk/${data.id}`}>{data.title}</Link>
                  </li>
                ))}
            </ul> */}
          </div>
        </div>
      )}
    </>
  );
};

export default TalkList;

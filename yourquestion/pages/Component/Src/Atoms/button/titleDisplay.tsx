// TitleDisplay.tsx
import React, { useEffect } from "react";
import { saveAdminTitle } from "../../api/fetch/talkPageFetch/saveAdminTitle";

interface TitleDisplayProps {
  title: string;
}

const TitleDisplay: React.FC<TitleDisplayProps> = ({ title }) => {
  return (
    <div className="title-display">
      <h2>{title || "로그인을 해주세요."}</h2>
    </div>
  );
};

export default TitleDisplay;

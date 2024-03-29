// 사용자 로그인 상태 관리 커스텀 Hook (useLoginStatus)
// 이렇게 작성된 useLoginStatus 훅을 사용하면 컴포넌트에서 로그인 상태를 쉽게 관리할 수 있습니다

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { IUser, JwtPayload } from "../../interface/login";

const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser>({
    userName: "",
    userEmail: "",
    userID: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // 로그인 상태를 설정
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser({
            userName: decodedToken.userName,
            userEmail: decodedToken.userEmail,
            userID: decodedToken.userID,
          });
        } else {
          localStorage.removeItem("token"); // 토큰이 만료되었으면 삭제
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("토큰 디코드 실패", error);
        localStorage.removeItem("token"); // 오류가 발생하면 토큰 삭제
        setIsLoggedIn(false);
      }
    }
  }, []);

  return { isLoggedIn, user, setIsLoggedIn, setUser };
};

export default useLoginStatus;

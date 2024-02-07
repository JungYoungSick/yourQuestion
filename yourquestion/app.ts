import express, { Request, Response } from "express";
import next from "next";
import { MongoClient } from "mongodb";

// MongoDB 연결 및 기능 구현 파일 임포트
// 여기서는 상대 경로를 사용하며, 실제 경로에 따라 수정해야 합니다.
import {
  userSaveToMongoDB,
  getFromMongoDB,
  adminSaveToMongoDB,
  client,
} from "./src/app/nosql/server";

const isDev = process.env.NODE_ENV !== "production";
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // 사용자 데이터를 MongoDB에 저장
  server.post("/nosql/mongodb/user", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const saveResult = await userSaveToMongoDB(data);
      res.status(200).json(saveResult);
    } catch (error) {
      console.error("MongoDB에 데이터 저장 중 오류 발생:", error);
      res
        .status(500)
        .json({ message: "MongoDB에 데이터 저장 중 오류 발생", error });
    }
  });

  // MongoDB에서 데이터 조회
  server.get("/nosql/mongodb", async (req: Request, res: Response) => {
    const query = req.query;
    try {
      const result = await getFromMongoDB(query);
      console.log("getFromMongoDB 조회 완료");
      res.status(200).json(result);
    } catch (error) {
      console.error("MongoDB 조회 에러:", error);
      res.status(500).json({ message: "MongoDB에서 데이터 조회 중 오류 발생" });
    }
  });

  // 관리자 검색 기능
  server.post("/nosql/searchAdmin", async (req: Request, res: Response) => {
    try {
      const keyword = req.body.keyword;
      const db = client.db("prompt");
      const collection = db.collection("admin");
      const query = keyword ? { text: { $regex: keyword, $options: "i" } } : {};
      const results = await collection.find(query).toArray();
      res.status(200).json(results);
      console.log("메인서버 데이터 받기 이상없음");
    } catch (error) {
      console.error("Error searching in admin collection", error);
      res
        .status(500)
        .json({ message: "Error searching in admin collection", error });
    }
  });

  // 관리자 데이터를 MongoDB에 저장
  server.post("/nosql/mongodb/admin", async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const saveResult = await adminSaveToMongoDB(data);
      res.status(200).json(saveResult);
    } catch (error) {
      console.error("Error saving data to admin collection:", error);
      res
        .status(500)
        .json({ message: "Error saving data to admin collection", error });
    }
  });

  // Next.js 라우트 핸들링
  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  // 서버 리스닝
  const port = process.env.PORT || 3000;
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
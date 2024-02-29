// ## 관리자 데이터 검색

import { Request, Response } from "express";
import { searchAdminCollection } from "./searchAdminCollection";

export const searchAdminData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const keyword = req.body.keyword;
    const results = await searchAdminCollection(keyword);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching in admin collection", error);
    res
      .status(500)
      .json({ message: "Error searching in admin collection", error });
  }
};
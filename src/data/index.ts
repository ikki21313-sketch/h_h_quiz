import type { Question } from "../types";
import { s1Questions } from "./star1";
import { s2Questions } from "./star2";
import { s3Questions } from "./star3";
import { omameQuestions } from "./omame";

/** 問題データの版。問題を追加・修正したら更新する */
export const DATA_VERSION = "2026-09-13";

export const allQuestions: Question[] = [...s1Questions, ...s2Questions, ...s3Questions, ...omameQuestions];

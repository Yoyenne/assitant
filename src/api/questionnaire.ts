/*
 *  UserMentalController 用户心理健康相关接口
 */
import { getRequest, postRequest } from '../lib/axios';

// 定义请求和响应类型
interface MentalRecordSubmitRequest {
  userId?: number;
  score: number;
  level: string;
  description: string;
  suggestion: string;
  questionnaireId: number;
  dateTime: string;
  id?: number;
}

interface MentalHistoryParams {
  page?: number;
  size?: number;
}

interface QuestionnaireHistoryParams extends MentalHistoryParams {
  questionnaireId: number;
}

interface DayRecordsParams {
  date: string; // 格式为 yyyy-MM-dd
}

export const questionnaireApi = {
  /**
   * 提交用户心理健康记录
   */
  submitMentalRecord: (param: MentalRecordSubmitRequest) => {
    return postRequest('/user/mental/submit', param);
  },

  /**
   * 获取用户健康记录历史
   * @param page 页面索引 (默认为0)
   * @param size 每页大小 (默认为10)
   */
  getMentalHistory: (param: MentalHistoryParams = {}) => {
    return getRequest('/user/mental/history', param);
  },

  /**
   * 获取用户某个问卷的历史记录
   * @param questionnaireId 问卷ID
   * @param page 页面索引 (默认为0)
   * @param size 每页大小 (默认为10)
   */
  getQuestionnaireHistory: (param: QuestionnaireHistoryParams) => {
    return getRequest('/user/mental/history/questionnaire', param);
  },

  /**
   * 获取用户某天的健康记录
   * @param date 特定日期 (格式为 yyyy-MM-dd)
   */
  getDayMentalRecords: (param: DayRecordsParams) => {
    return getRequest('/user/mental/day', param);
  }
};

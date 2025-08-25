import { get, post } from './api';

export const analyzeSentiment = async (text) => {
  return await post('/sentiment/analyze', { text });
};

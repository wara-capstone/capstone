// src/state/atom.js
import { atom } from 'recoil';

export const tokenAtom = atom({
  key: 'sharedToken', // 유니크한 key
  default: "", // 기본값
});

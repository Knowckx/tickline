import { atom } from 'jotai';
import { OneTick } from '../types/tick';




/** 表示被选中的bar的index和具体的数据 */
export const SelectTickAtom = atom<{idx:number, tick: OneTick} | null>(null);

/** 目前图形显示的范围 放入的是Tick数组的index int值*/
export const ShowRangeAtom = atom<{ startIndex: number, endIndex: number } | null>(null);
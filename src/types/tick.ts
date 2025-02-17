export interface StockInfo {
    Sid: string;
    Name: string;
}

export interface OneTick {
    TickTime: string;
    AskPvs: number[];
    BidPvs: number[];
    AskLots: number[];
    BidLots: number[];
    Lots: number;
}

export interface Ticks {
    SInfo: StockInfo;
    Data: OneTick[];
}
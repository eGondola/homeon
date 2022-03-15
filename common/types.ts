export type Group = {
    name: string;
    token: string;
    plans: SerializedPlan[];
    list: ListItem[];
    home: Pos | null;
    lights: Light[];
};

export type SerializedPlan = {
    start: string;
    end: string;
    text: string;
    weekDays?: boolean[];
};

export type User = {
    login: string;
    email: string;
};

export type Position = {
    login: string;
    position: Pos;
    time: number;
    street: string;
};

type Light = {
    id: number;
    name: string;
    work: boolean;
};

type Pos = {
    x: number;
    y: number;
};

type ListItem = {
    text: string;
    count: number;
    checked: boolean;
};

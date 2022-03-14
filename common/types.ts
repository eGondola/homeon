export type Group = {
    name: string;
    token: string;
    plans: SerializedPlan[];
    list: ListItem[];
    home: pos | null;
};

export type SerializedPlan = {
    start: string;
    end: string;
    text: string;
    weekDays?: boolean[];
};

export type User = {
    login: string,
    email: string
};

export type position = {
    login: string,
    position: pos
    time: number,
    street: string
};
type pos = {
    x: number,
    y: number,
}

type ListItem = {
    text: string;
    count: number;
    checked: boolean;
};

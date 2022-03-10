export type Group = {
    name: string;
    token: string;
    plans: SerializedPlan[];
    list: ListItem[];
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
    position: {
        x: number,
        y: number
    },
    time: number,
    street: string
};

type ListItem = {
    text: string;
    count: number;
};

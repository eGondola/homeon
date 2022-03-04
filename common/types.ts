export type Group = {
    name: string;
    token: string;
    plans: Plan[];
    list: ListItem[];
};

export type Plan = {
    start: string;
    end: string;
    text: string;
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
    }
};

type ListItem = {
    text: string;
    count: number;
};

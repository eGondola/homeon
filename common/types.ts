export type Group = {
    name: string;
    token: string;
    plans: Plan[];
    list: ListItem[];
};

type Plan = {
    start: string;
    end: string;
    text: string;
};

type ListItem = {
    text: string;
    count: number;
};

import express from "express";
import path from "path";
import { connectToDatabase, List, collections } from "./Database";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";

const app = express();
app.use(express.static("frontend/public"));
app.use(bodyParser.text());
app.use(express.json());
app.use(
    cookieSession({
        name: "session",
        keys: ["a"],
    })
);

Main();
async function Main() {
    await connectToDatabase();

    app.post("/api/add-group", (req, res) => {
        const token = nanoid();
        collections.groups?.insertOne({
            name: req.body.name,
            token,
            plans: [],
        });
        collections.users?.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: token } }
        );
    });

    app.get("/api/groups", async (req, res) => {
        const user = await collections.users?.findOne({
            login: req.session?.user.login,
        });
        const groups = await collections.groups
            ?.find({ token: { $in: user?.groups } })
            .toArray();
        res.send(groups);
    });

    app.post("/api/add-plan", (req, res) => {
        collections.groups?.updateOne(
            { token: req.body.token },
            { $push: { plans: req.body.plan } }
        );
    });

    app.get("/group/:token", (req, res) => {
        collections.users?.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: req.params.token } }
        );
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.post("/test", async (req, res) => {
        let list = await collections?.list?.find({}).toArray();
        res.send(list);
    });
    app.post("/updateList", (req, res) => {
        //error
        collections.list?.drop();
        if (JSON.parse(req.body).length > 0)
            collections.list?.insertMany(JSON.parse(req.body));
    });
    app.post("/addToList", async (req, res) => {
        //console.log(req.body);
        let last: any = await collections.list
            ?.find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        last = last[0] ? last[0].id : 0;
        let d = JSON.parse(req.body);
        let obj = { id: last + 1, text: d.text, count: d.count };
        collections.list?.insertOne(obj);
    });

    app.listen(process.env.PORT || 3000);
}

app.get("/api/checkLogin", (req: any, res) => {
    res.send(req.session.user ? req.session.user : {});
});

// authorization
app.post("/register", async (req: any, res) => {
    res.send(await register(req));
});

app.post("/login", async (req: any, res) => {
    res.send(await login(req));
});

app.post("/confirm", async (req: any, res) => {
    res.send(await confirm(req));
});

app.get("/logout", async (req: any, res) => {
    req.session.user = {};
    res.send();
});

async function register(req: any) {
    const [email]: any = await collections.users
        ?.find({ email: req.body.email })
        .toArray();
    if (email) return "Podany adres email został już zarejestrowany";

    const [login]: any = await collections.users
        ?.find({ login: req.body.login })
        .toArray();
    if (login) return "Podany login jest już zajęty";

    const personalGroupToken = nanoid();
    const confirmEmailToken = "r" + nanoid();
    await Promise.all([
        collections.users?.insertOne({
            login: req.body.login,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email,
            confirmEmailToken,
            groups: [personalGroupToken],
        }),
        collections.groups?.insertOne({
            name: "Osobiste",
            token: personalGroupToken,
            plans: [],
        }),
    ]);

    console.log(confirmEmailToken);
    return "Konto zostało utworzone! Dokończ rejestrację klikając w link wysłany na podany adres email";
}

async function confirm(req: any) {
    const confirmEmailToken = req.body.confirmEmailToken;
    const user: any = await collections.users?.findOne({ confirmEmailToken });

    if (user) {
        await collections.users?.updateOne(
            { confirmEmailToken },
            { $unset: { confirmEmailToken: 1 } }
        );

        req.session.user = {
            login: user.login,
            email: user.email,
        };

        return true;
    }

    return false;
}

async function login(req: any) {
    const user: any = await collections.users?.findOne({
        login: req.body.login,
    });
    if (!user) return "Konto o podanym loginie nie istnieje";

    const passwordHash = await bcrypt.compare(req.body.password, user.password);

    if (!passwordHash) return "Niepoprawne hasło";

    if (user.confirmEmailToken)
        return "Dokończ rejestrację klikając w link wysłany na podany adres email";

    req.session.user = {
        login: user.login,
        email: user.email,
    };

    return "";
}

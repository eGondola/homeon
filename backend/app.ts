import express from "express";
import path from "path";
import { getDatabase } from "./database";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";

main();

async function main() {
    const app = express();
    app.use(express.static("frontend/public"));
    app.use(express.text());
    app.use(express.json());
    app.use(
        cookieSession({
            name: "session",
            keys: ["a"],
        })
    );
    const database = await getDatabase();

    app.get("/api/checkLogin", (req, res) => {
        res.send(req.session?.user ?? {});
    });

    // authorization
    app.post("/register", async (req, res) => {
        res.send(await register(req));
    });

    app.post("/login", async (req, res) => {
        res.send(await login(req));
    });

    app.post("/confirm", async (req, res) => {
        res.send(await confirm(req));
    });

    app.get("/logout", async (req, res) => {
        if (req.session) {
            req.session.user = {};
        }
    });

    app.post("/api/add-group", (req, res) => {
        const token = nanoid();
        database.groups.insertOne({
            name: req.body.name,
            token,
            plans: [],
        });
        database.users.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: token } }
        );
    });

    app.get("/api/groups", async (req, res) => {
        const user = await database.users.findOne({
            login: req.session?.user.login,
        });
        const groups = await database.groups
            .find({ token: { $in: user?.groups } })
            .toArray();
        res.send(groups);
    });

    app.post("/api/add-plan", (req, res) => {
        database.groups.updateOne(
            { token: req.body.token },
            { $push: { plans: req.body.plan } }
        );
    });

    app.get("/group/:token", (req, res) => {
        database.users.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: req.params.token } }
        );
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.post("/test", async (req, res) => {
        let list = await database.list.find({}).toArray();
        res.send(list);
    });

    app.post("/updateList", (req, res) => {
        //error
        database.list.drop();
        if (JSON.parse(req.body).length > 0)
            database.list.insertMany(JSON.parse(req.body));
    });

    app.post("/addToList", async (req, res) => {
        let last: any = await database.list
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        last = last[0] ? last[0].id : 0;
        let d = JSON.parse(req.body);
        let obj = { id: last + 1, text: d.text, count: d.count };
        database.list.insertOne(obj);
    });

    app.listen(process.env.PORT || 3000);

    async function register(req: any) {
        const email = await database.users.findOne({ email: req.body.email });
        if (email) return "Podany adres email został już zarejestrowany";

        const login = await database.users.findOne({ login: req.body.login });
        if (login) return "Podany login jest już zajęty";

        const personalGroupToken = nanoid();
        const confirmEmailToken = "r" + nanoid();

        await Promise.all([
            database.users.insertOne({
                login: req.body.login,
                password: await bcrypt.hash(req.body.password, 10),
                email: req.body.email,
                confirmEmailToken,
                groups: [personalGroupToken],
            }),
            database.groups.insertOne({
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
        const user: any = await database.users.findOne({
            confirmEmailToken,
        });

        if (user) {
            await database.users.updateOne(
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
        const user = await database.users.findOne({
            login: req.body.login,
        });
        if (!user) return "Konto o podanym loginie nie istnieje";

        const passwordHash = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordHash) return "Niepoprawne hasło";

        if (user.confirmEmailToken)
            return "Dokończ rejestrację klikając w link wysłany na podany adres email";

        req.session.user = {
            login: user.login,
            email: user.email,
        };

        return "";
    }
}

import express from "express";
import path from "path";
import { getDatabase } from "./database";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

main();

async function main() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on("connection", (socket) => {
        socket.on("newGroup", (newGroup) => {
            socket.rooms.forEach((room) => {
                socket.leave(room);
            });
            socket.join(newGroup?.token);
        });
        socket.on("newPosition", async (obj) => {
            let url = `https://api.opencagedata.com/geocode/v1/json?q=${obj.position.x}+${obj.position.y}&key=6f9855f0d9d04be3b7d02f810a09b3ca`;
            let street = (await axios.get(url)).data.results[0].formatted;
            await database.users.updateOne(
                { login: obj.user.login, email: obj.user.email },
                {
                    $set: {
                        position: obj.position,
                        time: obj.time,
                        street: street,
                    },
                }
            );
            io.to(obj.group.token).emit(
                "position",
                await getPositions(obj.group.token)
            );
        });
        socket.on("getPositions", async (group) => {
            io.to(group.token).emit(
                "position",
                await getPositions(group.token)
            );
        });
    });
    async function getPositions(token: string) {
        interface Position {
            x: number;
            y: number;
        }

        interface Pos {
            login: string;
            position: Position;
            street: string;
            time: number;
        }

        let users = await database.users.find({ groups: token }).toArray();
        let positions: Pos[] = [];
        for (const user of users) {
            positions.push({
                position: user?.position,
                login: user?.login,
                street: user?.street,
                time: user?.time,
            });
        }

        return positions;
    }

    app.use(express.static("frontend/public"));
    app.use(express.text());
    app.use(express.json());
    app.use(
        cookieSession({
            name: "session",
            keys: [process.env.SESSION_SECRET!],
        })
    );
    const database = await getDatabase();

    async function updateRooms(token: string) {
        io.to(token).emit("Group", await database.groups.findOne({ token }));
    }

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

    app.get("/confirm/:token", async (req, res, next) => {
        if (await confirm(req)) {
            next();
        } else {
            res.send("Zły token");
        }
    });

    app.get("/logout", async (req, res) => {
        if (req.session) {
            req.session.user = {};
        }
        res.send();
    });

    app.post("/api/add-group", (req, res) => {
        const token = nanoid();
        database.groups.insertOne({
            name: req.body.name,
            token,
            plans: [],
            list: [],
        });
        database.users.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: token } }
        );
        res.send(token);
    });

    app.post("/api/leave-group", async (req, res) => {
        await database.users.updateOne(
            { login: req.session?.user.login },
            { $pull: { groups: req.body.token } }
        );
        const user = await database.users.findOne({
            groups: req.body.token,
        });
        if (!user) {
            await database.groups.deleteOne({ token: req.body.token });
        }
        res.send();
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
        res.send();
    });

    app.get("/group/:token", (req, res, next) => {
        database.users.updateOne(
            { login: req.session?.user.login },
            { $push: { groups: req.params.token } }
        );
        next();
    });

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.post("/shopping-list", async (req, res) => {
        let group = await database.groups.findOne({ token: req.body.token });
        res.send(group?.list);
    });

    app.post("/updateList", async (req, res) => {
        let [list, group] = JSON.parse(req.body);
        if (JSON.parse(req.body).length > 0)
            await database.groups.updateOne(
                { token: group.token },
                { $set: { list: list } }
            );
        updateRooms(group.token);

        res.send();
    });

    app.post("/api/remove-plan", async (req, res) => {
        let group = await database.groups.findOne({ token: req.body[0] });
        let plans = group?.plans;
        let newPlans: any = [];
        plans?.forEach((plan) => {
            if (plan.text != req.body[1].text) newPlans.push(plan);
        });
        database.groups.updateOne(
            { token: req.body[0] },
            { $set: { plans: newPlans } }
        );
        updateRooms(req.body[0]);
        res.send();
    });

    // lights
    app.post("/add-light", async (req, res) => {
        database.light.updateOne({ name: "check" }, { $set: { check: true } });
        res.send();
    });

    app.post("/check-add-light", async (req, res) => {
        let isset = await database.light.findOne({ name: "check" });
        res.send(isset?.isset);
    });

    app.post("/get-lights", async (req, res) => {
        let lights = await database.light.findOne({ name: "lights" });
        res.send(lights?.lights);
    });

    app.post("/edit-lights", async (req, res) => {
        database.light.updateOne(
            { name: "lights" },
            { $set: { lights: JSON.parse(req.body) } }
        );
        res.send();
    });

    server.listen(process.env.PORT || 3000);

    async function register(req: any) {
        const email = await database.users.findOne({ email: req.body.email });
        if (email) return "Podany adres email został już zarejestrowany";

        const login = await database.users.findOne({ login: req.body.login });
        if (login) return "Podany login jest już zajęty";

        const personalGroupToken = nanoid();
        const confirmEmailToken = nanoid();

        await Promise.all([
            database.users.insertOne({
                login: req.body.login,
                password: await bcrypt.hash(req.body.password, 10),
                email: req.body.email,
                confirmEmailToken,
                groups: [personalGroupToken],
                position: { x: 0, y: 0 },
                time: 0,
                street: "",
            }),
            database.groups.insertOne({
                name: "Osobiste",
                token: personalGroupToken,
                plans: [],
                list: [],
            }),
        ]);

        console.log(confirmEmailToken);
        return "Konto zostało utworzone! Dokończ rejestrację klikając w link wysłany na podany adres email";
    }

    async function confirm(req: any) {
        const confirmEmailToken = req.params.token;
        const user: any = await database.users.findOne({
            confirmEmailToken,
        });

        if (!user) return false;

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

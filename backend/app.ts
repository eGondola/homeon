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
import nodemailer from "nodemailer";
import type { Route, Session } from "./api/make-route";
import addGroup from "route:add-group";

dotenv.config();

main();

async function main() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on("connection", (socket) => {
        socket.on("newGroup", (newGroup) => {
            handleErrors(async () => {
                socket.rooms.forEach((room) => {
                    socket.leave(room);
                });
                socket.join(newGroup?.token);
            });
        });
        socket.on("newPosition", (obj) => {
            handleErrors(async () => {
                //let url = `https://api.opencagedata.com/geocode/v1/json?q=${obj.position.x}+${obj.position.y}&key=6f9855f0d9d04be3b7d02f810a09b3ca`;
                //let street = (await axios.get(url)).data.results[0].formatted;
                let street = "";
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
        });
        socket.on("getPositions", (group) => {
            handleErrors(async () => {
                io.to(group.token).emit(
                    "position",
                    await getPositions(group.token)
                );
            });
        });
        socket.on("setHome", (obj) => {
            handleErrors(async () => {
                await database.groups.updateOne(
                    { token: obj.group.token },
                    { $set: { home: { x: obj.lat, y: obj.lng } } }
                );
            });
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
            keys: [process.env.SESSION_SECRET ?? "secret"],
        })
    );
    const database = await getDatabase();
    if ((await database.lastId.countDocuments()) === 0) {
        await database.lastId.insertOne({ id: 0 });
    }

    async function updateRooms(token: string) {
        io.to(token).emit("Group", await database.groups.findOne({ token }));
    }

    app.get("/api/checkLogin", (req, res) => {
        res.send(req.session?.user ?? {});
    });

    // authorization
    app.post("/register", (req, res) => {
        handleErrors(async () => {
            res.send(await register(req));
        });
    });

    app.post("/login", (req, res) => {
        handleErrors(async () => {
            res.send(await login(req));
        });
    });

    app.get("/confirm/:token", (req, res, next) => {
        handleErrors(async () => {
            await confirm(req);
            next();
        });
    });

    app.get("/logout", (req, res) => {
        if (req.session) {
            req.session.user = {};
        }
        res.send();
    });

    const api = {
        post<Response>(path: string, route: Route<Response>) {
            app.post(`/api/${path}`, ({ body, session }, response) => {
                handleErrors(async () => {
                    response.send(
                        JSON.stringify(
                            await route(body, (session as Session) ?? undefined)
                        )
                    );
                });
            });
        },
    };

    api.post("add-group", addGroup(database));

    app.post("/api/leave-group", (req, res) => {
        handleErrors(async () => {
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
    });

    app.get("/api/groups", (req, res) => {
        handleErrors(async () => {
            const user = await database.users.findOne({
                login: req.session?.user.login,
            });
            const groups = await database.groups
                .find({ token: { $in: user?.groups } })
                .toArray();
            res.send(groups);
        });
    });

    app.post("/api/add-plan", (req, res) => {
        handleErrors(async () => {
            await database.groups.updateOne(
                { token: req.body.token },
                { $push: { plans: req.body.plan } }
            );
            res.send();
        });
    });

    app.get("/group/:token", (req, res, next) => {
        handleErrors(async () => {
            await database.users.updateOne(
                { login: req.session?.user.login },
                { $push: { groups: req.params.token } }
            );
            next();
        });
    });

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.post("/shopping-list", (req, res) => {
        handleErrors(async () => {
            let group = await database.groups.findOne({
                token: req.body.token,
            });
            res.send(group?.list);
        });
    });

    app.post("/updateList", (req, res) => {
        handleErrors(async () => {
            let group = JSON.parse(req.body);
            //group = group.group;
            //if (JSON.parse(req.body).length > 0)
            await database.groups.updateOne(
                { token: group.group.token },
                { $set: { list: group.group.list } }
            );
            await updateRooms(group.token);
            res.send();
        });
    });

    app.post("/api/remove-plan", (req, res) => {
        handleErrors(async () => {
            let group = await database.groups.findOne({ token: req.body[0] });
            let plans = group?.plans;
            let newPlans: any = [];
            plans?.forEach((plan) => {
                if (plan.text != req.body[1].text) newPlans.push(plan);
            });
            await database.groups.updateOne(
                { token: req.body[0] },
                { $set: { plans: newPlans } }
            );
            await updateRooms(req.body[0]);
            res.send();
        });
    });

    // lights
    app.post("/get-lights", (req, res) => {
        handleErrors(async () => {
            const { lights } =
                (await database.groups.findOne({ token: req.body })) ?? {};
            res.send(lights);
        });
    });

    app.post("/api/add-light", (req, res) => {
        handleErrors(async () => {
            const { token } = req.body;
            await database.lastId.updateOne({}, { $inc: { id: 1 } });
            const { id } = (await database.lastId.findOne()) ?? {};
            if (!id) {
                throw new Error("No id");
            }
            io.send("0|SET|" + id);
            await database.groups.updateOne(
                { token },
                {
                    $push: {
                        lights: {
                            id,
                            name: "new",
                            work: false,
                        },
                    },
                }
            );
            res.send();
        });
    });

    app.post("/api/switch-light", (req, res) => {
        handleErrors(async () => {
            const { id, work, token } = req.body;
            io.send(id + "|" + (work ? "ON" : "OFF"));
            await database.groups.updateOne(
                { token, "lights.id": id },
                { $set: { "lights.$.work": work } }
            );
            res.send();
        });
    });

    app.post("/api/remove-light", (req, res) => {
        handleErrors(async () => {
            const { token, id } = req.body;
            io.send(id + "|SET|0");
            await database.groups.updateOne(
                { token },
                { $pull: { lights: { id } } }
            );
            res.send();
        });
    });

    app.post("/api/edit-light", (req, res) => {
        handleErrors(async () => {
            let { id, name, token } = req.body;

            await database.groups.updateOne(
                { token, "lights.id": id },
                { $set: { "lights.$.name": name } }
            );
            res.send();
        });
    });

    server.listen(process.env.PORT || 8080);

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
                home: null,
                lights: [],
            }),
        ]);

        console.log(confirmEmailToken);

        await handleErrors(async () => {
            await nodemailer
                .createTransport({
                    sendmail: true,
                    newline: "unix",
                    path: "/usr/sbin/sendmail",
                })
                .sendMail({
                    from: '"HomeON" Inteligentny@Dom',
                    to: req.body.email,
                    subject: "Rejestracja konta",
                    html: `
<div style="padding: 15px; border-radius: 5px; background-color: #ff7043; color: white; text-align: center">
<img src="https://egondola.eu/homeon.png" width="100" height="100" style="border-radius: 5px"><br>
    <span style="color: white">Home ON</span><br>
    <span style="color: white">Inteligentny Dom</span><br><br>

    <h3>Witaj ${req.body.login}</h3><br><br>

    <h4>Kliknij poniżej, aby dokończyć rejestrację</h4><br>
    <a href="https://egondola.eu/confirm/${confirmEmailToken}"><button style="border: none; padding: 10px 30px; border-radius: 5px; color: white; background-color: #546e7a;">Potwierdź adres email</button></a>
</div>`,
                });
        });

        return "Konto zostało utworzone! Dokończ rejestrację klikając w link wysłany na podany adres email";
    }

    async function confirm(req: any) {
        const confirmEmailToken = req.params.token;
        const user = await database.users.findOne({
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

async function handleErrors(callback: () => Promise<void>) {
    try {
        await callback();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
    }
}

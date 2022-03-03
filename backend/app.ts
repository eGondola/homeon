import express from "express";
import path from "path";
import { getDatabase } from "./database";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";
import http from "http";
import { Server } from "socket.io";

main();

async function main() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    io.on("connection", socket => {
        socket.on("newGroup", newGroup => {
            socket.rooms.forEach(room => {
                socket.leave(room);
            })
            socket.join(newGroup?.token);
        })
        socket.on("newPosition", async obj => {
            await database.users.updateOne({login: obj.user.login, email: obj.user.email}, 
                {$set: {position: obj.position}})
            io.to(obj.group.token).emit("position", await GetPositions(obj.group.token));
        })
        socket.on("getPositions", async group => {
            io.to(group.token).emit("position", await GetPositions(group.token));
        })
    })
    async function GetPositions(token: string)
    {
        interface position {
            x: Number,
            y: Number
        }
        interface pos {
            login: string,
            position: position
        }
        let users = await database.users.find({groups: token}).toArray();
        let positions:pos[] = [];
        users.forEach(user => {
            positions.push({position: user?.position, login: user?.login});
        })
        return positions;
    }
    /*async function GetList(token: string)
    {
        io.to(token).emit("List", )        
    }*/
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

    async function UpdateRooms(token: string)
    {
        io.to(token).emit("Group", await database.groups.findOne({token}))
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
            res.send("beka z ciebie");
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

    app.post("/shopping-list", async (req, res) => {
        //let list = await database.list.find({}).toArray();
        let group = await database.groups.findOne({ token: req.body.token });
        res.send(group?.list);
    });

    app.post("/updateList", async (req, res) => {
        //error
        //database.list.drop();
        let [list, group] = JSON.parse(req.body);
        if (JSON.parse(req.body).length > 0)
            await database.groups.updateOne(
                { token: group.token },
                { $set: { list: list } }
            );
        UpdateRooms(group.token);
        //database.list.insertMany(JSON.parse(req.body));

        res.send();
    });

    app.post("/api/remove-plan", async (req, res) => {
        let group = await database.groups.findOne({token: req.body[0]});
        let plans = group?.plans;
        let newPlans:any = [];
        plans?.forEach(plan => {
            if(plan.text != req.body[1].text)
                newPlans.push(plan)
        })
        database.groups.updateOne({token: req.body[0]}, {$set: {plans: newPlans}})
        UpdateRooms(req.body[0])
        res.send();
    })

    /*app.post("/addToList", async (req, res) => {
        let last: any = await database.list
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        last = last[0] ? last[0].id : 0;
        let d = JSON.parse(req.body);
        let obj = { id: last + 1, text: d.text, count: d.count };
        database.list.insertOne(obj);
    });*/

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
                position: {x: 0, y: 0}
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

import express from "express";
import path from "path";
import { connectToDatabase, List, collections } from './Database';
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";

const app = express();
app.use(express.static("frontend/public"));
app.use(bodyParser.text());
app.use(express.json())
app.use(cookieSession({
    name: 'session',
    keys: ['a'],
}))


Main();
async function Main() 
{
    await connectToDatabase();

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });
    app.post("/test", async (req, res) => {
        let list = await collections?.list?.find({}).toArray();
        res.send(list);
    });
    app.post("/updateList", (req, res) => {//error
        collections.list?.drop();
        if(JSON.parse(req.body).length > 0)
            collections.list?.insertMany(JSON.parse(req.body));
    })
    app.post("/addToList", async (req, res) => {
        //console.log(req.body);
        let last:any = await collections.list?.find({}).sort({_id:-1}).limit(1).toArray();
        last = last[0] ? last[0].id : 0;
        let d = JSON.parse(req.body);
        let obj = {id: last + 1, text: d.text, count: d.count};
        collections.list?.insertOne(obj);
    });
    app.get("/", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });

    app.listen(process.env.PORT || 3000);
}

app.get("/checkLogin", (req: any, res) => {
    res.send(req.session.user ? req.session.user : {})
});



// authorization
app.post("/register", async (req: any, res) => {
    res.send(await register(req))
})

app.post("/login", async (req: any, res) => {
    res.send(await login(req))
})

app.get("/logout", async (req: any, res) => {
    req.session.user = {}
    res.send()
})

async function register(req: any) {
    //const [email]: any = await Find("Users", { email: req.body.email })
    const [email]: any = await collections.users?.find({email: req.body.email});
    if(email) return "Podany adres email został już zarejestrowany"
    
    const [login]: any = await collections.users?.find({login: req.body.login});
    //const [login]: any = await Find("Users", { login: req.body.login })
    if(login) return "Podany login jest już zajęty"
    
    await collections.users?.insertOne({
        login: req.body.login,
        password: await bcrypt.hash(req.body.password, 10),
        email: req.body.email,
        registered: 0,
        hash: nanoid()
    });

    return "Konto zostało utworzone! Dokończ rejestrację klikając w link wysłany na podany adres email"
}

async function login(req: any) {
    const user: any = await collections.users?.findOne({login: req.body.login});
    if(!user) return "Konto o podanym loginie nie istnieje"

    const passwordHash = await bcrypt.compare(req.body.password, user.password)
    
    if(!passwordHash) return "Niepoprawne hasło"

    if(user.confirmEmailToken) return "Dokończ rejestrację klikając w link wysłany na podany adres email"

    req.session.user = {
        login: user.login,
        email: user.email
    }

    return ""
}
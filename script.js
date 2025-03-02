const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const JWT_SECRET = "vjksbdvbvdvbdvbhjksdvbjsdvbh";

const { UserModel, TodoModel } = require("./db");

mongoose.connect("mongodb+srv://ashishpal:Ashish02@cluster0.ksf2z.mongodb.net/ashish-todo-2001");

app.use(express.json());

app.post("/signup", async function(req, res){
    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    await UserModel.create({
        name: name,
        password: password,
        email: email
    })
    res.json({
        messge: "You are logged in!"
    });
});

app.post("/signin", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    });
    if(user){
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token
        });
    }
    else{
        res.status(403).json({
            messge: "Incorrect Credentials!"
        });
    }
});

function auth(req, res, next){
    const token = req.headers.token;
    let decodedInfo = jwt.verify(token, JWT_SECRET);
    if(decodedInfo){
        req.userId = decodedInfo.id;
        next();
    }
    else{
        res.json({
            message:"Incorrect credentials!"
        })
    }
}

app.post("/todo", auth, function(req, res){
    const userId = req.userId;
    const title = req.body.title;

    TodoModel.create({
        title,
        userId
    })
    res.json({
        userId: userId
    });
});

app.get("/todos", auth, async function(req, res){
    const userId = req.userId;
    const todos = await TodoModel.find({
        userId: userId
    })
    res.json({
       todos
    });
});

app.listen(5500);
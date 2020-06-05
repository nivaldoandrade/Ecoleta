import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

app.listen(3333, () => {
    console.log("Server running");
});




































// const users = [
//     "Nivaldo",
//     "Brenda",
//     "Fulano"
// ]


// app.get("/users", (req, res) => {
//     const { search } = req.query;

//     const filterUsers = search ? users.filter( user => user.includes(String(search))) : users;

//     return res.json(filterUsers);
// });

// app.get("/users/:id", (req, res) => {
//     const { id } = req.params;

//     const user = users[Number(id)];

//     return res.json(user);
// })

// app.post("/users", (req, res) => {
//     const data = req.body;

//     const user = {
//         name: data.name,
//         email: data.email
//     };

//     return res.json(user);
// });

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Configurar middleware
app.use(bodyParser.json());
app.use(cookieParser()); // Adicionar middleware para cookies
app.use(cors({
    origin: 'http://localhost', // Permitir requisições do localhost
    credentials: true // Permitir o envio de cookies
}));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: 'lax' } // Ajuste conforme necessário
}));

// Conectar ao banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'econograma'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para login
app.post('/login', (req, res) => {
    const { login, senha } = req.body;

    connection.query(
        'SELECT id, senha FROM usuarios WHERE email = ? OR nome = ?',
        [login, login],
        (err, results) => {
            if (err) {
                res.status(500).json({ status: 'error', message: 'Erro interno do servidor' });
                return;
            }

            if (results.length === 0) {
                res.json({ status: 'error', message: 'Credenciais inválidas' });
                return;
            }

            const usuario = results[0];

            // Compara senhas diretamente (não criptografado)
            if (senha === usuario.senha) {
                req.session.userId = usuario.id; // Armazena o ID do usuário na sessão
                res.json({ status: 'success', id: usuario.id });
            } else {
                res.json({ status: 'error', message: 'Credenciais inválidas' });
            }
        }
    );
});

// Rota para eventos
app.get('/events', (req, res) => {
    if (!req.session.userId) {
        return res.json({ success: false, message: 'Usuário não logado' });
    }

    const user_id = req.session.userId;

    connection.query(
        'SELECT id, title, start, end FROM eventos WHERE user_id = ?',
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Erro interno do servidor' });
                return;
            }
            res.json({ success: true, events: results });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
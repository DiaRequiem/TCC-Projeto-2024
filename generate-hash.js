const bcrypt = require('bcrypt');

const senha = 'aa'; // Substitua com a senha que você deseja gerar o hash
const saltRounds = 10; // Número de "salts" para aumentar a complexidade

bcrypt.hash(senha, saltRounds, (err, hash) => {
    if (err) {
        console.error('Erro ao gerar o hash:', err);
    } else {
        console.log('Hash gerado:', hash);
    }
});

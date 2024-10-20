document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://econograma.infinityfreeapp.com/php/register.php', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        nome: nome,
        email: email,
        senha: senha
      })
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'http://econograma.infinityfreeapp.com/html/abc.html'; 
    } else {
      alert('Erro ao cadastrar!');
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
});

async function fetchData() {
    try {
      const response = await fetch('http://localhost/econograma/api.php');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }
  
  fetchData();
  
let token = null; // Variável para armazenar o token JWT

const sensors = [
  { sensor_id: 1, room: 'Cozinha', countdown: 60, lastTemperature: null },
  { sensor_id: 2, room: 'Sala', countdown: 60, lastTemperature: null },
  { sensor_id: 3, room: 'Quarto', countdown: 60, lastTemperature: null },
  { sensor_id: 4, room: 'Escritório', countdown: 60, lastTemperature: null },
];

// Função para simular a temperatura usando dados históricos de São Paulo
const simulateTemperature = () => {
  const historicalTemperatures = [22, 23, 24, 25, 26, 27, 28, 29, 30]; // Exemplo de temperaturas históricas
  const randomIndex = Math.floor(Math.random() * historicalTemperatures.length);
  return historicalTemperatures[randomIndex]; // Retorna uma temperatura aleatória
};

const simulateHumidity = () => {
  return (Math.random() * 50 + 30).toFixed(2); // Umidade entre 30% e 80%
};

// Função para autenticar e pegar o token JWT
const authenticate = async (sensor) => {
  try {
    const loginResponse = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'monitor',
        password: '123',
      }),
    });

    if (!loginResponse.ok) {
      throw new Error('Falha na autenticação');
    }

    const loginData = await loginResponse.json();
    token = loginData.token; // Armazena o token JWT para ser usado depois
    console.log(`Autenticado sensor ${sensor.sensor_id}, token obtido.`);
  } catch (error) {
    console.error(`Erro ao autenticar o sensor ${sensor.room}:`, error.message);
  }
};

// Função para enviar dados do sensor para o backend
const sendData = async (sensor) => {
  try {
    if (!token) {
      await authenticate(sensor); // Autentica se o token não existir
    }

    const temperatura = simulateTemperature();
    const umidade = simulateHumidity();

    await fetch('http://localhost:3000/dados-sensores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Usa o token no cabeçalho
      },
      body: JSON.stringify({
        sensor_id: sensor.sensor_id,
        temperatura: temperatura,
        umidade: umidade,
      }),
    });

    // Atualiza a última temperatura medida
    sensor.lastTemperature = temperatura;

    // Atualiza a interface
    document.getElementById(`temperatura-${sensor.sensor_id}`).textContent = `${temperatura} °C`;
    console.log(`Dados enviados do sensor ${sensor.room}: Temperatura = ${temperatura}, Umidade = ${umidade}`);
  } catch (error) {
    console.error(`Erro ao enviar dados do sensor ${sensor.room}:`, error.message);
  }
};

// Função para atualizar o contador e enviar dados periodicamente
const updateCountdown = () => {
  sensors.forEach(sensor => {
    const countdownElement = document.getElementById(`countdown-${sensor.sensor_id}`);

    if (sensor.countdown > 0) {
      sensor.countdown--;
      countdownElement.textContent = `Próximo envio automático em ${sensor.countdown} segundos`;
    } else {
      sendData(sensor);
      sensor.countdown = 60;
      countdownElement.textContent = `Próximo envio automático em ${sensor.countdown} segundos`;
    }
  });
};

// Função para enviar dados manualmente ao clicar no botão
const handleSendButtonClick = (sensorId) => {
  const sensor = sensors.find(s => s.sensor_id === sensorId);
  sendData(sensor);
  sensor.countdown = 60;
  document.getElementById(`countdown-${sensor.sensor_id}`).textContent = `Próximo envio automático em ${sensor.countdown} segundos`;
};

setInterval(updateCountdown, 1000); // Atualiza o contador a cada 1 segundo
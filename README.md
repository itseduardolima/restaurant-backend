# 🧠 About

Nome do Projeto: Sistema de Reserva de Mesas de Restaurante

Objetivo: Desenvolver um protótipo de um sistema web para facilitar a reserva de mesas em um restaurante específico, proporcionando aos clientes uma experiência de reserva simplificada e conveniente.

Funcionalidade Principal:

Reserva de Mesas: Os usuários podem visualizar a disponibilidade de mesas em tempo real para a data e horário desejados e selecionar a mesa de sua preferência.

## 🚀 Tecnologias Utilizadas

Frontend: TypeScript, Reactjs <br>
Backend: Node.js, Nestjs <br>
Banco de Dados: Mysql

## 🖥️ Installation

### Backend

1. Clone esse repositório

```bash
git clone https://github.com/itseduardolima/restaurant-backend.git
```

2. Abra a pasta do projeto

```bash
cd restaurant-backend
```

3. Instale a dependências

```bash
npm install
```
ou

```bash
yarn install
```

4. Crie um arquivo .env na raiz do projeto e cole os dados, obs: banco de dados de teste.

```bash
DB_TYPE=mysql
DB_HOST=bm1jcru1prg8zaz9kfqr-mysql.services.clever-cloud.com
DB_PORT=3306
DB_USERNAME=uuscsdi1vlp3efnm
DB_PASSWORD=N8mutLdX3vX3yEffJnfa
DB_DATABASE=bm1jcru1prg8zaz9kfqr

JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=3600s
JWT_REFRESH_TOKEN_SECRET=jwt_refresh_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=5400s
```

5. Execute o projeto

```bash
npm run start:dev
```

### Frontend

2. Acesse o repositório

```bash
https://github.com/itseduardolima/restaurant-frontend
```

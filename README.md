# Backend HeartbeatSecurity

Este projeto é um sistema de backend para o aplicativo HeartbeatSecurity, composto por três servidores principais: Servidor de Autenticação, Servidor de Pacientes e Servidor em Tempo Real.

## Estrutura do Projeto

```
C:\Users\carlos\Desktop\Apis\API'S\
│   AuthServer.js
│   patientServer.js
│   realtimeServer.js
│   package.json
│   package-lock.json
│   .gitignore
```

## Pré-requisitos

- Node.js (versão especificada no package.json)
- Conta MongoDB Atlas (para conexão com o banco de dados)

## Instalação

1. Clone o repositório:
   ```
   git clone <url-do-repositório>
   cd <diretório-do-projeto>
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` no diretório raiz e adicione o seguinte:
   ```
   MONGODB_URI=sua_string_de_conexão_mongodb_atlas
   ```

## Executando os Servidores

O projeto consiste em três servidores separados que precisam ser executados independentemente:

1. Servidor de Autenticação:
   ```
   npm run start:auth
   ```
   Isso iniciará o servidor de autenticação na porta 3001.

2. Servidor de Pacientes:
   ```
   npm run start:patient
   ```
   Isso iniciará o servidor de dados dos pacientes na porta 3002.

3. Servidor em Tempo Real:
   ```
   npm run start:realtime
   ```
   Isso iniciará o servidor em tempo real para sinais vitais nas portas 5000 (TCP) e 5001 (WebSocket).

## Descrição dos Servidores

### Servidor de Autenticação (AuthServer.js)
- Lida com registro e login de usuários
- Executa na porta 3001
- Endpoints:
  - POST /signup: Registra um novo usuário
  - POST /login: Autentica um usuário
  - GET /name/:email: Recupera o nome de um usuário pelo email

### Servidor de Pacientes (patientServer.js)
- Gerencia dados de pacientes e sinais vitais
- Executa na porta 3002
- Endpoints:
  - GET /patients: Recupera todos os pacientes
  - GET /patients/:id: Recupera um paciente específico
  - POST /patients: Cria um novo paciente
  - PUT /patients/:id: Atualiza um paciente
  - DELETE /patients/:id: Exclui um paciente
  - GET /patients/:id/vitalsigns: Obtém sinais vitais de um paciente

### Servidor em Tempo Real (realtimeServer.js)
- Lida com atualizações em tempo real dos sinais vitais dos pacientes
- Servidor TCP executa na porta 5000
- Servidor WebSocket executa na porta 5001

## Banco de Dados

Este projeto usa MongoDB Atlas como banco de dados. A string de conexão está especificada em cada arquivo de servidor.

## Dependências

- express: Framework de aplicação web
- body-parser: Middleware para análise do corpo da requisição
- cors: Middleware para Compartilhamento de Recursos de Origem Cruzada
- mongoose: Ferramenta de modelagem de objetos MongoDB
- socket.io: Motor em tempo real para conexões WebSocket

Para uma lista completa de dependências, consulte o arquivo `package.json`.

## Nota de Segurança

Certifique-se de manter sua string de conexão do MongoDB e outras informações sensíveis seguras. Não cometa o arquivo `.env` para o controle de versão.

## Contribuindo

Por favor, leia o arquivo CONTRIBUTING.md (se disponível) para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## Licença

Este projeto está licenciado sob a [Sua Licença] - veja o arquivo LICENSE.md para detalhes.
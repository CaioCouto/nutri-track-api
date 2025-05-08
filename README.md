# NutriTrack-API

API de gerenciamento para consultório de nutrição da Dra. Rosceli Brás. Sistema responsável pelo processamento de planos alimentares, cadastro de pacientes e monitoramento de exames clínicos.

## Sobre o Projeto

O NutriTrack-API é uma solução de back-end desenvolvida para otimizar a gestão de um consultório de nutrição. O sistema oferece funcionalidades fundamentais para a prática profissional, permitindo a formatação automatizada de planos alimentares e o acompanhamento detalhado de exames clínicos dos pacientes.

Este projeto já inclui os templates utilizados para o frontend, que foi constuído com React, e pode [ser encontrado aqui](https://github.com/CaioCouto/formatador-dieta-web).

## Funcionalidades Principais

### 1. Formatação de Planos Alimentares
- Conversão de arquivos PDF para formato LaTeX personalizado, utilizando IA.
- Padronização automática de documentos nutricionais
- Geração de planos alimentares em layout profissional

### 2. Gestão de Pacientes e Exames
- Cadastro completo de informações de pacientes
- Registro e monitoramento de resultados de exames
- Identificação automatizada de parâmetros alterados em exames
- Visualização simplificada do histórico clínico

## Tecnologias Utilizadas

- Node.js
- Express
- Supabase
- LaTeX

## Instalação

```bash
# Clone o repositório
git clone https://github.com/CaioCouto/nutri-track-api.git

# Entre no diretório do projeto
cd nutri-track-api

# Instale as dependências
npm install

# Inicie o servidor
npm run dev
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
REDIS_URL=
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido para otimizar a prática clínica em nutrição.
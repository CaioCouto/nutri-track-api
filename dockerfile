# Dockerfile.prod
FROM node:22.11

# Atualiza o sistema e instala todas as dependências de LaTeX + build
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    texlive-lang-portuguese \
    latexmk \
    nano \
    git \
    curl \
    build-essential && \
    rm -rf /var/lib/apt/lists/*


# Define o diretório de trabalho
WORKDIR /app

# Copia somente os arquivos necessários para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Compila o TypeScript e move os templates
RUN npm run build

# Define o script como ponto de entrada
CMD ["node", "dist/app.js"]

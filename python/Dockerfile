# Stage 1 : Builder (installe les dépendances)
FROM python:3.11-slim as builder

WORKDIR /app

# 1. Installe les dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget unzip firefox-esr && \
    rm -rf /var/lib/apt/lists/*

# 2. Copie requirements.txt
COPY requirements.txt .

# 3. Crée l'utilisateur appuser
RUN useradd -m appuser

# 4. Installe les dépendances Python en tant qu'appuser
USER appuser
RUN pip install --user -r requirements.txt

# 5. Télécharge et installe GeckoDriver dans /tmp
USER root
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.36.0/geckodriver-v0.36.0-linux64.tar.gz -O /tmp/geckodriver.tar.gz && \
    tar -xvzf /tmp/geckodriver.tar.gz -C /tmp && \
    chmod +x /tmp/geckodriver && \
    rm /tmp/geckodriver.tar.gz

# Stage 2 : Image finale
FROM python:3.11-slim

WORKDIR /app

# Installe les dépendances système minimales
RUN apt-get update && \
    apt-get install -y --no-install-recommends firefox-esr && \
    rm -rf /var/lib/apt/lists/*

# Crée l'utilisateur appuser
RUN useradd -m appuser

# Copie GeckoDriver depuis le stage builder
COPY --from=builder /tmp/geckodriver /usr/local/bin/geckodriver
RUN chmod +x /usr/local/bin/geckodriver && \
    chown appuser:appuser /usr/local/bin/geckodriver

# Copie les dépendances Python installées pour appuser
COPY --from=builder /home/appuser/.local /home/appuser/.local
RUN chown -R appuser:appuser /home/appuser/.local

# Copie le code source
COPY . .

# Définit l'utilisateur et le PATH
USER appuser
ENV PATH="/home/appuser/.local/bin:${PATH}"

CMD ["bash"]
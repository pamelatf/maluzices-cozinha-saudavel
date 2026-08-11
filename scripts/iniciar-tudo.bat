@echo off
REM Sobe a API e o front da Cozinha de Pedidos, cada um na sua janela.
REM MySQL80 ja sobe sozinho com o Windows (startup automatico), entao nao precisa entrar aqui.

start "API - Cozinha Pedidos" cmd /k "cd /d D:\projetos-pessoais\cozinha && npm run dev"

timeout /t 3 /nobreak >nul

start "Web - Cozinha Pedidos" cmd /k "cd /d D:\projetos-pessoais\cozinha\web && npm run dev"

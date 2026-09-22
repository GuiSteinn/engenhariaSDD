# Gerenciador de tarefas — SDD, CI/CD e AWS

Sistema estático para cadastrar, concluir e excluir tarefas. Dados persistem somente no navegador. [Especificação e critérios de aceite](docs/ESPECIFICACAO.md).

## Rodar e verificar localmente

```bash
python3 -m http.server 8080 --directory site
# abrir http://localhost:8080
node --check site/app.js
node tests/smoke.mjs
```

## Pipeline
Push/PR na `main` executa validação e Trivy (vulnerabilidades, configurações e segredos; achados HIGH/CRITICAL bloqueiam). Após sucesso, push na `main` publica os três arquivos em `/var/www/tarefa-sdd` usando um runner GitHub Actions instalado na EC2. PR não publica. O job `deploy` depende de `validate`.

## Preparar AWS EC2 (Ubuntu)

1. Crie uma instância Ubuntu com IP público/Elastic IP. No security group, libere HTTP 80 para `0.0.0.0/0`; SSH 22 somente para seu IP de administração. A AWS pode gerar custos.
2. Conecte-se na EC2 e instale Nginx: `sudo apt update && sudo apt install -y nginx`; crie o diretório: `sudo install -d -m 755 /var/www/tarefa-sdd`.
3. Copie `deploy/nginx.conf` para `/etc/nginx/sites-available/tarefa-sdd`, desabilite o site default, habilite este site e valide:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/tarefa-sdd /etc/nginx/sites-enabled/tarefa-sdd
sudo nginx -t && sudo systemctl reload nginx
```

4. No GitHub, acesse **Settings → Actions → Runners → New self-hosted runner**, escolha Linux x64 e execute na EC2 os comandos exibidos pelo GitHub com um usuário dedicado não root. Na configuração, atribua o label adicional `ec2`; instale e inicie o runner como serviço conforme instruções da mesma tela. Não publique tokens do runner no repositório.
5. Dê posse do diretório ao usuário dedicado do runner (substitua `USUARIO_RUNNER` pelo usuário real): `sudo chown -R USUARIO_RUNNER:www-data /var/www/tarefa-sdd`. O workflow poderá copiar os arquivos sem sudo.

6. Crie o repositório GitHub, envie os arquivos para `main`, acompanhe **Actions**. Após sucesso, abra `http://IP_PUBLICO_DA_EC2/`. Para HTTPS, configure domínio e certificado (por exemplo, Certbot) antes de usar dados reais.

**Observação:** como o job de deploy roda na própria EC2, não é necessário expor SSH para os IPs variáveis dos runners hospedados do GitHub. Proteja a branch principal e restrinja quem pode alterar workflows: código executado pelo runner tem acesso à instância.

## Evidências para a entrega
Capturas da especificação, repositório GitHub com dois colaboradores, execução verde da pipeline com etapa Trivy, EC2 e security group, aplicativo acessível pelo IP público e teste de cadastro/conclusão após recarregar. Inclua link do repositório e URL pública no relatório.

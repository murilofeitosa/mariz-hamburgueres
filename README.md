# 🍔 Mariz Hambúrgueres — Site de cardápio e pedidos

Site estático (HTML + CSS + JavaScript puro, sem dependências) com o cardápio completo da Mariz Hambúrgueres, carrinho e envio do pedido pronto para o WhatsApp.

**Tudo já vem pronto:** as ilustrações dos hambúrgueres são geradas em SVG (arte original, sem imagens externas) e o deploy no GitHub Pages é automático.

## ✨ Recursos

- Cardápio fiel ao original: 12 tradicionais, 5 premium e 6 adicionais
- Alternância de preço entre **Pão bola** e **Pão árabe**
- Ilustração de cada lanche montada de acordo com os ingredientes
- Modal por item: escolha do pão, adicionais, observações e quantidade
- Carrinho salvo no navegador, com envio do pedido formatado para o WhatsApp
- Entrega ou retirada, forma de pagamento e troco
- Indicador "Aberto agora / Fechado" conforme os horários configurados
- Responsivo (celular, tablet e desktop), tema preto e dourado

## 🔧 Antes de publicar (importante!)

Edite **`js/config.js`** e troque os dados de exemplo:

| Campo | O que colocar |
|-------|---------------|
| `whatsapp` | Número real, formato `55` + DDD + número (ex.: `5588912345678`) |
| `whatsappExibicao` | Como o número aparece no site |
| `endereco` / `cidade` / `mapsLink` | Endereço real (deixe `""` para ocultar) |
| `instagram` | Usuário sem `@` (opcional) |
| `horarios` | Dias e horários de funcionamento |
| `taxaEntrega` | Valor fixo ou `0` para "a combinar" |

Para alterar **preços ou itens**, edite `js/data.js`.

## 🚀 Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `mariz-hamburgueres`).
2. Envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Site Mariz Hambúrgueres"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/mariz-hamburgueres.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
4. Pronto: a cada `push` na branch `main` o site é publicado em  
   `https://SEU-USUARIO.github.io/mariz-hamburgueres/`

> Alternativa sem Actions: em **Settings → Pages** escolha *Deploy from a branch* → `main` / `(root)`.

## 📁 Estrutura

```
mariz-hamburgueres/
├── index.html
├── css/style.css
├── js/
│   ├── config.js        ← dados do estabelecimento (EDITE)
│   ├── data.js          ← cardápio e preços
│   ├── burger-art.js    ← gerador das ilustrações SVG
│   └── app.js           ← carrinho, modal, WhatsApp
├── assets/img/          ← logo, favicon, imagens de destaque e og-image
├── tools/build-images.js← regenera as imagens estáticas (opcional)
└── .github/workflows/pages.yml
```

## 🖼️ Regenerar imagens (opcional)

```bash
node tools/build-images.js
```

As imagens em `assets/img/` (SVG) são recriadas. O `og-image.png` (prévia de compartilhamento) e o `apple-touch-icon.png` já estão incluídos.

## 🧪 Testar localmente

Basta abrir o `index.html` no navegador, ou rodar um servidor local:

```bash
python3 -m http.server 8000
```

## 📝 Licença

Uso livre para a Mariz Hambúrgueres.

# 🧮 Sistema Web de Operações Binárias

Este projeto é uma aplicação web desenvolvida em **HTML**, **CSS** e **JavaScript**, que permite realizar **operações binárias** de forma interativa e com **passo a passo detalhado**.  
Ideal para estudantes e entusiastas que desejam compreender como funcionam os cálculos binários.

---

## 🚀 Funcionalidades

O sistema é capaz de realizar as seguintes operações:

- ➕ **Soma binária**
- ➖ **Subtração simples**
- ➖ **Subtração com complemento de dois**
- ✖️ **Multiplicação binária**
- ➗ **Divisão binária**
- 🔁 **Cálculo do complemento de dois**

### Outras características:
- Exibe **o passo a passo da operação** antes do resultado final.  
- Permite **realizar operações com múltiplos números binários** (não apenas dois).  
- Mantém **os zeros à esquerda** no complemento de dois.

---

## 🧠 Como funciona

O sistema utiliza funções JavaScript para:

1. **Validar** se os valores digitados são binários (compostos apenas por `0` e `1`);  
2. **Converter** binários para decimais, executar a operação e converter de volta para binário;  
3. **Gerar o passo a passo** do cálculo para exibição na tela;  
4. **Preservar o comprimento dos números binários**, evitando corte de zeros à esquerda.

---

## 📁 Estrutura do Projeto

```
binario-operacoes/
│
├── index.html          # Página principal da aplicação
├── style.css           # Arquivo de estilos (layout e aparência)
└── script.js           # Código JavaScript com toda a lógica das operações
```

---

## 💻 Como executar

1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/igorsimoes4/operacao-binaria
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd binario-operacoes
   ```
3. Abra o arquivo `index.html` diretamente no seu navegador.

> 💡 Nenhuma instalação adicional é necessária — o sistema roda localmente com JavaScript puro.

---

## 🧩 Exemplo de uso

### 🧮 Exemplo 1 — Soma binária

**Entradas:**
```
1010
0011
```

**Passo a passo:**
```
   1010
+  0011
--------
   1101
```

**Resultado final:**  
```
1101
```

---

### 🔁 Exemplo 2 — Complemento de dois

**Entrada:**
```
00010101
```

**Passo a passo:**
1. Inverta todos os bits → `11101010`  
2. Some 1 → `11101011`  

**Resultado final:**  
```
11101011
```

> 🔹 O sistema mantém todos os zeros à esquerda, preservando o tamanho original.

---

## 🗂️ Tecnologias utilizadas

- **HTML5** → Estrutura da interface  
- **CSS3** → Estilização e layout responsivo  
- **JavaScript (ES6+)** → Lógica das operações binárias  

---

## 🧾 Licença

Este projeto é de código aberto e está sob a licença **MIT**.  
Você pode usar, modificar e distribuir livremente, desde que mantenha os créditos.

---

## 👨‍💻 Autor

**Igor Simões da Silveira**

💡 Se gostou deste projeto, **considere deixar uma estrela no GitHub!** ⭐

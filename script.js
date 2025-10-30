// === Funções auxiliares ===

// Verifica se a string `s` contém apenas caracteres '0' ou '1'
// Retorna true se for binário válido, false caso contrário.
function isBinary(s) {
    return /^[01]+$/.test(s); // usa expressão regular para testar somente 0 e 1 em toda a string
}

// Preenche a string `s` com zeros à esquerda até o tamanho `len`
// Retorna a nova string com padding.
function padLeft(s, len) {
    return s.padStart(len, '0'); // usa String.prototype.padStart para completar com '0'
}

// Remove zeros à esquerda de `s`, mas garante pelo menos '0' como resultado
// Ex.: "00101" -> "101", "0000" -> "0"
function removeLeadingZeros(s) {
    return s.replace(/^0+(?=[01])/, '') || '0';
    // regex: ^0+ remove seqüência inicial de zeros,
    // (?=[01]) garante que não remova tudo se houver apenas zeros;
    // operador || '0' assegura que retornamos '0' em vez de string vazia
}


// === Soma binária ===

// Função que realiza a soma bit a bit entre duas strings binárias `a` e `b`
// Retorna um objeto { steps, result } onde steps é uma lista de strings com o passo a passo
function addBinarySteps(a, b) {
    const steps = []; // array que irá acumular linhas de explicação do passo a passo

    const n = Math.max(a.length, b.length);
    // define n como o tamanho máximo entre os dois operandos (para alinhamento)

    a = padLeft(a, n); // alinha A com zeros à esquerda para ter comprimento n
    b = padLeft(b, n); // alinha B com zeros à esquerda para ter comprimento n

    steps.push(`Alinhando:\n  A = ${a}\n  B = ${b}`);
    // registra no passo a passo os valores alinhados

    let carry = 0; // inicializa o carry (vai/transporta) com 0
    let res = '';  // string que vai guardando o resultado construído do lado esquerdo

    // loop que percorre os bits da direita (LSB) para a esquerda (MSB)
    for (let i = n - 1; i >= 0; i--) {
        const ai = Number(a[i]); // converte o caractere do bit A na posição i para número 0/1
        const bi = Number(b[i]); // converte o caractere do bit B na posição i para número 0/1

        const sum = ai + bi + carry; // soma os dois bits mais o carry atual
        const bit = sum % 2;         // resultado do bit atual (0 ou 1)
        const nextCarry = Math.floor(sum / 2);
        // próximo carry (0 ou 1) obtido dividindo a soma por 2

        res = bit + res; // concatena o bit atual à esquerda do resultado parcial

        // adiciona uma linha explicativa ao passo a passo
        steps.push(`  Bit ${i}: ${ai}+${bi}+carry(${carry})=${sum} → bit=${bit}, novo carry=${nextCarry}`);

        carry = nextCarry; // atualiza carry para a próxima iteração
    }

    // se, ao final do loop, houver um carry restante, adiciona-o à esquerda do resultado
    if (carry) {
        res = carry + res; // adiciona carry como bit mais significativo
        steps.push(`Carry final = ${carry} → adiciona à esquerda`);
    }

    // registra o resultado final sem zeros à esquerda (para exibição mais limpa)
    steps.push(`Resultado: ${removeLeadingZeros(res)}`);

    // retorna o passo a passo e o resultado (com zeros à esquerda removidos para apresentação)
    return { steps, result: removeLeadingZeros(res) };
}


// === Subtração simples ===

// Função que realiza subtração A - B bit a bit usando borrow (empréstimo)
// Retorna { steps, result, negative } onde negative indica se A < B (houve borrow final)
function subBinarySimpleSteps(a, b) {
    const steps = []; // acumula explicações
    const n = Math.max(a.length, b.length); // largura para alinhamento

    a = padLeft(a, n); // alinha A
    b = padLeft(b, n); // alinha B

    steps.push(`A = ${a}\nB = ${b}`); // registra valores alinhados

    let borrow = 0; // flag de empréstimo atual (0 ou 1)
    let res = '';   // resultado em construção

    // percorre de LSB para MSB, aplicando empréstimos quando necessário
    for (let i = n - 1; i >= 0; i--) {
        let ai = Number(a[i]) - borrow; // ajusta o bit de A subtraindo o borrow atual
        const bi = Number(b[i]);        // bit de B atual
        let needBorrow = 0;             // indica se será necessário emprestar neste bit

        // se ai ficou menor que bi, precisamos emprestar (adicionar 2 ao ai)
        if (ai < bi) {
            ai += 2;         // pega emprestado (equivalente a +2 em binário)
            needBorrow = 1;  // marca novo borrow para próxima posição mais significativa
        }

        const diff = ai - bi; // diferença resultante no bit atual
        res = diff + res;     // concatena o bit resultante à esquerda do resultado parcial

        // adiciona explicação do passo atual
        steps.push(`  Bit ${i}: (${a[i]} - borrow ${borrow}) - ${bi} = ${diff}, novo borrow=${needBorrow}`);

        borrow = needBorrow; // atualiza borrow para a próxima iteração
    }

    // se sobrou borrow ao final, significa que A < B (resultado negativo no método de magnitude)
    if (borrow) steps.push('Resultado negativo (houve borrow ao final).');

    // registra resultado final sem zeros à esquerda
    steps.push(`Resultado: ${removeLeadingZeros(res)}`);

    // retorna passos, resultado e flag indicando se foi negativo
    return { steps, result: removeLeadingZeros(res), negative: borrow };
}


// === Complemento de dois (mantendo zeros à esquerda) ===

// Função que calcula o complemento de dois de `a` usando largura `width` (se fornecida)
// Retorna { steps, result } com o passo a passo e o resultado mantendo a largura
function twoComplementSteps(a, width = null) {
    const steps = [];          // array de passos
    if (!width) width = a.length; // se width não passado, usa comprimento da string original

    a = padLeft(a, width);     // garante que `a` tenha exatamente `width` bits
    steps.push(`Número original: ${a}`); // registra valor usado

    let inverted = '';         // string que armazenará a inversão de bits
    // inverte cada bit: '0' -> '1', '1' -> '0'
    for (const bit of a) inverted += bit === '0' ? '1' : '0';
    steps.push(`1) Inversão bit a bit: ${inverted}`); // registra inversão

    // soma +1 ao invertido usando a função de soma (para manter passo a passo)
    const addOne = addBinarySteps(inverted, padLeft('1', inverted.length));
    steps.push('2) Soma +1 ao invertido:');
    // inclui as linhas de passo da operação de soma no próprio passo a passo do complemento
    addOne.steps.forEach(s => steps.push('   ' + s));

    let result = addOne.result; // resultado da soma invertido + 1

    // se o resultado tiver mais bits do que a largura desejada, descarta os bits extras à esquerda (overflow)
    if (result.length > width) {
        result = result.slice(-width); // mantém apenas os `width` menos significativos
        steps.push(`Descartando overflow (mantém ${width} bits): ${result}`);
    } else if (result.length < width) {
        // se resultado tiver menos bits que a largura, completa com zeros à esquerda para manter a largura
        result = padLeft(result, width);
    }

    steps.push(`Complemento de dois: ${result}`); // registra resultado final
    return { steps, result }; // retorna passos e resultado (com largura preservada)
}


// === Subtração com complemento de dois ===

// Subtrai b de a usando complemento de dois: A + (complemento de B)
// Retorna { steps, result } onde result é a diferença (truncada para a largura usada)
function subBinaryByComplementSteps(a, b) {
    const steps = [];
    const width = Math.max(a.length, b.length) + 1;
    // escolhe largura um bit maior que os operandos (para capturar possível carry)

    steps.push(`Usando complemento de dois (largura ${width} bits)`);

    // calcula complemento de dois de b com largura definida
    const comp = twoComplementSteps(b, width);
    steps.push('--- Complemento de B ---');
    comp.steps.forEach(s => steps.push('  ' + s)); // adiciona passos da geração do complemento

    // soma A (com padding) com o complemento de B (com padding) usando addBinarySteps
    const soma = addBinarySteps(padLeft(a, width), padLeft(comp.result, width));
    soma.steps.forEach(s => steps.push('  ' + s)); // inclui passos da soma

    // pega apenas os `width` menos significativos do resultado bruto para representação
    let final = soma.result.slice(-width);
    steps.push(`Truncado (${width} bits): ${final}`);

    // retorna passos e resultado sem zeros à esquerda (apenas para apresentação)
    return { steps, result: removeLeadingZeros(final) };
}


// === Multiplicação ===

// Multiplicação binária por somas parciais (método "coluna")
// Retorna { steps, result } com descrições dos parciais e soma final
function multiplyBinarySteps(a, b) {
    const steps = []; // acumulador de passos

    a = removeLeadingZeros(a); // limpa zeros à esquerda dos operandos para exibir parciais mais limpas
    b = removeLeadingZeros(b);

    steps.push(`Multiplicando ${a} × ${b}`); // registra operação

    const partials = []; // array para armazenar os valores parciais (A shifted)

    // percorre os bits de b do LSB para o MSB e cria parciais (A << shift) quando bit==1
    for (let i = b.length - 1; i >= 0; i--) {
        const bit = b[i];                          // bit atual de B
        const shift = b.length - 1 - i;           // quantidade de deslocamentos (zeros à direita)
        // se o bit for 1, parcial = A seguido de shift zeros; se 0, parcial é zero
        const partial = bit === '1' ? a + '0'.repeat(shift) : '0'.repeat(a.length + shift);
        partials.push(partial);                   // guarda parcial
        steps.push(`  Bit B[${i}] = ${bit} → parcial = ${partial}`); // registra parcial
    }

    let acc = '0'; // acumulador inicial para somar os parciais

    // soma iterativamente todos os parciais usando addBinarySteps (para obter os passos detalhados)
    for (const p of partials) {
        steps.push(`  Soma ${acc} + ${p}`); // registra qual soma está sendo feita
        const s = addBinarySteps(acc, p);   // soma com passo a passo
        s.steps.forEach(ss => steps.push('    ' + ss)); // incorpora os passos da soma
        acc = s.result; // atualiza acumulador com o resultado
    }

    steps.push(`Resultado final: ${acc}`); // registra resultado final da multiplicação
    return { steps, result: removeLeadingZeros(acc) }; // retorna passos e resultado sem zeros à esquerda
}


// === Divisão ===

// Realiza divisão inteira binária (dividendo / divisor) usando algoritmo de divisão longa
// Retorna { steps, result } onde result = { quotient, remainder }
function divideBinarySteps(dividend, divisor) {
    const steps = []; // lista de passos

    // remove zeros à esquerda para simplificar comparações
    dividend = removeLeadingZeros(dividend);
    divisor = removeLeadingZeros(divisor);

    // se divisor for zero, adiciona mensagem de erro e retorna
    if (divisor === '0') {
        steps.push('Erro: divisão por zero.');
        return { steps, result: null };
    }

    let remainder = ''; // resto parcial em construção (string binária)
    let quotient = '';  // quociente construído bit a bit

    // percorre cada bit do dividendo (da esquerda para a direita)
    for (let i = 0; i < dividend.length; i++) {
        remainder += dividend[i];               // "traz" o próximo bit para o resto
        remainder = removeLeadingZeros(remainder); // remove zeros à esquerda do resto
        steps.push(`Trazer bit ${dividend[i]} → resto = ${remainder}`); // registra ação

        // função local para comparar duas strings binárias (retorna 1,0,-1)
        const cmp = (a, b) => {
            a = removeLeadingZeros(a);
            b = removeLeadingZeros(b);
            if (a.length !== b.length) return a.length > b.length ? 1 : -1;
            return a === b ? 0 : a > b ? 1 : -1;
        };

        // se resto >= divisor, subtrai divisor do resto e coloca 1 no quociente
        if (cmp(remainder, divisor) >= 0) {
            const sub = subBinarySimpleSteps(remainder, divisor); // subtrai com passo a passo
            sub.steps.forEach(s => steps.push('  ' + s)); // incorpora os passos da subtração
            remainder = sub.result; // atualiza resto com resultado da subtração
            quotient += '1'; // adiciona 1 ao quociente (bit mais à direita)
            steps.push(`  Subtrai → novo resto=${remainder}, quociente=${quotient}`);
        } else {
            // se resto < divisor, coloca 0 no quociente
            quotient += '0';
            steps.push(`  ${remainder} < ${divisor} → adiciona 0 → quociente=${quotient}`);
        }
    }

    // limpa zeros à esquerda de quociente e resto e registra resultado final
    quotient = removeLeadingZeros(quotient);
    remainder = removeLeadingZeros(remainder);
    steps.push(`Quociente=${quotient}, Resto=${remainder}`);

    // retorna passos e resultado como objeto com quociente e resto
    return { steps, result: { quotient, remainder } };
}


// === Interface ===

// Registra um listener no botão com id 'btnCalcular' que chama a função calcular() quando clicado
document.getElementById('btnCalcular').addEventListener('click', calcular);

// Função utilitária que exibe linhas no elemento com id `id`
// Se `lines` for um array, junta com quebras de linha; caso contrário converte para string
function showLines(id, lines) {
    const el = document.getElementById(id); // obtém elemento DOM
    el.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines);
    // atribui textContent para evitar interpretação HTML
}

// Função principal que lê a entrada, valida, escolhe operação e exibe passos + resultado
function calcular() {
    const texto = document.getElementById('bin1').value.trim(); // lê o campo de texto (entrada dos binários)
    const op = document.getElementById('operacao').value;      // lê a operação selecionada

    // Separa os binários pelo regex: espaços, vírgulas ou ponto e vírgula; filtra strings vazias
    const numeros = texto.split(/[\s,;]+/).filter(n => n.length > 0);

    // se não houver números, exibe erro nas caixas de passos/resultado e retorna
    if (numeros.length === 0) {
        showLines('passos', ['Erro: digite pelo menos um número binário.']);
        showLines('resultado', '');
        return;
    }

    // valida cada número — se algum não for binário válido (contiver outro caractere), exibe erro
    for (const n of numeros) {
        if (!isBinary(n)) {
            showLines('passos', [`Erro: valor inválido "${n}". Use apenas 0 e 1.`]);
            showLines('resultado', '');
            return;
        }
    }

    let steps = [];           // array que irá acumular todas as linhas de passo a passo
    let result = numeros[0];  // resultado inicial é o primeiro número (para operações n-árias)

    // seleciona a operação com base no valor do select
    switch (op) {
        case 'soma':
            steps.push(`=== SOMA DE ${numeros.length} NÚMEROS ===`);
            // para cada número adicional, soma ao acumulador e incorpora passos
            for (let i = 1; i < numeros.length; i++) {
                const opRes = addBinarySteps(result, numeros[i]); // soma result + numeros[i]
                steps.push(`--- Soma ${result} + ${numeros[i]} ---`);
                opRes.steps.forEach(s => steps.push('  ' + s)); // adiciona passos da soma com indentação
                result = opRes.result; // atualiza acumulador com resultado da soma
            }
            break;

        case 'subtracaoSimples':
            steps.push(`=== SUBTRAÇÃO SIMPLES DE ${numeros.length} NÚMEROS ===`);
            // aplica subtração sequencial: ((n0 - n1) - n2) - ...
            for (let i = 1; i < numeros.length; i++) {
                const opRes = subBinarySimpleSteps(result, numeros[i]); // subtrai result - numeros[i]
                steps.push(`--- Subtração ${result} - ${numeros[i]} ---`);
                opRes.steps.forEach(s => steps.push('  ' + s));
                result = opRes.result; // atualiza acumulador
            }
            break;

        case 'subtracaoComplemento2':
            steps.push(`=== SUBTRAÇÃO (COMPLEMENTO DE DOIS) DE ${numeros.length} NÚMEROS ===`);
            // aplica subtração por complemento de dois sequencialmente
            for (let i = 1; i < numeros.length; i++) {
                const opRes = subBinaryByComplementSteps(result, numeros[i]); // realiza result - numeros[i] via comp. de 2
                steps.push(`--- ${result} - ${numeros[i]} ---`);
                opRes.steps.forEach(s => steps.push('  ' + s));
                result = opRes.result; // atualiza acumulador
            }
            break;

        case 'multiplicacao':
            steps.push(`=== MULTIPLICAÇÃO DE ${numeros.length} NÚMEROS ===`);
            // multiplica sequencialmente: ((n0 * n1) * n2) * ...
            for (let i = 1; i < numeros.length; i++) {
                const opRes = multiplyBinarySteps(result, numeros[i]); // multiplica result * numeros[i]
                steps.push(`--- ${result} × ${numeros[i]} ---`);
                opRes.steps.forEach(s => steps.push('  ' + s));
                result = opRes.result;
            }
            break;

        case 'divisao':
            // divisão suportada apenas para exatamente dois operandos (dividendo e divisor)
            if (numeros.length !== 2) {
                showLines('passos', ['A divisão suporta apenas 2 números (dividendo e divisor).']);
                showLines('resultado', '');
                return;
            }
            const divRes = divideBinarySteps(numeros[0], numeros[1]); // realiza divisão
            steps = divRes.steps; // substitui steps pelo passo a passo da divisão
            result = `Quociente=${divRes.result.quotient}, Resto=${divRes.result.remainder}`; // formata resultado
            break;

        case 'complemento2':
            steps.push(`=== COMPLEMENTO DE DOIS PARA CADA NÚMERO ===`);
            let outputs = [];
            // para cada número calcula o complemento de dois preservando largura original
            for (const n of numeros) {
                const opRes = twoComplementSteps(n, n.length); // calcula complemento e passos
                steps.push(`--- ${n} ---`);
                opRes.steps.forEach(s => steps.push('  ' + s)); // adiciona passos detalhados
                outputs.push(`${n} → ${opRes.result}`); // prepara saída resumida
            }
            result = outputs.join(', '); // junta saídas individuais em uma string
            break;

        default:
            // caso a operação não seja reconhecida, informa erro e retorna
            showLines('passos', ['Operação inválida.']);
            showLines('resultado', '');
            return;
    }

    // exibe o passo a passo completo no elemento 'passos'
    showLines('passos', steps);

    // exibe o resultado final (string) no elemento 'resultado'
    showLines('resultado', result);
}

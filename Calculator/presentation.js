function factorial(n) {
    n = BigInt(n);
    let fact = 1n;
    let i = 1n;

    while(i <= n) {
        fact = fact * i;
        i++;
    }
    return fact;
}

function comb(n,k) {
    n = BigInt(n);
    k = BigInt(k);
    let result = 1n;
    result = factorial(n) / factorial(k);
    result = result / factorial(n-k);
    return result;
}

function catalan(n) {
    let nNum = Number(n);

    if(nNum === 0) {
        return 1n;
    }

    let N = BigInt(nNum);
    let twoN = 2n * N;

    return comb(twoN, N) / (N + 1n);
}

function cardiniality(n,p) {
    return catalan(p-1) * catalan(n-p);
}

function rank(n, p) {
    if(n == 1) {
        return 1;
    } else {
        return catalan(n-1) - catalan(n-2);
    } 
}

function compute() {
    const nStr = document.getElementById('n').value;
    const p = 1;
    
    const n = parseInt(nStr, 10);

    //validation steps for p and n.....
    if (isNaN(n) || n < 1) {
        document.getElementById('result').innerHTML =
            `<div class="result-line error">n must be a positive integer. Try again.</div>`;
        return;
    }

    // --- Computations using pre-defined funtions ---
    const card = cardiniality(n, p);
    const rnk = rank(n, p);
    //presentation(n);

    // ---Displaying Result ---
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="result-line"><strong>n = ${n} and fixed point = 1</strong></div>
        <div class="result-line">Cardiniality, |0<sub>${n},${p}</sub>| = ${card.toString()}</div>
        <div class="result-line">The cardiniality of minimal generating set, Rank(0<sub>${n},${p}</sub>) = ${rnk.toString()}</div>
    `;
}

//presentation function starts here
function presentation() {
    const nStr = document.getElementById('n').value;
    const n = parseInt(nStr, 10);

    if (n > 10) {
        document.getElementById('present').innerHTML =
            `<div class="result-line error">Calculations for n>10 are too big to be considered here. Please try a smaller value.</div>`;
        return;
    }

    if(n == 4) {
        document.getElementById('present').innerHTML =
            `<div class="result-line">Deriving from the calculations in the Thesis(See page 81),<br>
            Y<sub>4</sub> = {a, b, c} is the required alphabet set. Then, the presentation for O<sub>4, 1</sub> is:<br>
            {a,b,c} | {ac<sup>2</sup> ~ bc, bc<sup>2</sup> ~ bc, cc<sup>2</sup> ~ bc, aa ~ bc, ab ~ ac, ba ~ bc, bb ~ bc, ca ~ bc, cb ~ ac, cc ~ ac}.
            </div>`;
        return;
    } else {
        document.getElementById('present').innerHTML =
            `<div class="result-line">The code is incomplete. It will start working once completed. Thank you!
            </div>`;
        return;
    }

    
}
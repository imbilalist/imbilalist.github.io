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

//presentation starts here

function generateFunctions(n) {
    if (n < 3) return [];
    let results = [];
    let f = new Array(n).fill(0);
    f[0] = 0;
    f[1] = 1;

    function backtrack(i, hasOne) {
        if (i === n) {
            if (hasOne) results.push([...f]);
            return;
        }
        let prev = f[i-1];
        for (let v = 1; v <= prev; v++) {
            f[i] = v;
            backtrack(i+1, hasOne || (v === 1 && i >= 2));
        }
        if (prev + 1 <= n-1) {
            f[i] = prev + 1;
            backtrack(i+1, hasOne);
        }
    }

    backtrack(2, false);
    return results;
}

/**
 * Computes the result of the binary operation (g + h) based on the provided mathematical rules.
 * @param {Array<number>} g - The first function (as an array of its values).
 * @param {Array<number>} h - The second function (as an array of its values).
 * @param {number} n - The parameter 'n' from the main problem.
 * @returns {Array<number>} - A new array representing the function g+h.
 */
function calculateOperation(g, h, n) {
    const result = new Array(n);
    
    // Rule 1: (g+h)(1) = 0
    result[0] = 0;

    // Rule 2: (g+h)(2) = 1
    result[1] = 1;

    // Rule 3: For x in {3, 4, ..., n}, (g+h)(x) = h(x - g(x)) + g(x) - 1
    for (let x = 3; x <= n; x++) {
        const index = x - 1;
        const x_g = g[index]; // This is g(x)
        
        // Calculate x - g(x)
        const arg_for_h = x - x_g; // The index to use for h
        
        if (arg_for_h < 1) {
            // If argument is less than 1, result is 0
            result[index] = 0; 
        } else {
            // Get h(x - g(x)) using 0-based indexing
            const h_index = arg_for_h - 1;
            if (h_index < h.length) {
                const h_val = h[h_index];
                result[index] = h_val + x_g - 1;
            } else {
                result[index] = 0;
            }
        }
    }
    
    return result;
}

/**
 * Computes the g^ (g hat) function based on the provided mathematical rules.
 * @param {Array<number>} g - The function (as an array of its values).
 * @param {number} n - The parameter 'n' from the main problem.
 * @returns {Array<number>} - A new array representing the function g^.
 */
function calculateGHat(g, n) {
    const result = new Array(n);
    
    // Define f function: f(0) = 1 and f(x) = x for x in {1, 2, ..., n}
    function f(x) {
        if (x === 0) return 1;
        return x;
    }
    
    // Rule 1: g^(1) = 0
    result[0] = 0;
    
    // Rule 2: g^(2) = 1
    result[1] = 1;
    
    // Rule 3: For x in {3, 4, ..., n}, g^(x) = x - 1 - f(f(x - 1 - xg) - 1)
    for (let x = 3; x <= n; x++) {
        const index = x - 1;
        const x_g = g[index]; // This is g(x)
        
        // Calculate x - 1 - xg
        const arg1 = x - 1 - x_g;
        
        // Apply f to arg1
        const f_arg1 = f(arg1);
        
        // Calculate f(f_arg1) - 1
        const arg2 = f(f_arg1) - 1;
        
        // Apply f to arg2
        const f_arg2 = f(arg2);
        
        // Final calculation: x - 1 - f_arg2
        result[index] = x - 1 - f_arg2;
    }
    
    return result;
}

/**
 * Finds the index of a function in a list of functions that matches the target function.
 * @param {Array<Array<number>>} functionList - The list of all functions (e.g., the 'funcs' array).
 * @param {Array<number>} targetFunction - The function array to find.
 * @returns {number|null} - The 1-based index of the matching function (e.g., 'j' for g_j), or null if not found.
 */
function findMatchingFunctionIndex(functionList, targetFunction) {
    for (let i = 0; i < functionList.length; i++) {
        if (arraysEqual(functionList[i], targetFunction)) {
            // Return a 1-based index to match the g_j notation
            return i + 1;
        }
    }
    return null; // No match found
}

/**
 * Helper function to check if two number arrays are identical.
 * @param {Array<number>} arr1 
 * @param {Array<number>} arr2 
 * @returns {boolean}
 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

/**
 * Main function to be called. It takes two indices, computes g+h, finds the matching g_j, and returns j.
 * This function will be used multiple times.
 * @param {number} gIndex - The 1-based index of the first function (e.g., 1 for g_1).
 * @param {number} hIndex - The 1-based index of the second function.
 * @param {Array<Array<number>>} funcs - The list of all functions generated by generateFunctions(n).
 * @param {number} n - The 'n' from the initial problem.
 * @returns {number|string|null} - The index 'j' of the resulting function g_j, or an error message, or null if not found.
 */
function findOperationResult(gIndex, hIndex, funcs, n) {
    // --- 1. Input Validation ---
    if (n < 3) {
        return "The operation is not defined for n < 3.";
    }
    if (gIndex < 1 || hIndex < 1 || gIndex > funcs.length || hIndex > funcs.length) {
        return "Invalid function indices provided.";
    }

    // --- 2. Get the functions from the list ---
    // Adjust for 0-based array indexing
    const g = funcs[gIndex - 1];
    const h = funcs[hIndex - 1];

    // --- 3. Calculate the result of (g + h) ---
    const result_g_plus_h = calculateOperation(g, h, n);

    // --- 4. Find the equivalent function in the list ---
    const j = findMatchingFunctionIndex(funcs, result_g_plus_h);

    // --- 5. Return the result ---
    if (j !== null) {
        return j;
    } else {
        // This case should theoretically not happen if your theory is correct,
        // as the operation should be "closed" (result is always in the set).
        return null; // Return null instead of error message for cleaner handling
    }
}

/**
 * Main function to compute g^ (g hat) and find the matching function index.
 * @param {number} gIndex - The 1-based index of the function.
 * @param {Array<Array<number>>} funcs - The list of all functions.
 * @param {number} n - The parameter 'n'.
 * @returns {number|string} - The index of the matching function or error message.
 */
function findGhatResult(gIndex, funcs, n) {
    if (n < 3) {
        return "The operation is not defined for n < 3.";
    }
    if (gIndex < 1 || gIndex > funcs.length) {
        return "Invalid function index provided.";
    }
    
    const g = funcs[gIndex - 1];
    const result_g_hat = calculateGHat(g, n);
    const j = findMatchingFunctionIndex(funcs, result_g_hat);
    
    if (j !== null) {
        return j;
    } else {
        return null; // Return null instead of error message for cleaner handling
    }
}

/**
 * Generates the semigroup presentation <Y_n | R_1 ∪ R_2>
 * @param {Array<Array<number>>} funcs - The list of all functions.
 * @param {number} n - The parameter 'n'.
 * @returns {Object} - Object containing Y_n, R_1, and R_2
 */
function generateSemigroupPresentation(funcs, n) {
    const rnk = rank(n);
    
    // Generate alphabet set Y_n
    let alphabetSet = [];
    for (let i = 1; i <= rnk; i++) {
        if (i === 1) {
            alphabetSet.push('w'); // g_1 is denoted by 'w'
        } else {
            alphabetSet.push(`g${i}`);
        }
    }
    const Y_n = `{${alphabetSet.join(', ')}}`;
    
    // Generate R_1 = {x_g w^2 ~ x_{g^} w : g ∈ A_n}
    let R1Relations = [];
    for (let i = 1; i <= rnk; i++) {
        const gHatIndex = findGhatResult(i, funcs, n);
        if (gHatIndex !== null) {
            const gSymbol = (i === 1) ? 'w' : `g${i}`;
            const gHatSymbol = (gHatIndex === 1) ? 'w' : `g${gHatIndex}`;
            R1Relations.push(`${gSymbol}w<sup>2</sup> ~ ${gHatSymbol}w`);
        }
    }
    const R1 = `{${R1Relations.join(', ')}}`;
    
    // Generate R_2 = {x_g x_h ~ x_{g+h} w : g, h ∈ A_n}
    let R2Relations = [];
    for (let i = 1; i <= rnk; i++) {
        for (let j = 1; j <= rnk; j++) {
            const sumIndex = findOperationResult(i, j, funcs, n);
            if (sumIndex !== null) {
                const gSymbol = (i === 1) ? 'w' : `g${i}`;
                const hSymbol = (j === 1) ? 'w' : `g${j}`;
                const sumSymbol = (sumIndex === 1) ? 'w' : `g${sumIndex}`;
                R2Relations.push(`${gSymbol}${hSymbol} ~ ${sumSymbol}w`);
            }
        }
    }
    const R2 = `{${R2Relations.join(', ')}}`;
    
    // Return the components
    return { Y_n, R1, R2 };
}

function presentation() {
    const nStr = document.getElementById('n').value;
    const n = parseInt(nStr, 10);

    if (n > 10) {
        document.getElementById('present').innerHTML =
            `<div class="result-line error">Calculations for n>10 are too big to be considered here. Please try a smaller value.</div>`;
        return;
    }

    // Removed the special case for n=4
    
    let rnk = rank(n);
    let funcs = generateFunctions(n);
    if (funcs.length === 0) {
        document.getElementById('present').innerHTML =
            `<div class="result-line">No functions generated for n = ${n}. Try a different value.</div>`;
    } else {
        let resultContent = `<div class="result-line">A<sub>${n}</sub> = {g<sub>1</sub>, g<sub>2</sub>, ..., g<sub>${rnk.toString()}</sub>} ; where g<sub>i</sub>'s are defined as:</div>`;
        funcs.forEach((g, idx) => {
            let str = g.map((val, i) => `${i+1}g = ${val}`).join(",");
            resultContent += `<div class="result-line">  g<sub>${idx+1}</sub>: ${str}</div>`;
        });

        // Add note about g_1 being denoted by 'w'
        resultContent += `<div class="result-line"><strong>Note:</strong> g<sub>1</sub> is denoted by 'w' in the presentation.</div>`;
        
        // Generate and add the semigroup presentation components
        const presentationData = generateSemigroupPresentation(funcs, n);
        resultContent += `<div class="result-line">Y<sub>${n}</sub> = ${presentationData.Y_n}</div>`;
        resultContent += `<div class="result-line">R<sub>1</sub> = ${presentationData.R1}</div>`;
        resultContent += `<div class="result-line">R<sub>2</sub> = ${presentationData.R2}</div>`;
        resultContent += `<div class="result-line">The required semigroup presentation is &lt;Y<sub>${n}</sub> | R<sub>1</sub> &cup; R<sub>2</sub>&gt; where Y<sub>${n}</sub>, R<sub>1</sub>, R<sub>2</sub> are given as above.</div>`;

        // After processing all functions and storing their results in `resultContent`
        document.getElementById('present').innerHTML = resultContent + `
            <div class="result-line">That is, the alphabet set is Y<sub>${n}</sub> = {w, g<sub>2</sub>, ..., g<sub>${rnk.toString()}</sub>}</div>
        `;
    }
}

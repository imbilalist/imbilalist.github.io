def generate_functions(n):
    """
    Generate all functions f: {1,...,n} -> {0,...,n-1} satisfying:
    - f(1) = 0
    - f(x) >= 1 for x = 2,...,n
    - ∃ l ∈ {3,...,n} such that f(l) = 1
    - For all x = 1,...,n-1: f(x+1) ≤ f(x) or f(x+1) = f(x)+1
    """
    if n < 3:
        return []          # need at least n=3 to have l in {3,...,n}
    results = []
    f = [0] * n            # f[i] corresponds to x = i+1
    f[0] = 0               # f(1)=0
    f[1] = 1               # forced by the condition at x=1 and f(2)≥1

    def backtrack(i, has_one):
        """i is current index to assign (0‑based), start at i=2 (x=3)."""
        if i == n:
            if has_one:
                results.append(f.copy())
            return
        prev = f[i-1]
        # all values from 1 to prev are allowed
        for v in range(1, prev + 1):
            f[i] = v
            new_one = has_one or (v == 1 and i >= 2)   # i>=2 → x≥3
            backtrack(i + 1, new_one)
        # also the value prev+1 if it does not exceed n-1
        if prev + 1 <= n - 1:
            f[i] = prev + 1
            # prev+1 can never be 1 (since prev≥1), so has_one unchanged
            backtrack(i + 1, has_one)

    backtrack(2, False)    # start at index 2, no 1 seen yet among x≥3
    return results


# Example usage
n = int(input("Enter n: "))
funcs = generate_functions(n)
print(f"Number of functions: {len(funcs)}")
for func in funcs:
    print(func)

import math


def main():
    n = get_n()
    p = get_p()
    if p > n:
        print('p cannot be greater than n')

    else:
        cardinality(n, p)
        rank(n, p)


def get_n():
    # Making sure that the user enters a valid positive integer for n
    while True:
        n = int(input('Enter the value of n:'))
        if n > 0:
            break

    return n


def get_p():
    # Making sure that the user enters a valid positive integer for fixed point p
    while True:
        p = int(input('Enter the value of fixed point p:'))
        if p > 0:
            break

    return p


# calculating the cardinality
def cardinality(n, p):
    print(f"|O_{n},{p}| =", catalan(p-1) * catalan(n-p))


# calculating rank of finite transformation semigroup with one fixed point p
def rank(n, p):
    # Special case: n=p=1
    if n == p == 1:
        print('Rank(O_1,1) = 1')

    # Special case when p=1 or p=n
    elif p == 1 or p == n:
        r = catalan(n-1) - catalan(n-2)
        print(f"Rank(O_{n},{p}) = {r}")

    # case when p=2 or p =n-1.
    # Although it can be easily seen from general case but, I'm going to proceed in chronological
    # order of my Dissertation/Thesis
    elif p == 2 or p == n-1:
        r = catalan(n-2) - catalan(n-3)
        print(f"Rank(O_{n},{p}) = {r}")

    # General case
    else:
        r = catalan(p-1) * catalan(n-p) - catalan(p-2) * catalan(n-p-1)
        print(f"Rank(O_{n},{p}) = {r}")


# nth-catalan number C_n
def catalan(n):
    if n == 0:
        return 1
    else:
        c = math.comb(2 * n, n)
        n = n + 1
        return c / n


main()

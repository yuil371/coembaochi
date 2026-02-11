'''c7 d7 e7
b6 c6 d6 e6 f6
b5 c5 d5 e5 f5
c4 d4 e4
d3
d2'''
a = list("Tylno")
b = list("acHTT")
c = list("nepon")

a.reverse()
b.reverse()
c.reverse()

result = []
result.append("".join(a))
result.append("".join(b))
result.append("".join(c))

print("".join(result))

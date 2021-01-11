with open("lookup_table.txt", 'r') as fh:
    alphabet = fh.readline().strip()
    key = fh.readline().strip()

password_ct = "LVEdQPpBwr"
password = ""
for n in range(len(password_ct)):
    positional_alphabet = key[n%8::8]
    index = positional_alphabet.index(password_ct[n])
    password += alphabet[8 * index + n%8]
print(password)

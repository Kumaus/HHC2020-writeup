from naughty_nice import *

with open('official_public.pem', 'rb') as fh:
    official_public_key = RSA.importKey(fh.read())
c2 = Chain(load=True, filename='blockchain.dat')

# Find Jack's altered block
sha256 = "58a3b9335a6ceb0234c12d35a0564c4ef0e90152d0eb2ce2082383b38028a90f"
starting_index = c2.blocks[0].index
for block in c2.blocks:
    hash_obj = SHA256.new()
    hash_obj.update(block.block_data_signed())
    if hash_obj.hexdigest() == sha256:
        chain_index = block.index - starting_index
        print(f"Jacks altered block: position {chain_index} in chain")
        print(block)
        c2.save_a_block(chain_index, "Jacks_block")
        for n in range(block.doc_count):
            block.dump_doc(n+1)


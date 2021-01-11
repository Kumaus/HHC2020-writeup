from naughty_nice import *
from mt19937predictor import MT19937Predictor

c2 = Chain(load=True, filename='blockchain.dat')

predictor = MT19937Predictor()
for i in range(len(c2.blocks)):
    nonce = c2.blocks[i].nonce
    if i < 312:
        # seeding
        predictor.setrandbits(nonce, 64)
    else:
        # verification
        predicted_nonce = predictor.getrandbits(64)
        if nonce != predicted_nonce:
            print(c2.blocks[i].index, hex(nonce), hex(predicted_nonce))

# prediction of future nonces
for future_index in range(1,5):
    print(c2.blocks[-1].index + future_index, hex(predictor.getrandbits(64)))
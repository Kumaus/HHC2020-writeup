from mt19937predictor import MT19937Predictor

predictor = MT19937Predictor()

with open("seeds.txt", "r") as fh:
    seeds_raw = fh.readlines()
seeds = [int(s.split()[0]) for s in seeds_raw]

print("Number of seeds:", len(seeds))
for s in seeds:
    predictor.setrand_int32(s)

print("Next seed:", predictor.genrand_int32())
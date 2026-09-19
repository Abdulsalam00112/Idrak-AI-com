import json, subprocess, sys

def run(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(result.stdout)

out = {}

# JAMB: Math 35, English 35, Physics 30 (physics = facts bank, 30 items)
jamb = []
jamb += run(["python3", "math_gen.py", "35", "JAMB", "Mathematics"])
jamb += run(["python3", "english_gen.py", "35", "JAMB", "English Language", "101"])
sys.path.insert(0, '.')
from facts_engine import bank_to_questions
from bank_physics import BANK as PHYSICS_BANK
phys_q, short = bank_to_questions(PHYSICS_BANK, "JAMB", "Physics", 30, seed=201)
jamb += phys_q
out["jamb"] = jamb

# WAEC: Math 35, Biology 35, Chemistry 30
waec = []
waec += run(["python3", "math_gen.py", "35", "WAEC", "Mathematics"])
from bank_biology import BANK as BIO_BANK
bio_q, _ = bank_to_questions(BIO_BANK, "WAEC", "Biology", 35, seed=301)
waec += bio_q
from bank_chemistry import BANK as CHEM_BANK
chem_q, _ = bank_to_questions(CHEM_BANK, "WAEC", "Chemistry", 30, seed=401)
waec += chem_q
out["waec"] = waec

# NECO: Economics 35, Government 35, Math 30
neco = []
from bank_economics import BANK as ECON_BANK
econ_q, _ = bank_to_questions(ECON_BANK, "NECO", "Economics", 35, seed=501)
neco += econ_q
from bank_government import BANK as GOV_BANK
gov_q, _ = bank_to_questions(GOV_BANK, "NECO", "Government", 35, seed=601)
neco += gov_q
neco += run(["python3", "math_gen.py", "30", "NECO", "Mathematics"])
out["neco"] = neco

# POST-UTME: Use of English 50, Math 50
postutme = []
postutme += run(["python3", "english_gen.py", "50", "POST-UTME", "Use of English", "701"])
postutme += run(["python3", "math_gen.py", "50", "POST-UTME", "Mathematics"])
out["postutme"] = postutme

# SAT: Math 50, Reading and Writing 50 (vocab-based)
sat = []
sat += run(["python3", "math_gen.py", "50", "SAT", "Math"])
sat += run(["python3", "english_gen.py", "50", "SAT", "Reading and Writing", "801"])
out["sat"] = sat

# IELTS: Reading, Listening, Writing, Speaking (best-effort volumes)
ielts = []
for kind, subj, seed in [("reading","Reading",901),("listening","Listening",902),("writing","Writing",903),("speaking","Speaking",904)]:
    ielts += run(["python3", "ielts_gen.py", kind, "IELTS", subj, str(seed)])
out["ielts"] = ielts

# ICAN: Financial Accounting 34 (facts+numeric), Business Law 33, Taxation 33
ican = []
from bank_accounting import BANK as ACC_BANK
acc_facts, _ = bank_to_questions(ACC_BANK, "ICAN", "Financial Accounting (Foundation)", 18, seed=1001)
ican += acc_facts
ican += run(["python3", "accounting_numeric.py", "16", "ICAN", "Financial Accounting (Foundation)"])
from bank_business_law import BANK as LAW_BANK
law_q, _ = bank_to_questions(LAW_BANK, "ICAN", "Corporate and Business Law (Foundation)", 33, seed=1101)
ican += law_q
from bank_taxation import BANK as TAX_BANK
tax_q, _ = bank_to_questions(TAX_BANK, "ICAN", "Taxation (Skills)", 33, seed=1201)
ican += tax_q
out["ican"] = ican

# CITN: Taxation 34, Financial Accounting 33, Business Law 33
citn = []
tax_q2, _ = bank_to_questions(TAX_BANK, "CITN", "Principles and Practice of Taxation", 34, seed=1301)
citn += tax_q2
acc_facts2, _ = bank_to_questions(ACC_BANK, "CITN", "Financial Accounting", 18, seed=1401)
citn += acc_facts2
citn += run(["python3", "accounting_numeric.py", "15", "CITN", "Financial Accounting"])
law_q2, _ = bank_to_questions(LAW_BANK, "CITN", "Business Law", 33, seed=1501)
citn += law_q2
out["citn"] = citn

for name, questions in out.items():
    path = f"../{name}.json"
    with open(path, "w") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"{name}: {len(questions)} questions written to {path}")

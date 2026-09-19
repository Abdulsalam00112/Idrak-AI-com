import random, json, sys
random.seed(7)

def opts(correct, wrongs, labels="ABCD"):
    vals = [correct] + wrongs
    random.shuffle(vals)
    return [{"id": labels[i], "text": str(vals[i])} for i in range(len(vals))], labels[vals.index(correct)]

def fmt(n):
    if isinstance(n, float):
        if n == int(n): return f"{int(n):,}"
        return f"{n:,.2f}"
    return f"{n:,}"

def q_straight_line_dep():
    cost = random.choice([100000,150000,200000,250000,300000,400000,500000])
    salvage = random.choice([0,10000,20000,50000])
    life = random.choice([4,5,8,10])
    dep = (cost-salvage)/life
    wrongs = [fmt(cost/life), fmt(dep+salvage), fmt(dep*2)]
    options, ans = opts(fmt(dep), wrongs)
    return {"text": f"An asset costing ₦{fmt(cost)} with an estimated salvage value of ₦{fmt(salvage)} has a useful life of {life} years. Using the straight-line method, calculate the annual depreciation charge.",
            "options": options, "answer": ans,
            "explanation": f"Annual depreciation = (Cost − Salvage value) ÷ Useful life = (₦{fmt(cost)} − ₦{fmt(salvage)}) ÷ {life} = ₦{fmt(dep)}.",
            "difficulty": "medium", "tags": ["depreciation","straight-line"]}

def q_accounting_equation():
    assets = random.choice([500000,750000,1000000,1250000,1500000,2000000])
    liabilities = random.choice([100000,150000,200000,300000,400000])
    capital = assets - liabilities
    wrongs = [fmt(assets+liabilities), fmt(liabilities-assets) if liabilities>assets else fmt(assets*2-liabilities), fmt(assets)]
    options, ans = opts(fmt(capital), wrongs)
    return {"text": f"A business has total assets of ₦{fmt(assets)} and total liabilities of ₦{fmt(liabilities)}. Calculate the owner's capital.",
            "options": options, "answer": ans,
            "explanation": f"Capital = Assets − Liabilities = ₦{fmt(assets)} − ₦{fmt(liabilities)} = ₦{fmt(capital)}.",
            "difficulty": "easy", "tags": ["accounting-equation"]}

def q_vat_amount():
    price = random.choice([10000,20000,50000,80000,100000,150000,200000])
    rate = 7.5
    vat = price*rate/100
    total = price+vat
    wrongs = [fmt(price*0.05), fmt(price*0.10), fmt(total+vat)]
    options, ans = opts(fmt(vat), wrongs)
    return {"text": f"Goods are sold for ₦{fmt(price)} before VAT. If VAT is charged at 7.5%, calculate the VAT amount.",
            "options": options, "answer": ans,
            "explanation": f"VAT = 7.5% × ₦{fmt(price)} = ₦{fmt(vat)}.",
            "difficulty": "easy", "tags": ["vat","computation"]}

def q_gross_profit():
    sales = random.choice([500000,800000,1000000,1200000,1500000,2000000])
    cogs = random.choice([300000,400000,500000,600000,700000,900000])
    if cogs >= sales: cogs = sales - 100000
    gp = sales - cogs
    wrongs = [fmt(sales+cogs), fmt(cogs), fmt(gp+cogs*0.1)]
    options, ans = opts(fmt(gp), wrongs)
    return {"text": f"A business had sales of ₦{fmt(sales)} and cost of goods sold of ₦{fmt(cogs)}. Calculate the gross profit.",
            "options": options, "answer": ans,
            "explanation": f"Gross profit = Sales − Cost of goods sold = ₦{fmt(sales)} − ₦{fmt(cogs)} = ₦{fmt(gp)}.",
            "difficulty": "easy", "tags": ["gross-profit"]}

def q_net_profit():
    gp = random.choice([200000,300000,400000,500000,600000])
    expenses = random.choice([50000,80000,100000,120000,150000])
    np_ = gp - expenses
    wrongs = [fmt(gp+expenses), fmt(expenses), fmt(np_+expenses*0.5)]
    options, ans = opts(fmt(np_), wrongs)
    return {"text": f"A business has gross profit of ₦{fmt(gp)} and total operating expenses of ₦{fmt(expenses)}. Calculate the net profit.",
            "options": options, "answer": ans,
            "explanation": f"Net profit = Gross profit − Operating expenses = ₦{fmt(gp)} − ₦{fmt(expenses)} = ₦{fmt(np_)}.",
            "difficulty": "easy", "tags": ["net-profit"]}

GENERATORS = [q_straight_line_dep, q_accounting_equation, q_vat_amount, q_gross_profit, q_net_profit]

def generate(n, exam_code, subject_name):
    out = []
    seen = set()
    tries = 0
    while len(out) < n and tries < n*20:
        tries += 1
        gen = random.choice(GENERATORS)
        q = gen()
        if q["text"] in seen: continue
        seen.add(q["text"])
        out.append({
            "examCode": exam_code, "subjectName": subject_name, "questionText": q["text"],
            "options": q["options"], "correctAnswer": q["answer"], "explanation": q["explanation"],
            "explanationSource": "idrak_generated", "difficulty": q["difficulty"],
            "contentType": "generated", "isHighYield": False, "tags": q["tags"],
        })
    return out

if __name__ == "__main__":
    n = int(sys.argv[1]); exam = sys.argv[2]; subject = sys.argv[3]
    print(json.dumps(generate(n, exam, subject)))

"""Generates correctness-verified math questions (answer computed by code, not typed)."""
import json, random, sys

random.seed(42)

def opts(correct, wrongs, labels="ABCD"):
    vals = [correct] + wrongs
    random.shuffle(vals)
    return [{"id": labels[i], "text": str(vals[i])} for i in range(len(vals))], labels[vals.index(correct)]

def fmt(n):
    if isinstance(n, float):
        if n == int(n): return str(int(n))
        return f"{n:.2f}".rstrip('0').rstrip('.')
    return str(n)

def q_simple_interest():
    p = random.choice([10000,15000,20000,25000,30000,40000,50000,60000])
    r = random.choice([2,3,4,5,6,8,10])
    t = random.choice([1,2,3,4,5])
    si = p*r*t/100
    wrongs = [si+p*r/100, si-p*r/100 if si-p*r/100>0 else si+2*p*r/100, si*2]
    options, ans = opts(fmt(si), [fmt(w) for w in wrongs])
    return {"text": f"Find the simple interest on ₦{p:,} for {t} year{'s' if t>1 else ''} at {r}% per annum.",
            "options": options, "answer": ans,
            "explanation": f"Simple Interest = (P × R × T) / 100 = ({p} × {r} × {t}) / 100 = ₦{fmt(si)}.",
            "difficulty": "easy", "tags": ["commercial-maths","simple-interest"]}

def q_simultaneous():
    x = random.randint(2,12); y = random.randint(1,10)
    a1,b1 = 1,1; c1 = x+y
    a2,b2 = 1,-1; c2 = x-y
    wrongs = [f"x = {x+1}, y = {y}", f"x = {x}, y = {y+1}", f"x = {y}, y = {x}"]
    correct = f"x = {x}, y = {y}"
    options, ans = opts(correct, wrongs)
    return {"text": f"Solve the simultaneous equations: x + y = {c1} and x − y = {c2}.",
            "options": options, "answer": ans,
            "explanation": f"Adding both equations: 2x = {c1+c2}, so x = {x}. Substituting: {x} + y = {c1}, so y = {y}.",
            "difficulty": "medium", "tags": ["algebra","simultaneous-equations"]}

def q_percentage_profit():
    cost = random.choice([500,800,1000,1200,1500,2000,2500,3000,4000,5000])
    pct = random.choice([10,15,20,25,30,40,50])
    profit = cost*pct/100
    sale = cost+profit
    wrongs = [fmt(cost+profit*1.5), fmt(cost+profit*0.5), fmt(sale+cost*0.1)]
    options, ans = opts(fmt(sale), wrongs)
    return {"text": f"A trader bought an item for ₦{cost:,} and wants to make a profit of {pct}%. At what price should the item be sold?",
            "options": options, "answer": ans,
            "explanation": f"Profit = {pct}% of ₦{cost} = ₦{fmt(profit)}. Selling price = ₦{cost} + ₦{fmt(profit)} = ₦{fmt(sale)}.",
            "difficulty": "easy", "tags": ["commercial-maths","percentages"]}

def q_ratio_simplify():
    base_pairs = [(2,3),(3,4),(3,5),(4,5),(2,5),(5,6),(1,2),(3,7)]
    a,b = random.choice(base_pairs)
    m = random.choice([2,3,4,5])
    x,y = a*m, b*m
    wrongs = [f"{a+1}:{b}", f"{a}:{b+1}", f"{x}:{y}"]
    correct = f"{a}:{b}"
    options, ans = opts(correct, wrongs)
    return {"text": f"Simplify the ratio {x}:{y} to its lowest terms.",
            "options": options, "answer": ans,
            "explanation": f"The HCF of {x} and {y} is {m}. Dividing both terms by {m}: {x}÷{m} : {y}÷{m} = {a}:{b}.",
            "difficulty": "easy", "tags": ["ratios"]}

def q_pythagoras():
    triples = [(3,4,5),(6,8,10),(5,12,13),(9,12,15),(8,15,17),(7,24,25),(12,16,20),(10,24,26)]
    a,b,c = random.choice(triples)
    wrongs = [c+1, c-1, a+b]
    options, ans = opts(c, wrongs)
    return {"text": f"A right-angled triangle has legs {a}cm and {b}cm. Find the length of the hypotenuse.",
            "options": options, "answer": ans,
            "explanation": f"By Pythagoras' theorem: hypotenuse² = {a}² + {b}² = {a*a} + {b*b} = {c*c}, so hypotenuse = {c}cm.",
            "difficulty": "medium", "tags": ["geometry","pythagoras"]}

def q_area_rectangle():
    l = random.randint(4,20); w = random.randint(2,l-1)
    area = l*w
    wrongs = [2*(l+w), l+w, area+w]
    options, ans = opts(area, list(set(wrongs)) if len(set(wrongs))==3 else [area+2,area-2,area+w])
    return {"text": f"Find the area of a rectangle with length {l}cm and width {w}cm.",
            "options": options, "answer": ans,
            "explanation": f"Area of a rectangle = length × width = {l} × {w} = {area}cm².",
            "difficulty": "easy", "tags": ["mensuration"]}

def q_linear_eq():
    x = random.randint(2,15)
    a = random.randint(2,6)
    b = random.randint(1,20)
    c = a*x+b
    wrongs = [x+1, x-1, x+2]
    options, ans = opts(x, wrongs)
    return {"text": f"If {a}x + {b} = {c}, find the value of x.",
            "options": options, "answer": ans,
            "explanation": f"{a}x = {c} − {b} = {c-b}, so x = {c-b} ÷ {a} = {x}.",
            "difficulty": "easy", "tags": ["algebra"]}

def q_speed_distance():
    speed = random.choice([40,50,60,70,80,90,100])
    time = random.choice([1,2,3,4,5])
    dist = speed*time
    wrongs = [dist+speed, dist-speed if dist-speed>0 else dist+speed*2, speed+time]
    options, ans = opts(dist, wrongs)
    return {"text": f"A car travels at a constant speed of {speed}km/h for {time} hours. How far does it travel?",
            "options": options, "answer": ans,
            "explanation": f"Distance = Speed × Time = {speed} × {time} = {dist}km.",
            "difficulty": "easy", "tags": ["speed-distance-time"]}

def q_average():
    nums = [random.randint(10,90) for _ in range(4)]
    avg = sum(nums)/len(nums)
    wrongs = [avg+5, avg-5, sum(nums)]
    options, ans = opts(fmt(avg), [fmt(w) for w in wrongs])
    return {"text": f"Find the average of the numbers {', '.join(map(str,nums))}.",
            "options": options, "answer": ans,
            "explanation": f"Average = sum of numbers ÷ count = {sum(nums)} ÷ {len(nums)} = {fmt(avg)}.",
            "difficulty": "easy", "tags": ["averages"]}

def q_hcf_lcm(kind):
    pairs = [(12,18),(8,12),(15,20),(16,24),(9,15),(10,25),(14,21),(18,24)]
    a,b = random.choice(pairs)
    import math
    hcf = math.gcd(a,b)
    lcm = a*b//hcf
    if kind=="hcf":
        wrongs = [hcf+1, hcf*2, a]
        options, ans = opts(hcf, wrongs)
        text = f"Find the Highest Common Factor (HCF) of {a} and {b}."
        expl = f"The HCF of {a} and {b} is {hcf}."
    else:
        wrongs = [lcm+a, lcm-b if lcm-b>0 else lcm+b, a*b]
        options, ans = opts(lcm, wrongs)
        text = f"Find the Lowest Common Multiple (LCM) of {a} and {b}."
        expl = f"The LCM of {a} and {b} is {lcm}."
    return {"text": text, "options": options, "answer": ans, "explanation": expl,
            "difficulty": "medium", "tags": ["hcf-lcm"]}

GENERATORS = [q_simple_interest, q_simultaneous, q_percentage_profit, q_ratio_simplify,
              q_pythagoras, q_area_rectangle, q_linear_eq, q_speed_distance, q_average,
              lambda: q_hcf_lcm("hcf"), lambda: q_hcf_lcm("lcm")]

def generate(n, exam_code, subject_name):
    out = []
    seen_texts = set()
    tries = 0
    while len(out) < n and tries < n*20:
        tries += 1
        gen = random.choice(GENERATORS)
        q = gen()
        if q["text"] in seen_texts:
            continue
        seen_texts.add(q["text"])
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

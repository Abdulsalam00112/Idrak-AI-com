import random, json, sys
sys.path.insert(0, '.')
from bank_english import WORDS, IDIOMS, GRAMMAR

def opts(correct, wrongs, labels="ABCD"):
    vals = [correct] + wrongs
    random.shuffle(vals)
    return [{"id": labels[i], "text": vals[i]} for i in range(len(vals))], labels[vals.index(correct)]

def build_pool():
    pool = []
    all_syns = [w[1] for w in WORDS]
    all_ants = [w[2] for w in WORDS]
    for word, syn, ant in WORDS:
        wrongs = random.sample([s for s in all_syns if s != syn], 3)
        options, ans = opts(syn, wrongs)
        pool.append({"text": f"Choose the word or phrase nearest in meaning to '{word}'.", "options": options, "answer": ans,
                     "explanation": f"'{word.capitalize()}' means '{syn}'.", "difficulty": "medium", "tags": ["vocabulary","synonyms"]})
        wrongs2 = random.sample([a for a in all_ants if a != ant], 3)
        options2, ans2 = opts(ant, wrongs2)
        pool.append({"text": f"Choose the word or phrase most nearly opposite in meaning to '{word}'.", "options": options2, "answer": ans2,
                     "explanation": f"'{word.capitalize()}' means '{syn}'; its opposite is '{ant}'.", "difficulty": "medium", "tags": ["vocabulary","antonyms"]})
    all_idiom_meanings = [i[1] for i in IDIOMS]
    for idiom, meaning in IDIOMS:
        wrongs = random.sample([m for m in all_idiom_meanings if m != meaning], 3)
        options, ans = opts(meaning, wrongs)
        pool.append({"text": f"What does the idiom '{idiom}' mean?", "options": options, "answer": ans,
                     "explanation": f"'{idiom.capitalize()}' means {meaning}.", "difficulty": "medium", "tags": ["idioms"]})
    for sentence, correct, wrongs, expl in GRAMMAR:
        options, ans = opts(correct, wrongs)
        pool.append({"text": sentence, "options": options, "answer": ans, "explanation": expl, "difficulty": "medium", "tags": ["grammar"]})
    return pool

def generate(n, exam_code, subject_name, seed):
    random.seed(seed)
    pool = build_pool()
    random.shuffle(pool)
    chosen = pool[:n]
    out = []
    for q in chosen:
        out.append({
            "examCode": exam_code, "subjectName": subject_name, "questionText": q["text"],
            "options": q["options"], "correctAnswer": q["answer"], "explanation": q["explanation"],
            "explanationSource": "idrak_generated", "difficulty": q["difficulty"],
            "contentType": "generated", "isHighYield": False, "tags": q["tags"],
        })
    return out, len(pool)

if __name__ == "__main__":
    n = int(sys.argv[1]); exam = sys.argv[2]; subject = sys.argv[3]; seed = int(sys.argv[4])
    out, pool_size = generate(n, exam, subject, seed)
    print(json.dumps(out))

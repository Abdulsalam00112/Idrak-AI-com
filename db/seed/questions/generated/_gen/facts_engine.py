"""Generic fact-bank -> MCQ engine. Each bank entry: (question, correct_answer, explanation, difficulty, tags_list)."""
import random, hashlib

def make_mcq(entry, all_answers, rng):
    q, correct, expl, diff, tags = entry
    pool = [a for a in all_answers if a != correct]
    wrongs = rng.sample(pool, 3) if len(pool) >= 3 else (pool + ["None of the above"] * (3 - len(pool)))
    vals = [correct] + wrongs
    rng.shuffle(vals)
    labels = "ABCD"
    options = [{"id": labels[i], "text": vals[i]} for i in range(4)]
    answer = labels[vals.index(correct)]
    return {"text": q, "options": options, "answer": answer, "explanation": expl, "difficulty": diff, "tags": tags}

def bank_to_questions(bank, exam_code, subject_name, n, seed):
    rng = random.Random(seed)
    all_answers = [b[1] for b in bank]
    entries = bank.copy()
    rng.shuffle(entries)
    chosen = entries[:n]
    out = []
    for entry in chosen:
        mcq = make_mcq(entry, all_answers, rng)
        out.append({
            "examCode": exam_code, "subjectName": subject_name, "questionText": mcq["text"],
            "options": mcq["options"], "correctAnswer": mcq["answer"], "explanation": mcq["explanation"],
            "explanationSource": "idrak_generated", "difficulty": mcq["difficulty"],
            "contentType": "generated", "isHighYield": False, "tags": mcq["tags"],
        })
    return out, len(bank) < n

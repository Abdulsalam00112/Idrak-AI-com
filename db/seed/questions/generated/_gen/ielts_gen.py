import random, json, sys
sys.path.insert(0, '.')
from bank_ielts import READING_TEMPLATES, LISTENING_TEMPLATES, WRITING_BANK, SPEAKING_BANK

def opts(correct, wrongs, labels="ABCD"):
    vals = [correct] + wrongs
    random.shuffle(vals)
    return [{"id": labels[i], "text": vals[i]} for i in range(len(vals))], labels[vals.index(correct)]

def wrap(exam, subject, text, options, ans, expl, tags):
    return {"examCode": exam, "subjectName": subject, "questionText": text, "options": options,
            "correctAnswer": ans, "explanation": expl, "explanationSource": "idrak_generated",
            "difficulty": "medium", "contentType": "generated", "isHighYield": False, "tags": tags}

def reading_questions(exam, subject):
    out = []
    topics = [t["topic"] for t in READING_TEMPLATES]
    for t in READING_TEMPLATES:
        # True/False/Not Given
        opts_list = [{"id": "A", "text": "True"}, {"id": "B", "text": "False"}, {"id": "C", "text": "Not Given"}]
        ans = {"True": "A", "False": "B", "Not Given": "C"}[t["tfng_answer"]]
        out.append(wrap(exam, subject, f"Passage: \"{t['passage']}\" Does the following statement agree with the passage? \"{t['tfng_statement']}\"",
                         opts_list, ans, t["tfng_expl"], ["true-false-not-given"]))
        # vocabulary in context
        options, vans = opts(t["vocab_answer"], t["vocab_wrongs"])
        out.append(wrap(exam, subject, f"In the passage about {t['subject_word']}, the word '{t['vocab_word']}' most nearly means:",
                         options, vans, f"'{t['vocab_word'].capitalize()}' means '{t['vocab_answer'].lower()}' in this context.", ["vocabulary-in-context"]))
        # gist / main idea
        wrong_topics = random.sample([x for x in topics if x != t["topic"]], 3)
        options2, gans = opts(t["topic"].capitalize(), [w.capitalize() for w in wrong_topics])
        out.append(wrap(exam, subject, f"Passage: \"{t['passage']}\" What is this passage primarily about?",
                         options2, gans, f"The passage is primarily about {t['topic']}.", ["main-idea"]))
    return out

def listening_questions(exam, subject):
    out = []
    topics = [t["topic"] for t in LISTENING_TEMPLATES]
    for t in LISTENING_TEMPLATES:
        options, ans = opts(t["answer"], t["wrongs"])
        out.append(wrap(exam, subject, f"Transcript: \"{t['transcript']}\" {t['question']}",
                         options, ans, t["expl"], ["listening-for-detail"]))
        wrong_topics = random.sample([x for x in topics if x != t["topic"]], 3)
        options2, gans = opts(t["topic"].capitalize(), [w.capitalize() for w in wrong_topics])
        out.append(wrap(exam, subject, f"Transcript: \"{t['transcript']}\" What is this announcement mainly about?",
                         options2, gans, f"The transcript is mainly about {t['topic']}.", ["listening-for-gist"]))
    return out

def writing_questions(exam, subject):
    out = []
    for q, correct, wrongs, expl in WRITING_BANK:
        options, ans = opts(correct, wrongs)
        out.append(wrap(exam, subject, q, options, ans, expl, ["writing-strategy"]))
    return out

def speaking_questions(exam, subject):
    out = []
    for q, correct, wrongs, expl in SPEAKING_BANK:
        options, ans = opts(correct, wrongs)
        out.append(wrap(exam, subject, q, options, ans, expl, ["speaking-strategy"]))
    return out

if __name__ == "__main__":
    kind = sys.argv[1]; exam = sys.argv[2]; subject = sys.argv[3]; seed = int(sys.argv[4])
    random.seed(seed)
    fn = {"reading": reading_questions, "listening": listening_questions, "writing": writing_questions, "speaking": speaking_questions}[kind]
    print(json.dumps(fn(exam, subject)))

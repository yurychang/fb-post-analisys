import json
from ckiptagger import data_utils, construct_dictionary, WS, POS, NER

ws = WS("./ckip_tagger_model")
pos = POS("./ckip_tagger_model")
ner = NER("./ckip_tagger_model")

with open("posts.json", "r", encoding="utf-8") as file:
    post = json.load(file)

sentence_list = post['posts']

word_sentence_list = ws(
    sentence_list,
)

pos_sentence_list = pos(word_sentence_list)

entity_sentence_list = ner(word_sentence_list, pos_sentence_list)


def print_word_pos_sentence(word_sentence, pos_sentence):
    assert len(word_sentence) == len(pos_sentence)
    for word, pos in zip(word_sentence, pos_sentence):
        print(f"{word}({pos})", end="\u3000")
    print()
    return


jsonData = {
    'result': []
}

jsonData['result'] = list(map(lambda set: sorted(set), entity_sentence_list))

with open("results.json", "w", encoding="utf-8") as file:
    json.dump(jsonData, file, ensure_ascii=False)

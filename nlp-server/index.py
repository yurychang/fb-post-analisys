import json
from ckiptagger import data_utils, construct_dictionary, WS, POS, NER

ws = WS("./data")
pos = POS("./data")
ner = NER("./data")

with open("posts.json", "r", encoding="utf-8") as file:
    posts = json.load(file)

posts = posts['posts']

sentence_list = posts

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
for i, sentence in enumerate(sentence_list):
    # print()
    # print(f"'{sentence}'")
    # print_word_pos_sentence(word_sentence_list[i],  pos_sentence_list[i])

    post_ner_result = sorted(entity_sentence_list[i])

    # for entity in post_ner_result:
    #     print(type(entity), entity)

    dict_from_array = {
        index: tuple_ for index, tuple_ in enumerate(post_ner_result)
    }
    jsonData["result"].append(dict_from_array)

with open("results.json", "w", encoding="utf-8") as file:
    json.dump(jsonData, file, ensure_ascii=False)

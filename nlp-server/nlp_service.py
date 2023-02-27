from ckiptagger import WS, POS, NER

ws = WS("./data")
pos = POS("./data")
ner = NER("./data")


def analyze_ner(sentence_list):
    word_sentence_list = ws(
        sentence_list,
    )
    pos_sentence_list = pos(word_sentence_list)
    entity_sentence_list = ner(word_sentence_list, pos_sentence_list)

    return list(map(lambda set: sorted(set), entity_sentence_list))

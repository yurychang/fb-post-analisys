const captureAllTextNode = (element) => {
    let textNodes = [];
    for (const node of element.childNodes.values()) {
        switch (node.nodeType) {
            case 1:
                textNodes = [...textNodes, ...captureAllTextNode(node)];
                break;

            case 3:
                textNodes.push(node);
                break;
        }
    }
    return textNodes;
};

module.exports = captureAllTextNode;

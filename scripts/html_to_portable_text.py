"""Convert simple HTML (paragraphs, headings, lists, bold, italic, links) to Sanity Portable Text."""
import random, string
from bs4 import BeautifulSoup, NavigableString, Tag

def key():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))

def inline(node, marks, mark_defs, spans):
    """Walk inline content, producing spans."""
    if isinstance(node, NavigableString):
        text = str(node)
        if text and text.strip('\n') != '':
            spans.append({'_type': 'span', '_key': key(), 'text': text.replace('\n', ' '), 'marks': list(marks)})
        return
    if not isinstance(node, Tag):
        return
    name = node.name.lower()
    new_marks = list(marks)
    if name in ('strong', 'b'):
        new_marks.append('strong')
    elif name in ('em', 'i'):
        new_marks.append('em')
    elif name == 'a' and node.get('href'):
        k = key()
        mark_defs.append({'_type': 'link', '_key': k, 'href': node['href']})
        new_marks.append(k)
    elif name == 'br':
        spans.append({'_type': 'span', '_key': key(), 'text': '\n', 'marks': list(marks)})
        return
    for child in node.children:
        inline(child, new_marks, mark_defs, spans)

def block(node, style='normal', list_item=None, level=None):
    spans, mark_defs = [], []
    inline(node, [], mark_defs, spans)
    # merge adjacent spans with identical marks, trim outer whitespace
    merged = []
    for s in spans:
        if merged and merged[-1]['marks'] == s['marks']:
            merged[-1]['text'] += s['text']
        else:
            merged.append(s)
    if merged:
        merged[0]['text'] = merged[0]['text'].lstrip()
        merged[-1]['text'] = merged[-1]['text'].rstrip()
    merged = [s for s in merged if s['text'] != '']
    if not merged:
        return None
    if style in ('h2', 'h3'):
        for sp in merged:
            sp['marks'] = [m for m in sp['marks'] if m != 'strong']
    b = {'_type': 'block', '_key': key(), 'style': style, 'markDefs': mark_defs, 'children': merged}
    if list_item:
        b['listItem'] = list_item
        b['level'] = level or 1
    return b

def convert(html):
    soup = BeautifulSoup(html, 'html.parser')
    out = []
    def walk(container):
        for node in container.children:
            if isinstance(node, NavigableString):
                if node.strip():
                    b = block(node)
                    if b: out.append(b)
                continue
            if not isinstance(node, Tag):
                continue
            name = node.name.lower()
            if name in ('p',):
                b = block(node)
                if b: out.append(b)
            elif name in ('h1', 'h2', 'h3'):
                b = block(node, 'h2')
                if b: out.append(b)
            elif name in ('h4', 'h5', 'h6'):
                b = block(node, 'h3')
                if b: out.append(b)
            elif name == 'blockquote':
                b = block(node, 'blockquote')
                if b: out.append(b)
            elif name in ('ul', 'ol'):
                kind = 'bullet' if name == 'ul' else 'number'
                for li in node.find_all('li', recursive=False):
                    b = block(li, 'normal', kind, 1)
                    if b: out.append(b)
            elif name in ('div', 'section', 'article', 'span', 'figure', 'main'):
                if node.find(['p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'div'], recursive=False) is not None:
                    walk(node)
                else:
                    b = block(node)
                    if b: out.append(b)
            elif name in ('script', 'style', 'img', 'button', 'form'):
                continue
            else:
                b = block(node)
                if b: out.append(b)
    walk(soup)
    return out

def from_text(text, style='normal'):
    """Plain paragraphs separated by blank lines -> blocks. Lines starting with '- ' become bullets."""
    blocks = []
    for para in [p.strip() for p in text.strip().split('\n\n') if p.strip()]:
        lines = para.split('\n')
        if all(l.startswith('- ') for l in lines):
            for l in lines:
                blocks.append({'_type': 'block', '_key': key(), 'style': 'normal', 'listItem': 'bullet', 'level': 1, 'markDefs': [], 'children': [{'_type': 'span', '_key': key(), 'text': l[2:], 'marks': []}]})
        elif para.startswith('## '):
            blocks.append({'_type': 'block', '_key': key(), 'style': 'h2', 'markDefs': [], 'children': [{'_type': 'span', '_key': key(), 'text': para[3:], 'marks': []}]})
        else:
            blocks.append({'_type': 'block', '_key': key(), 'style': style, 'markDefs': [], 'children': [{'_type': 'span', '_key': key(), 'text': ' '.join(lines), 'marks': []}]})
    return blocks

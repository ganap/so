import imp
from bs4 import BeautifulSoup
HTML_ALLOWED_ATTRS = ['label']
HTML_SKIP_SYMB = [")", "(", "+", "-", " ", "[", "]",
                  "*", ">>", ":", ".", "%", '"']


class PyJsTranslationFind:

    def __init__(self, filepath):
        f = open(filepath)
        text = f.read()
        self.text = text.replace("\n", '').replace("\t", "")
        self.tr = []
        self._TR = "_TR("
        self.trgen_html = []
        self._TRGEN_HTML = "_TRGEN_HTML("

    def get_last_brace(self, line, index):
        lb = line.find(")", index)
        lbcheck = line.find("(", index)
        print(lb, lbcheck)
        if lbcheck < lb and lbcheck != -1:
            return self.get_last_brace(line, lb + 1)
        return lb

    def clean_line(self, line):
        if not len(line):
            return None
        i = 0
        while line[i] == ' ':
            i += 1
        if i > 0:
            line = line[i:]
        if line[0] == '"' or line[0] == "'":
            line = line[1:]
        if not len(line):
            return None
        if line[-1] == '"' or line[-1] == "'":
            line = line[:-1]
        return line

    def find_tr(self):
        i = self.text.find(self._TR)
        while i != -1:
            i += len(self._TR)
            i2 = self.get_last_brace(self.text, i)
            line = self.text[i:i2]
            line = self.clean_line(line)
            if line:
                self.tr.append(line)
            i = self.text.find(self._TR, i2)

    def find_trgen_html(self):
        i = self.text.find(self._TRGEN_HTML)
        while i != -1:
            i += len(self._TRGEN_HTML)
            i2 = self.get_last_brace(self.text, i)
            line = self.text[i:i2]
            line = self.clean_line(line)
            self.trgen_html.append(line)
            i = self.text.find(self._TRGEN_HTML, i2)


class PyModuleConstantsFind:

    def __init__(self, filepath):
        self.module = imp.load_source('', filepath)
        self.tr = []

    def find_tr(self):
        for attr in dir(self.module):
            if attr[0] == '_':
                continue
            d = getattr(self.module, attr)
            if type(d) == type({}):
                for key in d.keys():
                    self.tr.append(d[key])


def can_add_string_to_translation(line):
    def clean(line):
        for r in HTML_SKIP_SYMB:
            line = line.replace(r, "")
        return line
    line = clean(line)
    if line[:2] == '{{' and line[-2:] == '}}':
        return False
    if line[:1] == "'" and line[-1] == "'" and line.find('/static/') > -1:
        return False

    ind1 = line.find("{{")
    ind2 = line.rfind("}}")
    if ind1 > -1 and ind2 > -1:
        clean_line = line[ind1 + 1:ind2]
        if len(clean_line) < 1:
            return False
    if len(line) < 1:
        return False
    return True


class HtmlTranslationFind:

    def __init__(self, filepath):
        html = BeautifulSoup(open(filepath))
        self.all_tags = html.findAll()
        self.tr = []

    def rm_spaces(self, line):
        try:
            line = line.replace("\t", '')
            line = line.replace("\n", '')
        except:
            return None

        if len(line) > 0:
            if line[0] == ' ':
                line = line[1:]
            if len(line) == 0:
                return None
            if line[-1] == " ":
                line = line[:-1]
            if len(line) == 0:
                return None
            return line
        return None

    def collect_from_html_attrs(self, attrs):
        for a in HTML_ALLOWED_ATTRS:
            if a in attrs.keys():
                l = attrs[a]
                l = self.rm_spaces(l)
                if not l:
                    continue
                can = can_add_string_to_translation(l)
                if can:
                    self.tr.append(l)

    def find_tr(self):
        for tag in self.all_tags:
            attrs = tag.attrs
            self.collect_from_html_attrs(attrs)
            if tag.name == 'style' or tag.name == 'cript':
                continue
            text = tag.string
            if not text:
                continue
            text = self.rm_spaces(text)
            if not text:
                continue
            if text.find("{%") > -1 and text.find("%}") > -1:
                continue
            if text.find("$") > -1 and text.find("#") > -1:
                continue
            if text[0] == "#":
                continue
            try:
                float(text)
                continue
            except:
                pass

            can = can_add_string_to_translation(text)
            if can:
                self.tr.append(text)

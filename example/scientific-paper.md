---
Metadata: This document has meta-data in the YAML format
Author: Lesosoftware
---

XIV

# Abstract

This is an example for a scientific paper written in Paged-Markdown 3. Its purpose is to showcase some of the document format's features, like automatic pagination, manual page-breaks, page-number styles, tables of contents, footnotes and figures. Feel free to hack around and try out the syntax explained throughout the text.

--

# Table Of Contents

- [Abstract](#abstract)
- [Table Of Contents](#table-of-contents)
- [Table Of Figures](#table-of-figures)
- [Main Headline](#main-headline)
  - [Sub Headline](#sub-headline)
- [Late Headline](#late-headline)

# Table Of Figures

- [Figure 1: Logarithm visualization tree](#figure-1)
- [Figure 2: Bar chart of editors by week](#figure-2)

--
0123

# Main Headline

## Sub Headline

<col-2>

The _zero_ (0) before the `123`-directive signals we want to reset page counting.

Let's put a decent amount of text on this first page, so we can test text alignment and justification.

![Figure 1: Logarithm visualization tree (2015, G. Snyder – CC BY 3.0)](https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Logarithm_visualization_tree.svg/640px-Logarithm_visualization_tree.svg.png)

Above we can see our first figure; nicely placing itself between the paragraphs. So far, everything looks really nice and wonderful! _Marvelous~_.

Since we are writing in Markdown, we can extend our document using HTML at any point. For example, this page uses a custom element-tag _`<col-2>`_, which distributes text into a left and a right column.

The `<col-2>`-tag is defined inside our automatically loaded user stylesheet file `design.css`.

This last paragraph included inside the two-sided area generates enough vertical space for the sentences just below [Figure 1](#figure-1), to move to the left column.

</col-2>

At this point we have closed the _`<col-2>`_-tag, causing the text to use the full width of the page again. As a last feature showcased on this page, it is time¹ for some footnotes²!

![Figure 2: Bar chart of editors by week (2020, M. Miller – CC BY-SA 4.0)](https://upload.wikimedia.org/wikipedia/commons/c/cc/Graph_of_suggested_editors_by_week_2020-11-20.png)

<col-2>

Note, how the two footnotes are defined _below_ this very sentence – yet, they are rendered on page 1.

This happens because Paged Markdown automatically places footnotes on the page they are first referenced on. Moreover, we just experienced an automatic page-break. As one would expect, the document format automatically breaks contents onto the next page whenever they exceed the bounds of the previous one.

</col-2>

-- ¹ This is a test for a footnote.
   ² Another Footnote (wow :D) it is much amazing.

# Late Headline

<col-2>

This is the last page of the document.

We just experienced a manual page-break. It is syntactically expressed by two dashes `--` that may be followed by optional page-numbering directives and footnote-definitions.

If you check in the [Table Of Contents](#table-of-contents) (_TOC_), you will notice that the document format places numbers behind entries automatically, based on what the entry references.

A TOC-entry could point to a headline or really any figure or other element in the document, as long as that element has an `id="..."` (attribute) in the final HTML.

Paged Markdown automatically assigns `id`s to any image with a text description (`#figure-1`, `#figure-2`, ...), as well as tables (`#table-1`, `#table-2`, ...).

</col-2>

<script src="dist/paged.js"></script>

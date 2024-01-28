# Testing code examples, but better

I've spent a long time working on content (such as tutorials) for unstable
software. Part of this involved regularly scrambling to fix code examples that
had stopped working, often introducing new problems in the process.

Fixing code examples is particularly prone to human errors when the content is
technical and you weren't the person that wrote it. The person updating the
code will always get the examples running (since that's what produces the
"green tick"), but they'll often miss prose that needs updating with the code,
or not realise the code examples produce nonsense results. This is even more
easily missed by reviewers.

Most projects run their code examples regularly to check they "work", but this
only checks the code examples don't raise errors. It doesn't care if the code
doesn't do what the prose claims.

The rest of this blog post describes a simple way to catch these bugs in
technical content, and make it easier to fix them.

## Tl;dr: Writing content tests

This guide is for content in [Jupyter notebooks](https://jupyter.org/), but
should be easy to apply to other formats. The following example "notebook"
contains a code example and some markdown that references that code example.

> ### Example notebook
>
> The following cell imports and calls `my_function`. The output is `None`.
> 
> ```python
> from my_package import function
> my_function()
> ```
> ```output
> None
> ```

To implement a content test, we need two things: A reference to the markdown
we're testing, and some code that will fail if the markdown doesn't match the
code examples.

To do this, simply add a "test" code cell immediately after the existing code
cell, including the markdown reference as a comment. You may want to use a
prefix to mark your content references, similar to [Pylint's
approach](https://pylint.pycqa.org/en/latest/user_guide/messages/message_control.html#block-disables).

> ```python
> #| content: The output is `None`.
> assert _ is None
> ```

This approach requires no extra dependencies. It uses two built-in features of
Jupyter notebooks:

1. The [output caching system](https://ipython.readthedocs.io/en/stable/interactive/reference.html#output-caching-system)
   makes it easy to check the inputs and outputs of the last-run code cell.
   Most useful is the underscore containing the last-run cell's output (used in
   the earlier example).

2. [Cell tags](https://jupyterbook.org/en/stable/content/metadata.html#adding-tags-using-notebook-interfaces)
   can hide these tests from readers. A `remove-cell` tag prevents cells from
   appearing in [Jupyter
   Book](https://jupyterbook.org/en/stable/interactive/hiding.html#removing-code-cell-content)
   and
   [MyST-nb](https://myst-nb.readthedocs.io/en/latest/render/hiding.html#remove-parts-of-cells),
   and it's pretty easy to add this ability to
   [nbconvert](https://nbconvert.readthedocs.io/en/latest/removing_cells.html)
   or custom notebook parsers.

If the behaviour of the cell changes (either due to `my_package` changing, or
someone editing the code examples), running this notebook will raise an error
and, importantly, you have a comment explaining why the test failed.

It catches cases in which the library changes how the function works, and will
remind anyone updating the code to update the text too.

You could get even crazier and use the [_input_ caching
system](https://ipython.readthedocs.io/en/stable/interactive/reference.html#input-caching-system)
to check a code cell uses specific functions if you refer to them in the copy.

> ```python
> #| content: the following cell imports and calls `my_function`
> assert "import" in _i
> assert "my_function" in _i
> ```


## The last step

What this setup doesn't catch is the case in which someone updates the
_markdown_ but not the _code_. This is rarer in my experience, but still easy
to check for. I expect most repositories won't need such a tool, but for
completion I've created
[`content-test-enforcer`](https://github.com/frankharkins/content-test-enforcer).
To use it, simply add tests of the form above, then run `content-test-enforcer`
on your notebooks.

The script looks for comments starting with `#| content:` and checks their
references exist somewhere in the markdown. It also checks cells with content
test comments have `remove-cell` tags.

# RikaCodeTemplate


> 这是个更高级的代码模板工具, 类似vscode自带的代码片段功能, 但更高级.
> 
> 详细的中文介绍在英文介绍下面.
>
> The Chinese introduction is after the English introduction

More advance Code Template Tool than the snippets with vscode. 

`RikaCodeTemplate` parses and replaces entire lines with `regex`, so more complex code generation can be achieved.

``` go
// If in golang ...
// input:
Dog func Run
// run command "rikacodetemplate.run"
// get:
func (d Dog)Run()
```

## How to add template

The template object is stored in the `rikacodetemplate.templates` configuration item. This object requires three properties:

- `language` Use a regular expression to indicate the language this template applies to, such as `java` or `c|c\\+\\+|csharp`.

- `regex` A regular expression, This template will only be triggered if the regular expression matches successfully, for example `(\\w+).func` can match the line content of `abc.func`.

- `template` Template, which can be a string or a list containing strings, each element in the list representing a line, use `{!` and `!}` to reference matching results in templates.

```json
"rikacodetemplate.templates": [
    {
        "language": ".*",
        "regex": "h (.+)",
        "template": "hello {!1!}!"
    }
]
```

```
# input:
h ABC
# get:
hello ABC!
```
## reference match in template

use `{!` and `!}` to reference matching results in templates, `{!0!}` is the complete content that is matched, and `{!1!}` is the content within the first bracket that is matched.

You can add filters to `{!x!}`, for example to convert the matched content to all uppercase: `{!0 toUpper!}`.

Similar filters are `toLower` `toLower` `first` `firstLetter` `length`, these filters can be used in multiple concatenations, for example `{!2 first toLower!}` can put the first letter of the second match Letters are preserved and converted to lowercase.

> There are better examples at the end of the documentation, which are already integrated in the default settings.

# == 中文介绍 ==

`RikaCodeTemplate` 使用 `正则` 解析整行内容并替换，因此可以进行更复杂的代码生成。

``` go
// 假设在使用 golang 编程
// 输入一行:
Dog func Run
// 运行编辑器命令 "rikacodetemplate.run" 后
// 得到:
func (d Dog)Run()
```

## 如何添加代码模板

在 `rikacodetemplate.templates` 配置项中存放模板对象，这个对象需要三个属性：

- `language` 使用正则表达式表示该模板应用的语言，例如`java`或`c|c\\+\\+|csharp`.

- `regex` 匹配规则, 只有当这个规则匹配成功时才会触发这个模板, 例如`(\\w+).func`可以匹配`abc.func`这行内容.

- `template` 模板, 可以是一个字符串或一个包含字符串的列表, 列表中的每个元素代表一行, 在模板中使用 `{!`和`!}` 引用匹配结果.

```json
"rikacodetemplate.templates": [
    {
        "language": ".*",
        "regex": "h (.+)",
        "template": "hello {!1!}!"
    }
]
```

```
# 输入一行:
h ABC
# 转换后:
hello ABC!
```

## 模板引用匹配项

在模板中使用 `{!X!}` 的语法引用正则匹配到的某个元素, `{!0!}`是匹配到的完整内容, `{!1!}`是匹配到的第一个括号内的内容.

可以在`{!` `!}`中添加过滤器实现特殊操作, 例如将匹配到的内容转换成全大写: `{!0 toUpper!}`.

类似的过滤器还有`toLower` `toLower` `first` `firstLetter` `length`, 这些过滤器可以多个串联使用, 例如`{!2 first toLower!}`可以把第二个匹配项的首字母保留并转换成小写.

## 模板例子(默认集成在插件中)
## Example

```json
"rikacodetemplate.templates": [
    {
        "language": "go",
        "regex": "^(\\*?\\w+) func$",
        "template": [
            "func ({!1 firstLetter toLower!} {!1!})$1($2){",
            "\t$3",
            "}"
        ]
    },
    {
        "language": "go",
        "regex": "^(\\*?\\w+) func (\\w+)$",
        "template": [
            "func ({!1 firstLetter toLower!} {!1!}){!2!}($1){",
            "\t$2",
            "}"
        ]
    },
    {
        "language": "java|csharp",
        "regex": "^(.*).var$",
        "template": "var $1 = {!1!};"
    },
    {
        "language": "javascript",
        "regex": "^(.*).let$",
        "template": "let $1 = {!1!}"
    }
]
```


# hello

一个用于练习 Codex 的最小 `Hello World` 项目。

## 功能
- 在命令行中循环读取用户名字
- 输出 `Hello, <name>!`
- 如果用户直接回车，则输出 `Hello, World!`
- 输入退出命令（`exit` / `quit` / `q` / `退出`）后结束程序

## 环境要求
- Python 3.8+

## 快速开始
在项目根目录运行：

```bash
python3 main.py
```

程序会不断提示你输入名字，直到你输入退出命令。

## 示例：连续对话并退出

```bash
$ python3 main.py
欢迎使用 Hello 程序，输入名字即可打招呼。
输入 exit / quit / q / 退出 可结束程序。
请输入你的名字（直接回车使用默认值）: Alice
Hello, Alice!
请输入你的名字（直接回车使用默认值）:
Hello, World!
请输入你的名字（直接回车使用默认值）: 退出
对话已结束，再见！
```

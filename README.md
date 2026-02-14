# hello

一个用于练习 Codex 的最小 `Hello World` 项目（v1）。

## 功能
- 在命令行中读取用户名字
- 输出 `Hello, <name>!`
- 如果用户直接回车，则输出 `Hello, World!`

## 环境要求
- Python 3.8+

## 快速开始
在项目根目录运行：

```bash
python3 main.py
```

程序会提示你输入名字：

```text
请输入你的名字（直接回车使用默认值）:
```

### 示例 1：输入名字

```bash
$ python3 main.py
请输入你的名字（直接回车使用默认值）: Alice
Hello, Alice!
```

### 示例 2：直接回车

```bash
$ python3 main.py
请输入你的名字（直接回车使用默认值）:
Hello, World!
```

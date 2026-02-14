"""Simple CLI entrypoint for hello-codex v1."""

from greet import build_greeting

EXIT_COMMANDS = {"exit", "quit", "q", "退出"}


def main() -> None:
    print("欢迎使用 Hello 程序，输入名字即可打招呼。")
    print("输入 exit / quit / q / 退出 可结束程序。")

    while True:
        name = input("请输入你的名字（直接回车使用默认值）: ").strip()
        if name.lower() in EXIT_COMMANDS or name in EXIT_COMMANDS:
            print("对话已结束，再见！")
            break
        print(build_greeting(name))

def main() -> None:
    name = input("请输入你的名字（直接回车使用默认值）: ")
    print(build_greeting(name))


if __name__ == "__main__":
    main()

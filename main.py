"""Simple CLI entrypoint for hello-codex."""

from greet import build_greeting

EXIT_COMMANDS_EN = {"exit", "quit", "q"}
EXIT_COMMAND_CN = "退出"


def main() -> None:
    print("欢迎使用 Hello 程序，输入名字即可打招呼。")
    print("输入 exit / quit / q / 退出 可结束程序。")

    while True:
        raw = input("请输入你的名字（直接回车使用默认值）: ")
        normalized = raw.strip()

        if normalized.lower() in EXIT_COMMANDS_EN or normalized == EXIT_COMMAND_CN:
            print("对话已结束，再见！")
            break

        print(build_greeting(normalized))


if __name__ == "__main__":
    main()

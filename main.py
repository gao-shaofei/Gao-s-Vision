"""Simple CLI entrypoint for hello-codex v1."""

from greet import build_greeting


def main() -> None:
    name = input("请输入你的名字（直接回车使用默认值）: ")
    print(build_greeting(name))


if __name__ == "__main__":
    main()

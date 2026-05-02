import unittest

from flow_manager import apply_action, apply_command, build_progress, initialize_session, parse_command


class FlowManagerTests(unittest.TestCase):
    def test_parse_goto_command(self) -> None:
        self.assertEqual(parse_command("go to voting"), ("goto", "voting"))

    def test_next_moves_to_nomination(self) -> None:
        session = initialize_session("beginner", "guided")
        session = apply_action(session, "next")
        self.assertEqual(session.current_stage, 1)
        self.assertEqual(build_progress(session.current_stage), "[✔✔⬜⬜⬜⬜⬜]")

    def test_goto_moves_to_named_stage(self) -> None:
        session = initialize_session("student", "guided")
        session = apply_command(session, "go to counting")
        self.assertEqual(session.current_stage, 5)


if __name__ == "__main__":
    unittest.main()

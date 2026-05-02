import unittest

from flow_manager import apply_action, initialize_session
from prompt_engine import build_response, format_response_card


class PromptEngineTests(unittest.TestCase):
    def test_timeline_mode_includes_all_events(self) -> None:
        session = initialize_session("student", "timeline")
        response = build_response(session)
        self.assertEqual(len(response["timeline"]), 7)
        self.assertEqual(response["timeline"][0]["day"], "Day 0")

    def test_formatted_card_contains_actions(self) -> None:
        session = initialize_session("beginner", "guided")
        card = format_response_card(build_response(session))
        self.assertIn("Actions: [Next] [Explain Simple] [Deep Dive] [Quiz]", card)

    def test_mini_summary_appears_after_second_transition(self) -> None:
        session = initialize_session("beginner", "guided")
        session = apply_action(session, "next")
        session = apply_action(session, "next")
        response = build_response(session)
        self.assertIn("Mini summary", response["summary"])


if __name__ == "__main__":
    unittest.main()

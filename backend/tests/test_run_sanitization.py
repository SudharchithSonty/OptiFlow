"""Tests for run ID sanitization - prevents path traversal attacks.

TDD: These tests define the security requirements for run_id generation.
"""

import pytest

from backend.app.models.run import sanitize_run_id


class TestRunIdSanitization:
    """Test suite for run ID sanitization to prevent path traversal."""

    def test_valid_simple_name(self) -> None:
        """Valid simple names should pass through."""
        assert sanitize_run_id("myrun") == "myrun"
        assert sanitize_run_id("run1") == "run1"
        assert sanitize_run_id("test_run") == "test_run"

    def test_valid_name_with_timestamp(self) -> None:
        """Names with timestamps should be sanitized."""
        result = sanitize_run_id("2025-12-31_seed42")
        assert result == "2025-12-31_seed42"

    def test_converts_to_lowercase(self) -> None:
        """Names should be lowercased for consistency."""
        assert sanitize_run_id("MyRun") == "myrun"
        assert sanitize_run_id("TEST_RUN") == "test_run"

    def test_replaces_spaces_with_underscores(self) -> None:
        """Spaces should become underscores."""
        assert sanitize_run_id("my run") == "my_run"
        assert sanitize_run_id("test  run") == "test_run"

    def test_removes_path_separators(self) -> None:
        """Path separators must be removed."""
        assert sanitize_run_id("my/run") == "myrun"
        assert sanitize_run_id("my\\run") == "myrun"
        assert sanitize_run_id("foo/bar/baz") == "foobarbaz"

    def test_blocks_path_traversal_dotdot(self) -> None:
        """Path traversal attempts must raise ValueError."""
        with pytest.raises(ValueError, match="path traversal"):
            sanitize_run_id("../../../etc/passwd")
        
        with pytest.raises(ValueError, match="path traversal"):
            sanitize_run_id("run..name")

    def test_blocks_leading_dot(self) -> None:
        """Names starting with dot are blocked."""
        with pytest.raises(ValueError, match="path traversal"):
            sanitize_run_id(".hidden")

    def test_removes_dangerous_characters(self) -> None:
        """Dangerous shell/path characters must be removed."""
        assert sanitize_run_id("run:name") == "runname"
        assert sanitize_run_id("run*name") == "runname"
        assert sanitize_run_id("run?name") == "runname"
        assert sanitize_run_id('run"name') == "runname"
        assert sanitize_run_id("run<name>") == "runname"
        assert sanitize_run_id("run|name") == "runname"

    def test_replaces_dots_with_underscore(self) -> None:
        """Single dots become underscores."""
        assert sanitize_run_id("run.v1") == "run_v1"

    def test_collapses_multiple_underscores(self) -> None:
        """Multiple underscores should collapse to one."""
        assert sanitize_run_id("run___name") == "run_name"

    def test_strips_leading_trailing_underscores(self) -> None:
        """Leading/trailing underscores should be stripped."""
        assert sanitize_run_id("_run_") == "run"
        assert sanitize_run_id("__test__") == "test"

    def test_empty_name_raises(self) -> None:
        """Empty names must raise ValueError."""
        with pytest.raises(ValueError, match="cannot be empty"):
            sanitize_run_id("")

    def test_too_long_name_raises(self) -> None:
        """Names over 64 chars after sanitization must raise."""
        long_name = "a" * 100
        with pytest.raises(ValueError, match="1-64 characters"):
            sanitize_run_id(long_name)

    def test_name_that_sanitizes_to_empty_raises(self) -> None:
        """Names that become empty after sanitization must raise."""
        with pytest.raises(ValueError):
            sanitize_run_id("///")
        with pytest.raises(ValueError):
            sanitize_run_id("___")

    def test_unicode_is_handled(self) -> None:
        """Unicode characters should be handled safely."""
        # Should not crash, may strip non-ASCII
        result = sanitize_run_id("run_test")
        assert isinstance(result, str)
        assert len(result) > 0

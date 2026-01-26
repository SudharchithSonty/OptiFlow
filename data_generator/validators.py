"""CSV schema validation for generated data."""

import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional


class SchemaValidator:
    """Validate CSV schemas against expected formats."""

    SCHEMAS = {
        "machines.csv": {
            "columns": ["machine_id", "machine_type", "is_bottleneck"],
            "types": {"machine_id": str, "machine_type": str, "is_bottleneck": int},
        },
        "machine_calendar.csv": {
            "columns": ["machine_id", "date", "shift_start", "shift_end"],
            "types": {"machine_id": str, "date": str, "shift_start": str, "shift_end": str},
        },
        "machine_unavailability.csv": {
            "columns": ["machine_id", "start_ts", "duration_min"],
            "types": {"machine_id": str, "start_ts": str, "duration_min": int},
        },
        "sku.csv": {
            "columns": ["sku_id", "family_id", "sku_name", "avg_lot_size"],
            "types": {"sku_id": str, "family_id": str, "sku_name": str, "avg_lot_size": int},
        },
        "routing.csv": {
            "columns": ["sku_id", "op_seq", "op_name", "machine_type", "machine_id", "proc_time_per_unit_min"],
            "types": {
                "sku_id": str,
                "op_seq": int,
                "op_name": str,
                "machine_type": str,
                "machine_id": str,
                "proc_time_per_unit_min": float,
            },
        },
        "order_ops.csv": {
            "columns": ["op_id", "order_id", "sku_id", "op_seq", "op_name", "machine_id", "family_id", "duration_min"],
            "types": {
                "op_id": str,
                "order_id": str,
                "sku_id": str,
                "op_seq": int,
                "op_name": str,
                "machine_id": str,
                "family_id": str,
                "duration_min": float,
            },
        },
        "machine_type_map.csv": {
            "columns": ["machine_type", "machine_id"],
            "types": {"machine_type": str, "machine_id": str},
        },
        "changeover_matrix.csv": {
            "columns": ["machine_type", "from_family", "to_family", "internal_setup_min", "external_setup_min", "first_piece_reject_prob"],
            "types": {
                "machine_type": str,
                "from_family": str,
                "to_family": str,
                "internal_setup_min": int,
                "external_setup_min": int,
                "first_piece_reject_prob": float,
            },
        },
        "orders.csv": {
            "columns": ["order_id", "sku_id", "qty", "release_ts", "due_ts", "priority"],
            "types": {"order_id": str, "sku_id": str, "qty": int, "release_ts": str, "due_ts": str, "priority": int},
        },
        "disruptions.csv": {
            "columns": ["event_id", "event_type", "machine_id", "start_ts", "duration_min", "order_id"],
            "types": {
                "event_id": str,
                "event_type": str,
                "machine_id": object,  # Can be None
                "start_ts": str,
                "duration_min": int,
                "order_id": object,  # Can be None
            },
        },
        "kpi_targets.csv": {
            "columns": ["metric", "baseline_value", "target_value", "timeframe_weeks"],
            "types": {"metric": str, "baseline_value": float, "target_value": float, "timeframe_weeks": int},
        },
    }

    @classmethod
    def validate_file(cls, file_path: Path, schema_name: str) -> List[str]:
        """Validate a CSV file against its schema."""
        errors = []
        if schema_name not in cls.SCHEMAS:
            return [f"Unknown schema: {schema_name}"]

        schema = cls.SCHEMAS[schema_name]
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            return [f"Failed to read CSV: {e}"]

        # Check columns
        expected_cols = set(schema["columns"])
        actual_cols = set(df.columns)
        if expected_cols != actual_cols:
            missing = expected_cols - actual_cols
            extra = actual_cols - expected_cols
            if missing:
                errors.append(f"Missing columns: {missing}")
            if extra:
                errors.append(f"Extra columns: {extra}")

        # Check types (basic check)
        for col, expected_type in schema["types"].items():
            if col not in df.columns:
                continue
            if expected_type == object:  # nullable
                continue
            if df[col].dtype != expected_type and not (
                expected_type == float and pd.api.types.is_numeric_dtype(df[col])
            ):
                errors.append(f"Column {col} has wrong type: expected {expected_type}, got {df[col].dtype}")

        return errors

    @classmethod
    def validate_all(cls, data_dir: Path) -> Dict[str, List[str]]:
        """Validate all CSV files in a directory."""
        results = {}
        for schema_name in cls.SCHEMAS:
            file_path = data_dir / schema_name
            if file_path.exists():
                errors = cls.validate_file(file_path, schema_name)
                results[schema_name] = errors
            else:
                results[schema_name] = [f"File not found: {file_path}"]
        return results


def validate_data(data_dir: str = "data/synthetic") -> bool:
    """Validate all generated data files."""
    data_path = Path(data_dir)
    results = SchemaValidator.validate_all(data_path)
    all_valid = True
    for file_name, errors in results.items():
        if errors:
            print(f"❌ {file_name}:")
            for error in errors:
                print(f"   {error}")
            all_valid = False
        else:
            print(f"✅ {file_name}: Valid")
    return all_valid


if __name__ == "__main__":
    validate_data()



